const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const PERIODS = new Set(['7d', '1m', '3m', '6m', '1y']);

function addMs(d, ms) {
  return new Date(d.getTime() + ms);
}

/** Current window [start, end] and previous window of equal length, in UTC for consistent SQL. */
function windowsForPeriod(period) {
  const end = new Date();
  end.setUTCHours(23, 59, 59, 999);

  let days = 30;
  if (period === '7d') days = 7;
  else if (period === '1m') days = 30;
  else if (period === '3m') days = 90;
  else if (period === '6m') days = 180;
  else if (period === '1y') days = 365;

  const start = addMs(end, -(days * 24 * 60 * 60 * 1000));
  start.setUTCHours(0, 0, 0, 0);

  const spanMs = end.getTime() - start.getTime();
  const prevEnd = addMs(start, -1);
  prevEnd.setUTCHours(23, 59, 59, 999);
  const prevStart = addMs(prevEnd, -spanMs);
  prevStart.setUTCHours(0, 0, 0, 0);

  return { start, end, prevStart, prevEnd, days };
}

function orderAmount(row) {
  const n = parseFloat(row.amount);
  return Number.isFinite(n) ? n : 0;
}

function pctChange(curr, prev) {
  if (prev > 0) return Math.round(((curr - prev) / prev) * 1000) / 10;
  if (curr > 0) return 100;
  return 0;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function bucketCountForPeriod(period) {
  if (period === '7d') return 7;
  if (period === '1m') return 10;
  if (period === '3m') return 12;
  if (period === '6m') return 12;
  return 12;
}

function buildUniformSeries(rows, start, end, period) {
  const n = bucketCountForPeriod(period);
  const t0 = start.getTime();
  const t1 = end.getTime();
  const span = Math.max(1, t1 - t0);
  const buckets = Array.from({ length: n }, (_, i) => ({
    revenue: 0,
    orders: 0,
    midMs: t0 + ((i + 0.5) / n) * span,
  }));

  for (const r of rows) {
    const t = new Date(r.created_at).getTime();
    if (t < t0 || t > t1) continue;
    const idx = Math.min(n - 1, Math.max(0, Math.floor(((t - t0) / span) * n)));
    buckets[idx].orders += 1;
    buckets[idx].revenue += orderAmount(r);
  }

  return buckets.map((b) => {
    const d = new Date(b.midMs);
    const label =
      period === '1y'
        ? `${MONTHS_SHORT[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(-2)}`
        : `${MONTHS_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`;
    return {
      label,
      revenue: Math.round(b.revenue * 100) / 100,
      orders: b.orders,
    };
  });
}

function isExcludedStatus(status) {
  const s = String(status || '').toLowerCase();
  return s === 'cancelled' || s === 'rejected';
}

router.get('/tailor', authenticateToken, async (req, res) => {
  try {
    const role = String(req.user.role || '').toLowerCase();
    if (role !== 'tailor') {
      return res.status(403).json({ success: false, error: { message: 'Tailor access only' } });
    }

    let period = String(req.query.period || '1m').toLowerCase();
    if (!PERIODS.has(period)) period = '1m';

    const [[tailorRow]] = await db.query(
      'SELECT tailor_id FROM tailors WHERE user_id = ? LIMIT 1',
      [req.user.userId]
    );
    if (!tailorRow) {
      return res.json({
        success: true,
        data: {
          period,
          kpis: {
            revenue: 0,
            revenueDeltaPct: 0,
            orders: 0,
            ordersDeltaPct: 0,
            profileViews: 0,
            profileViewsDeltaPct: 0,
            newCustomers: 0,
            newCustomersDeltaPct: 0,
            avgRating: 0,
            reviewCount: 0,
            repeatClients: 0,
            repeatSharePct: 0,
          },
          revenueSeries: [],
          ordersSeries: [],
          topServices: [],
          performance: {
            completionRate: 0,
            avgOrderValue: 0,
            retentionRate: 0,
            onTimeRate: 0,
          },
        },
      });
    }

    const tailorId = tailorRow.tailor_id;
    const { start, end, prevStart, prevEnd, days } = windowsForPeriod(period);

    const [orderRows] = await db.query(
      `SELECT o.order_id, o.customer_id, o.garment_type, o.status, o.created_at,
              o.estimated_completion_date, o.actual_completion_date,
              COALESCE(
                (SELECT p.amount FROM payments p WHERE p.order_id = o.order_id
                 ORDER BY COALESCE(p.payment_date, p.created_at) DESC LIMIT 1),
                o.final_price,
                o.estimated_price,
                0
              ) AS amount
       FROM orders o
       WHERE o.tailor_id = ?
         AND o.created_at >= ?
         AND o.created_at <= ?`,
      [tailorId, prevStart, end]
    );

    const [firstOrderRows] = await db.query(
      `SELECT customer_id, MIN(created_at) AS first_at
       FROM orders
       WHERE tailor_id = ?
         AND status NOT IN ('cancelled', 'rejected')`,
      [tailorId]
    );
    const firstOrderAt = new Map(
      firstOrderRows.map((r) => [r.customer_id, new Date(r.first_at).getTime()])
    );

    const inWindow = (row, ws, we) => {
      const t = new Date(row.created_at).getTime();
      return t >= ws.getTime() && t <= we.getTime();
    };

    const currRows = orderRows.filter((r) => inWindow(r, start, end));
    const prevRows = orderRows.filter((r) => inWindow(r, prevStart, prevEnd));

    const activeCurr = currRows.filter((r) => !isExcludedStatus(r.status));
    const activePrev = prevRows.filter((r) => !isExcludedStatus(r.status));

    const revenueCurr = activeCurr.reduce((s, r) => s + orderAmount(r), 0);
    const revenuePrev = activePrev.reduce((s, r) => s + orderAmount(r), 0);

    const ordersCurr = activeCurr.length;
    const ordersPrev = activePrev.length;

    const uniqCustomers = (rows) => {
      const set = new Set();
      for (const r of rows) {
        if (r.customer_id != null && !isExcludedStatus(r.status)) set.add(r.customer_id);
      }
      return set;
    };

    const ucCurr = uniqCustomers(currRows);
    const ucPrev = uniqCustomers(prevRows);
    const profileViewsProxy = ucCurr.size;

    const newCustomersCurr = [...ucCurr].filter((cid) => {
      const ft = firstOrderAt.get(cid);
      return ft >= start.getTime() && ft <= end.getTime();
    }).length;

    const newCustomersPrev = [...ucPrev].filter((cid) => {
      const ft = firstOrderAt.get(cid);
      return ft >= prevStart.getTime() && ft <= prevEnd.getTime();
    }).length;

    const repeatCurr = [...ucCurr].filter((cid) => {
      const count = currRows.filter(
        (r) => r.customer_id === cid && !isExcludedStatus(r.status)
      ).length;
      return count >= 2;
    }).length;

    const repeatPrev = [...ucPrev].filter((cid) => {
      const count = prevRows.filter(
        (r) => r.customer_id === cid && !isExcludedStatus(r.status)
      ).length;
      return count >= 2;
    }).length;

    let avgRating = 0;
    let reviewCount = 0;
    try {
      const [revRows] = await db.query(
        `SELECT AVG(r.rating) AS avg_r, COUNT(*) AS cnt
         FROM reviews r
         WHERE r.tailor_id = ?
           AND r.status <> 'rejected'`,
        [tailorId]
      );
      if (revRows && revRows[0]) {
        avgRating = revRows[0].avg_r != null ? Math.round(parseFloat(revRows[0].avg_r) * 10) / 10 : 0;
        reviewCount = parseInt(revRows[0].cnt, 10) || 0;
      }
    } catch (_) {
      /* optional table */
    }

    const repeatSharePct =
      ucCurr.size > 0 ? Math.round((repeatCurr / ucCurr.size) * 1000) / 10 : 0;

    const completedCurr = currRows.filter((r) => String(r.status).toLowerCase() === 'completed');
    const completionRate =
      activeCurr.length > 0
        ? Math.round((completedCurr.length / activeCurr.length) * 1000) / 10
        : 0;

    const avgOrderValue =
      ordersCurr > 0 ? Math.round((revenueCurr / ordersCurr) * 100) / 100 : 0;

    const retentionRate = repeatSharePct;

    let onTimeNumer = 0;
    let onTimeDenom = 0;
    for (const r of completedCurr) {
      if (!r.estimated_completion_date || !r.actual_completion_date) continue;
      onTimeDenom += 1;
      const est = new Date(r.estimated_completion_date).getTime();
      const act = new Date(r.actual_completion_date).getTime();
      if (act <= est) onTimeNumer += 1;
    }
    const onTimeRate =
      onTimeDenom > 0 ? Math.round((onTimeNumer / onTimeDenom) * 1000) / 10 : 0;

    const serviceMap = new Map();
    for (const r of activeCurr) {
      const name = (r.garment_type && String(r.garment_type).trim()) || 'Other';
      if (!serviceMap.has(name)) serviceMap.set(name, { orders: 0, revenue: 0 });
      const e = serviceMap.get(name);
      e.orders += 1;
      e.revenue += orderAmount(r);
    }
    const topServices = [...serviceMap.entries()]
      .map(([name, v]) => ({
        name,
        orders: v.orders,
        revenue: Math.round(v.revenue * 100) / 100,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
    const totalRev = topServices.reduce((s, x) => s + x.revenue, 0) || 1;
    topServices.forEach((s) => {
      s.sharePct = Math.round((s.revenue / totalRev) * 1000) / 10;
    });

    const rawSeries = buildUniformSeries(activeCurr, start, end, period);
    const revenueSeries = rawSeries.map((b) => ({ label: b.label, value: b.revenue }));
    const ordersSeries = rawSeries.map((b) => ({ label: b.label, value: b.orders }));

    res.json({
      success: true,
      data: {
        period,
        windowDays: days,
        kpis: {
          revenue: Math.round(revenueCurr * 100) / 100,
          revenueDeltaPct: pctChange(revenueCurr, revenuePrev),
          orders: ordersCurr,
          ordersDeltaPct: pctChange(ordersCurr, ordersPrev),
          profileViews: profileViewsProxy,
          profileViewsDeltaPct: pctChange(profileViewsProxy, ucPrev.size),
          newCustomers: newCustomersCurr,
          newCustomersDeltaPct: pctChange(newCustomersCurr, newCustomersPrev),
          avgRating,
          reviewCount,
          repeatClients: repeatCurr,
          repeatSharePct,
          repeatDeltaPct: pctChange(repeatCurr, repeatPrev),
        },
        revenueSeries,
        ordersSeries,
        topServices,
        performance: {
          completionRate,
          avgOrderValue,
          retentionRate,
          onTimeRate,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
});

module.exports = router;
