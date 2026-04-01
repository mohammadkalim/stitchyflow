/**
 * StitchyFlow — Ultra Premium Splash  v11
 * Developer: Muhammad Kalim | LogixInventor (PVT) Ltd.
 *
 * NEW CONCEPT: Rolex/LV-style luxury intro
 *  1. Black screen → gold horizontal line draws across
 *  2. Curtain splits open revealing the scene
 *  3. Logo drops in with spring + glow
 *  4. Brand name letters clip-slide up one by one
 *  5. Tagline expands in
 *  6. Minimal gold segmented loader
 *
 * FIXES: All keyframe syntax correct, all vars defined.
 */

import { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

/* ─── ENV ─────────────────────────────────── */
const _env = Number(process.env.REACT_APP_SPLASH_DURATION_MS);
const SPLASH_MS = Number.isFinite(_env) && _env >= 800 ? _env : 10000;

/* ─── PALETTE ─────────────────────────────── */
const G   = '#c9a96e';   /* gold main   */
const GL  = '#e8c98a';   /* gold light  */
const GD  = '#8a6830';   /* gold dark   */
const GX  = '#4a3010';   /* gold xdark  */
const NAV = '#04080f';   /* navy black  */
const N2  = '#070d1c';
const N3  = '#0a1428';
const W   = '#ffffff';
const CR  = '#f5f0e8';   /* cream       */

/* ─── KEYFRAMES ───────────────────────────── */

/* Basic fade */
const kFade = keyframes`
  from { opacity: 0 }
  to   { opacity: 1 }
`;

/* Curtain left */
const kCurtL = keyframes`
  from { transform: translateX(0)     }
  to   { transform: translateX(-101%) }
`;

/* Curtain right */
const kCurtR = keyframes`
  from { transform: translateX(0)    }
  to   { transform: translateX(101%) }
`;

/* Gold line draw across screen */
const kLineDraw = keyframes`
  from { transform: scaleX(0); opacity: 1 }
  to   { transform: scaleX(1); opacity: 1 }
`;

/* Logo spring in — FIXED: semicolons between all properties */
const kLogoIn = keyframes`
  0%   { opacity: 0; transform: scale(0.5);   filter: blur(20px) }
  55%  { opacity: 1; transform: scale(1.05);  filter: blur(0)    }
  78%  { opacity: 1; transform: scale(0.97);  filter: blur(0)    }
  100% { opacity: 1; transform: scale(1);     filter: blur(0)    }
`;

/* Letter clip-slide up */
const kLetUp = keyframes`
  from { transform: translateY(110%); opacity: 0 }
  to   { transform: translateY(0);    opacity: 1 }
`;

/* Tagline expand */
const kTagIn = keyframes`
  from { opacity: 0; letter-spacing: 0.9em;  filter: blur(6px) }
  to   { opacity: 1; letter-spacing: 0.36em; filter: blur(0)   }
`;

/* Rule grow */
const kRule = keyframes`
  from { transform: scaleX(0) }
  to   { transform: scaleX(1) }
`;

/* Gold shimmer sweep */
const kShimmer = keyframes`
  0%   { background-position: -500% center }
  100% { background-position:  500% center }
`;

/* Simple spin CW */
const kSpinCW = keyframes`
  from { transform: rotate(0deg)   }
  to   { transform: rotate(360deg) }
`;

/* Simple spin CCW */
const kSpinCCW = keyframes`
  from { transform: rotate(0deg)    }
  to   { transform: rotate(-360deg) }
`;

/* Orbit ring CW — includes centering translate */
const kOrbitCW = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg)   }
  to   { transform: translate(-50%, -50%) rotate(360deg) }
`;

/* Orbit ring CCW */
const kOrbitCCW = keyframes`
  from { transform: translate(-50%, -50%) rotate(0deg)    }
  to   { transform: translate(-50%, -50%) rotate(-360deg) }
`;

/* Pulse ring expand */
const kPulse = keyframes`
  0%   { transform: translate(-50%, -50%) scale(0.55); opacity: 0.55 }
  100% { transform: translate(-50%, -50%) scale(2.9);  opacity: 0    }
`;

/* Glow breathe */
const kGlow = keyframes`
  0%, 100% { opacity: 0.3 }
  50%      { opacity: 0.85 }
`;

/* Needle float */
const kFloat = keyframes`
  0%, 100% { transform: translateY(0px)   rotate(-1.5deg) }
  50%      { transform: translateY(-9px)  rotate(1.5deg)  }
`;

/* Logo card glow */
const kCardGlow = keyframes`
  0%, 100% { box-shadow: 0 0 28px ${G}22, 0 0 70px ${G}0a  }
  50%      { box-shadow: 0 0 55px ${G}55, 0 0 130px ${G}18 }
`;

/* Border morph */
const kMorph = keyframes`
  0%, 100% { border-radius: 38px }
  33%      { border-radius: 50%  }
  66%      { border-radius: 28px }
`;

/* Stitch trace */
const kTrace = keyframes`
  from { stroke-dashoffset: 700 }
  to   { stroke-dashoffset: 0   }
`;

/* Thread draw */
const kThread = keyframes`
  from { stroke-dashoffset: 1500 }
  to   { stroke-dashoffset: 0    }
`;

/* Dot pop */
const kDotPop = keyframes`
  from { opacity: 0; transform: scale(0) }
  to   { opacity: 1; transform: scale(1) }
`;

/* Scissors */
const kSnipT = keyframes`
  0%, 100% { transform: rotate(0deg)   }
  50%      { transform: rotate(-22deg) }
`;
const kSnipB = keyframes`
  0%, 100% { transform: rotate(0deg)  }
  50%      { transform: rotate(22deg) }
`;

/* Spool */
const kSpool = keyframes`
  from { transform: rotate(0deg)   }
  to   { transform: rotate(360deg) }
`;

/* Pin drop */
const kPin = keyframes`
  0%   { transform: translateY(-22px); opacity: 0 }
  18%  { transform: translateY(0);     opacity: 1 }
  82%  { transform: translateY(0);     opacity: 1 }
  100% { transform: translateY(-22px); opacity: 0 }
`;

/* Bracket draw */
const kBracket = keyframes`
  from { stroke-dashoffset: 200 }
  to   { stroke-dashoffset: 0   }
`;

/* Particle drift */
const kDrift = keyframes`
  0%   { transform: translate(0, 0) scale(1);                     opacity: 0   }
  8%   { opacity: 0.85 }
  92%  { opacity: 0.08 }
  100% { transform: translate(var(--dx), var(--dy)) scale(0.05);  opacity: 0   }
`;

/* Fabric wave */
const kWave = keyframes`
  from { transform: translateX(0)    }
  to   { transform: translateX(-50%) }
`;

/* Scan line */
const kScan = keyframes`
  0%   { top: -2px; opacity: 0.4 }
  100% { top: 100%; opacity: 0   }
`;

/* Segment fill */
const kSegFill = keyframes`
  from { transform: scaleX(0) }
  to   { transform: scaleX(1) }
`;

/* Bar shine */
const kBarShine = keyframes`
  0%   { background-position:  200% center }
  100% { background-position: -200% center }
`;

/* Ready pop */
const kReadyPop = keyframes`
  0%   { opacity: 0; transform: scale(0.6)  translateY(6px);  filter: blur(8px) }
  55%  { opacity: 1; transform: scale(1.1)  translateY(-1px); filter: blur(0)   }
  100% { opacity: 1; transform: scale(1)    translateY(0)     }
`;

/* Dot bounce */
const kBounce = keyframes`
  0%, 80%, 100% { transform: translateY(0);    opacity: 0.25 }
  40%           { transform: translateY(-6px); opacity: 1    }
`;

/* Diamond spin */
const kDiamond = keyframes`
  0%   { transform: rotate(45deg)  scale(1)   }
  50%  { transform: rotate(225deg) scale(1.4) }
  100% { transform: rotate(405deg) scale(1)   }
`;

/* ─── PARTICLES ───────────────────────────── */
const DOTS = [
  { t:'8%',  l:'7%',  dx:'-44px', dy:'-54px', s:2.5, d:0.1, dur:5.8, g:true  },
  { t:'13%', l:'81%', dx:' 36px', dy:'-40px', s:2,   d:0.7, dur:4.9, g:false },
  { t:'67%', l:'4%',  dx:'-30px', dy:' 42px', s:3.5, d:0.3, dur:6.2, g:false },
  { t:'71%', l:'89%', dx:' 26px', dy:' 34px', s:2,   d:1.0, dur:5.3, g:true  },
  { t:'37%', l:'2%',  dx:'-22px', dy:'-28px', s:2.5, d:0.5, dur:4.7, g:false },
  { t:'49%', l:'93%', dx:' 18px', dy:' 22px', s:2,   d:1.3, dur:5.8, g:true  },
  { t:'23%', l:'47%', dx:'  4px', dy:'-50px', s:2,   d:0.2, dur:4.2, g:false },
  { t:'81%', l:'41%', dx:' 14px', dy:' 44px', s:2.5, d:0.9, dur:6.4, g:false },
  { t:'55%', l:'15%', dx:'-34px', dy:' 16px', s:2,   d:0.6, dur:4.5, g:true  },
  { t:'17%', l:'63%', dx:' 22px', dy:'-32px', s:2.5, d:1.2, dur:5.1, g:false },
  { t:'42%', l:'72%', dx:' 26px', dy:'-16px', s:2,   d:0.4, dur:5.4, g:false },
  { t:'75%', l:'22%', dx:'-16px', dy:' 32px', s:2.5, d:0.8, dur:4.7, g:true  },
];

/* ═══════════════════════════════════════════
   BACKGROUND
═══════════════════════════════════════════ */
function Background() {
  return (
    <>
      {/* Deep base */}
      <Box aria-hidden sx={{
        position:'absolute', inset:0, zIndex:0,
        background:`
          radial-gradient(ellipse 90% 70% at 15% 15%, rgba(0,80,160,0.22) 0%, transparent 55%),
          radial-gradient(ellipse 80% 60% at 85% 85%, rgba(0,48,120,0.18) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,0.055) 0%, transparent 65%),
          linear-gradient(162deg, ${NAV} 0%, ${N2} 42%, ${N3} 72%, ${NAV} 100%)
        `,
      }}/>

      {/* Linen weave */}
      <Box aria-hidden sx={{
        position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
        opacity:0, animation:`${kFade} 3s ease-out 0.8s forwards`,
        backgroundImage:`
          linear-gradient(rgba(201,169,110,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,169,110,0.02) 1px, transparent 1px),
          linear-gradient(rgba(255,255,255,0.006) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.006) 1px, transparent 1px)
        `,
        backgroundSize:'72px 72px, 72px 72px, 18px 18px, 18px 18px',
      }}/>

      {/* Vignette */}
      <Box aria-hidden sx={{
        position:'absolute', inset:0, zIndex:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 120% 120% at 50% 50%, transparent 34%, rgba(0,0,0,0.82) 100%)',
      }}/>
    </>
  );
}

/* ═══════════════════════════════════════════
   CURTAIN REVEAL  — the hero animation
═══════════════════════════════════════════ */
function Curtain() {
  return (
    <>
      {/* Gold line that draws before curtain opens */}
      <Box aria-hidden sx={{
        position:'absolute', top:'50%', left:0, right:0,
        height:'1px', zIndex:12, pointerEvents:'none',
        background:`linear-gradient(90deg, transparent 0%, ${G}88 20%, ${GL} 50%, ${G}88 80%, transparent 100%)`,
        transformOrigin:'left center',
        transform:'scaleX(0)',
        animation:`${kLineDraw} 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s forwards`,
      }}/>

      {/* Left panel */}
      <Box aria-hidden sx={{
        position:'absolute', top:0, bottom:0, left:0,
        width:'50.5%', zIndex:11,
        background:`linear-gradient(180deg, ${NAV} 0%, ${N2} 50%, ${NAV} 100%)`,
        borderRight:`1px solid ${G}28`,
        animation:`${kCurtL} 1s cubic-bezier(0.76,0,0.24,1) 1.2s forwards`,
        display:'flex', alignItems:'center', justifyContent:'flex-end', pr:3,
      }}>
        {/* Subtle gold vertical accent */}
        <Box sx={{ width:'1px', height:'40%', background:`linear-gradient(180deg,transparent,${G}22,transparent)` }}/>
      </Box>

      {/* Right panel */}
      <Box aria-hidden sx={{
        position:'absolute', top:0, bottom:0, right:0,
        width:'50.5%', zIndex:11,
        background:`linear-gradient(180deg, ${NAV} 0%, ${N2} 50%, ${NAV} 100%)`,
        borderLeft:`1px solid ${G}28`,
        animation:`${kCurtR} 1s cubic-bezier(0.76,0,0.24,1) 1.2s forwards`,
        display:'flex', alignItems:'center', justifyContent:'flex-start', pl:3,
      }}>
        <Box sx={{ width:'1px', height:'40%', background:`linear-gradient(180deg,transparent,${G}22,transparent)` }}/>
      </Box>
    </>
  );
}

/* ═══════════════════════════════════════════
   AMBIENT GLOWS
═══════════════════════════════════════════ */
function Glows() {
  return (
    <>
      <Box aria-hidden sx={{
        position:'absolute', top:'-22%', left:'-22%',
        width:'72%', height:'72%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(0,100,180,0.2) 0%, transparent 70%)',
        pointerEvents:'none', zIndex:0,
        animation:`${kGlow} 7s ease-in-out infinite`,
      }}/>
      <Box aria-hidden sx={{
        position:'absolute', bottom:'-22%', right:'-22%',
        width:'68%', height:'68%', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(0,48,120,0.17) 0%, transparent 70%)',
        pointerEvents:'none', zIndex:0,
        animation:`${kGlow} 8.5s ease-in-out 1.5s infinite`,
      }}/>
      <Box aria-hidden sx={{
        position:'absolute', top:'50%', left:'50%',
        transform:'translate(-50%,-50%)',
        width:'600px', height:'600px', borderRadius:'50%',
        background:`radial-gradient(circle, rgba(201,169,110,0.055) 0%, transparent 70%)`,
        pointerEvents:'none', zIndex:0,
        animation:`${kGlow} 6s ease-in-out 0.8s infinite`,
      }}/>
    </>
  );
}

/* ═══════════════════════════════════════════
   ORBIT RINGS
═══════════════════════════════════════════ */
function OrbitRings() {
  return (
    <>
      {[
        { sz:{xs:380,sm:520}, b:`1px dashed rgba(201,169,110,0.07)`, dur:'65s', kf:kOrbitCW  },
        { sz:{xs:295,sm:400}, b:`1px solid rgba(255,255,255,0.022)`, dur:'38s', kf:kOrbitCCW },
        { sz:{xs:210,sm:280}, b:`1px dashed rgba(0,200,255,0.04)`,   dur:'24s', kf:kOrbitCW  },
      ].map((r,i) => (
        <Box key={i} aria-hidden sx={{
          position:'absolute', top:'50%', left:'50%',
          width:r.sz, height:r.sz, borderRadius:'50%',
          border:r.b, pointerEvents:'none', zIndex:0,
          animation:`${r.kf} ${r.dur} linear infinite`,
        }}/>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════
   PULSE RINGS
═══════════════════════════════════════════ */
function PulseRings() {
  return (
    <>
      {[0,1,2,3,4].map(i => (
        <Box key={i} aria-hidden sx={{
          position:'absolute', top:'50%', left:'50%',
          width:{xs:185,sm:215}, height:{xs:185,sm:215},
          borderRadius:'50%',
          border:`1px solid rgba(201,169,110,0.22)`,
          pointerEvents:'none', zIndex:0,
          animation:`${kPulse} 5.5s ease-out ${i*1.1}s infinite`,
        }}/>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════ */
function Particles() {
  return (
    <Box aria-hidden sx={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none' }}>
      {DOTS.map((p,i) => (
        <Box key={i} sx={{
          position:'absolute', top:p.t, left:p.l,
          width:p.s, height:p.s, borderRadius:'50%',
          background: p.g
            ? `radial-gradient(circle, ${GL} 0%, ${G}88 100%)`
            : `radial-gradient(circle, rgba(0,210,255,0.9) 0%, rgba(0,120,180,0.3) 100%)`,
          '--dx':p.dx, '--dy':p.dy,
          animation:`${kDrift} ${p.dur}s ease-in-out ${p.d}s infinite`,
          boxShadow: p.g ? `0 0 ${p.s*4}px ${G}55` : `0 0 ${p.s*4}px rgba(0,210,255,0.28)`,
        }}/>
      ))}
    </Box>
  );
}

/* ═══════════════════════════════════════════
   THREAD CANVAS
═══════════════════════════════════════════ */
function ThreadCanvas() {
  return (
    <Box aria-hidden sx={{
      position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
      opacity:0, animation:`${kFade} 0.6s ease-out 2.4s forwards`,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 1400 800"
        preserveAspectRatio="xMidYMid slice" fill="none">
        <path d="M-20,95 C200,18 460,175 700,85 C940,-5 1180,155 1420,65"
          stroke={`${G}1c`} strokeWidth="1.5"
          strokeDasharray="1500" strokeDashoffset="1500"
          style={{animation:`${kThread} 4.5s ease-out 2.6s forwards`}}/>
        <path d="M-20,705 C230,645 490,765 730,685 C970,605 1210,745 1420,665"
          stroke="rgba(255,255,255,0.035)" strokeWidth="1"
          strokeDasharray="1500" strokeDashoffset="1500"
          style={{animation:`${kThread} 5s ease-out 3s forwards`}}/>
        {[130,310,490,670,850,1030,1210].map((x,i) => (
          <circle key={i} cx={x} cy={95+Math.sin(i*0.9)*36} r="2.8"
            fill={`${G}66`}
            style={{animation:`${kDotPop} 0.4s ease-out ${4.3+i*0.1}s both`}}/>
        ))}
      </svg>
    </Box>
  );
}

/* ═══════════════════════════════════════════
   CORNER BRACKETS
═══════════════════════════════════════════ */
function CornerBrackets() {
  const corners = [
    { top:14,    left:14,  r:0   },
    { top:14,    right:14, r:90  },
    { bottom:14, left:14,  r:270 },
    { bottom:14, right:14, r:180 },
  ];
  return (
    <>
      {corners.map((c,i) => (
        <Box key={i} aria-hidden sx={{
          position:'absolute', ...c,
          width:40, height:40, zIndex:3, pointerEvents:'none',
          opacity:0, animation:`${kFade} 0.5s ease-out ${2.3+i*0.07}s forwards`,
        }}>
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none"
            style={{transform:`rotate(${c.r}deg)`}}>
            <path d="M2,34 L2,2 L34,2"
              stroke={`${G}44`} strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="200"
              style={{animation:`${kBracket} 1.4s ease-out ${2.4+i*0.07}s both`}}/>
            <circle cx="2" cy="2" r="2.5" fill={`${G}55`}
              style={{animation:`${kDotPop} 0.3s ease-out ${3.2+i*0.07}s both`}}/>
          </svg>
        </Box>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════
   TAILORING PROPS
═══════════════════════════════════════════ */
function Scissors() {
  return (
    <Box aria-hidden sx={{
      position:'absolute', top:'5.5%', right:'5.5%',
      width:72, height:72, zIndex:4, pointerEvents:'none',
      opacity:0, animation:`${kFade} 0.7s ease-out 2.5s forwards`,
    }}>
      <svg width="72" height="72" viewBox="0 0 66 66" fill="none"
        style={{animation:`${kFloat} 5s ease-in-out infinite`}}>
        <circle cx="33" cy="33" r="5" fill={W} fillOpacity="0.92"/>
        <g style={{transformOrigin:'33px 33px', animation:`${kSnipT} 2.2s ease-in-out infinite`}}>
          <path d="M33,33 L58,16" stroke={W} strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="59" cy="15" r="7" fill="none" stroke={G} strokeWidth="2"/>
          <circle cx="59" cy="15" r="3" fill={G} fillOpacity="0.45"/>
        </g>
        <g style={{transformOrigin:'33px 33px', animation:`${kSnipB} 2.2s ease-in-out infinite`}}>
          <path d="M33,33 L58,50" stroke={W} strokeOpacity="0.85" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="59" cy="51" r="7" fill="none" stroke={G} strokeWidth="2"/>
          <circle cx="59" cy="51" r="3" fill={G} fillOpacity="0.45"/>
        </g>
        <path d="M33,33 L8,33" stroke={W} strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </Box>
  );
}

function Spool() {
  return (
    <Box aria-hidden sx={{
      position:'absolute', top:'5.5%', left:'5.5%',
      width:62, height:62, zIndex:4, pointerEvents:'none',
      opacity:0, animation:`${kFade} 0.7s ease-out 2.7s forwards`,
    }}>
      <svg width="62" height="62" viewBox="0 0 54 54" fill="none"
        style={{animation:`${kSpool} 7s linear infinite`}}>
        <ellipse cx="27" cy="27" rx="24" ry="11"
          stroke={G} strokeOpacity="0.45" strokeWidth="2" fill="none"/>
        <ellipse cx="27" cy="27" rx="24" ry="11"
          stroke={G} strokeOpacity="0.18" strokeWidth="1"
          fill="none" strokeDasharray="7 4"/>
        <ellipse cx="27" cy="27" rx="8" ry="8"
          fill={G} fillOpacity="0.05"
          stroke={G} strokeOpacity="0.38" strokeWidth="1.5"/>
        {[0,60,120,180,240,300].map(a => (
          <line key={a} x1="27" y1="27"
            x2={27+22*Math.cos(a*Math.PI/180)}
            y2={27+10*Math.sin(a*Math.PI/180)}
            stroke={G} strokeOpacity="0.12" strokeWidth="1"/>
        ))}
      </svg>
    </Box>
  );
}

function Pins() {
  return (
    <>
      {[
        { top:'29%', right:'4.5%', delay:2.6 },
        { top:'44%', right:'8.5%', delay:3.0 },
        { top:'59%', right:'4%',   delay:3.4 },
      ].map((p,i) => (
        <Box key={i} aria-hidden sx={{
          position:'absolute', top:p.top, right:p.right,
          width:9, height:32, zIndex:4, pointerEvents:'none',
          animation:`${kPin} 4.5s ease-in-out ${p.delay}s infinite`,
        }}>
          <svg width="9" height="32" viewBox="0 0 9 32" fill="none">
            <circle cx="4.5" cy="4.5" r="4.5" fill={G}/>
            <line x1="4.5" y1="9" x2="4.5" y2="32"
              stroke={W} strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </Box>
      ))}
    </>
  );
}

function MeasureTape() {
  return (
    <Box aria-hidden sx={{
      position:'absolute', bottom:'30%', left:'3%',
      width:128, height:28, zIndex:4, pointerEvents:'none',
      opacity:0, animation:`${kFade} 0.7s ease-out 2.6s forwards`,
    }}>
      <svg width="128" height="28" viewBox="0 0 128 28" fill="none">
        <rect x="0" y="10" width="126" height="8" rx="4"
          fill={G} fillOpacity="0.06"
          stroke={G} strokeOpacity="0.28" strokeWidth="1"/>
        {[12,24,36,48,60,72,84,96,108,120].map((x,i) => (
          <line key={i} x1={x} y1="10" x2={x} y2={i%2===0?4:6}
            stroke={G} strokeOpacity="0.4" strokeWidth="1"/>
        ))}
        <text x="63" y="17" textAnchor="middle"
          fill={G} fillOpacity="0.5" fontSize="5" fontFamily="monospace">cm</text>
      </svg>
    </Box>
  );
}

function StitchWave() {
  return (
    <Box aria-hidden sx={{
      position:'absolute', bottom:'19%', left:'50%',
      transform:'translateX(-50%)',
      width:340, height:54, zIndex:4, pointerEvents:'none',
      opacity:0, animation:`${kFade} 0.5s ease-out 3s forwards`,
    }}>
      <svg width="340" height="54" viewBox="0 0 340 54" fill="none">
        <path d="M10,27 Q62,8 114,27 Q166,46 218,27 Q270,8 328,27"
          stroke={W} strokeOpacity="0.28" strokeWidth="1.8" fill="none"
          strokeDasharray="800" strokeDashoffset="800"
          style={{animation:`${kThread} 3.8s ease-in-out 3.2s infinite`}}/>
        {[56,112,168,224,280].map((x,i) => (
          <circle key={i} cx={x} cy="27" r="3.2"
            fill={G} fillOpacity="0.85"
            style={{animation:`${kDotPop} 0.3s ease-out ${3.3+i*0.12}s both`}}/>
        ))}
      </svg>
    </Box>
  );
}

function FabricWave() {
  return (
    <Box aria-hidden sx={{
      position:'absolute', bottom:0, left:0, right:0,
      height:100, overflow:'hidden', zIndex:1, pointerEvents:'none',
      opacity:0, animation:`${kFade} 1.5s ease-out 0.3s forwards`,
    }}>
      <svg width="200%" height="100" viewBox="0 0 800 100" preserveAspectRatio="none"
        style={{animation:`${kWave} 10s linear infinite`}}>
        <path d="M0,50 Q50,20 100,50 Q150,80 200,50 Q250,20 300,50 Q350,80 400,50 Q450,20 500,50 Q550,80 600,50 Q650,20 700,50 Q750,80 800,50 L800,100 L0,100 Z"
          fill={G} fillOpacity="0.022"/>
        <path d="M0,65 Q50,42 100,65 Q150,88 200,65 Q250,42 300,65 Q350,88 400,65 Q450,42 500,65 Q550,88 600,65 Q650,42 700,65 Q750,88 800,65 L800,100 L0,100 Z"
          fill={W} fillOpacity="0.012"/>
        <path d="M0,50 Q50,20 100,50 Q150,80 200,50 Q250,20 300,50 Q350,80 400,50 Q450,20 500,50 Q550,80 600,50 Q650,20 700,50 Q750,80 800,50"
          stroke={G} strokeOpacity="0.065" strokeWidth="1" strokeDasharray="12 8" fill="none"/>
      </svg>
    </Box>
  );
}

function ScanLine() {
  return (
    <Box aria-hidden sx={{
      position:'absolute', left:0, right:0, height:'2px',
      zIndex:6, pointerEvents:'none',
      background:`linear-gradient(90deg, transparent, ${G}22, transparent)`,
      animation:`${kScan} 5.5s linear 2.5s infinite`,
    }}/>
  );
}

/* ═══════════════════════════════════════════
   LOGO MARK
═══════════════════════════════════════════ */
function LogoMark() {
  const S   = 172;
  const pad = 8;
  const inn = S - pad * 2;
  const per = inn * 4;

  return (
    <Box sx={{
      position:'relative', width:S, height:S,
      mx:'auto', mb:'44px',
      opacity:0,
      animation:`${kLogoIn} 1.3s cubic-bezier(0.22,1,0.36,1) 2.2s forwards`,
    }}>
      {/* Outer dashed orbit */}
      <Box aria-hidden sx={{
        position:'absolute', inset:-22, borderRadius:'50%',
        border:`1px dashed ${G}1c`,
        animation:`${kSpinCCW} 28s linear infinite`,
        zIndex:0,
      }}/>

      {/* Spinning gold conic border */}
      <Box aria-hidden sx={{
        position:'absolute', inset:-5, borderRadius:'42px',
        background:`conic-gradient(from 0deg,
          ${G} 0%, ${GD} 22%, ${NAV} 48%, ${GD} 72%, ${G} 100%)`,
        animation:`${kSpinCW} 11s linear infinite`,
        zIndex:0,
      }}/>

      {/* Cyan counter accent */}
      <Box aria-hidden sx={{
        position:'absolute', inset:-10, borderRadius:'48px',
        background:`conic-gradient(from 120deg,
          rgba(0,200,255,0.13) 0%, transparent 38%,
          rgba(0,200,255,0.13) 72%, transparent 100%)`,
        animation:`${kSpinCCW} 28s linear infinite`,
        zIndex:0,
      }}/>

      {/* Glass card */}
      <Box sx={{
        position:'absolute', inset:5, borderRadius:'37px',
        background:`linear-gradient(148deg,
          rgba(255,255,255,0.13) 0%,
          rgba(201,169,110,0.07) 35%,
          rgba(0,12,36,0.58) 100%)`,
        backdropFilter:'blur(28px)',
        WebkitBackdropFilter:'blur(28px)',
        border:`1px solid ${G}2c`,
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:1,
        animation:`${kCardGlow} 4.5s ease-in-out 3.5s infinite, ${kMorph} 9s ease-in-out 3s infinite`,
      }}>
        {/* Needle SVG */}
        <svg width="76" height="76" viewBox="0 0 64 64" fill="none"
          style={{animation:`${kFloat} 5s ease-in-out infinite`}}>
          <defs>
            <linearGradient id="nb11" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.98"/>
              <stop offset="55%"  stopColor="#e8f2f8" stopOpacity="0.93"/>
              <stop offset="100%" stopColor="#c4d8e4" stopOpacity="0.86"/>
            </linearGradient>
            <linearGradient id="ng11" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor={G}/>
              <stop offset="100%" stopColor={GL}/>
            </linearGradient>
            <filter id="nf11" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.6" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect x="29" y="3" width="6" height="40" rx="3" fill="url(#nb11)" filter="url(#nf11)"/>
          <rect x="30.5" y="6" width="1.8" height="22" rx="0.9" fill={W} fillOpacity="0.38"/>
          <ellipse cx="32" cy="11" rx="3.5" ry="5" fill="none" stroke="url(#ng11)" strokeWidth="2.2"/>
          <path d="M29,43 L32,59 L35,43 Z" fill="url(#nb11)"/>
          <path d="M32,59 Q17,66 32,72 Q47,66 32,59"
            stroke="url(#ng11)" strokeWidth="2.4" fill="none" strokeLinecap="round"/>
          <path d="M32,11 Q43,3 49,9"
            stroke={G} strokeOpacity="0.6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <circle cx="32" cy="59" r="2.2" fill={G} fillOpacity="0.45"/>
        </svg>
      </Box>

      {/* Stitch trace */}
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} fill="none"
        style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none'}}>
        <rect x={pad} y={pad} width={inn} height={inn} rx="40"
          stroke={G} strokeOpacity="0.55" strokeWidth="1.5"
          strokeDasharray={per} strokeDashoffset={per}
          style={{animation:`${kTrace} 2s ease-out 3.3s forwards`}}/>
        {[[pad,pad],[S-pad,pad],[S-pad,S-pad],[pad,S-pad]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="3"
            fill={G} fillOpacity="0.7"
            style={{animation:`${kDotPop} 0.3s ease-out ${5.1+i*0.1}s both`}}/>
        ))}
      </svg>
    </Box>
  );
}

/* ═══════════════════════════════════════════
   BRAND NAME — clipped letter slide-up
═══════════════════════════════════════════ */
const BRAND = 'StitchyFlow';

function BrandName() {
  return (
    <Box sx={{
      display:'flex', justifyContent:'center', alignItems:'flex-end',
      gap:'0.01em',
    }}>
      {BRAND.split('').map((ch, i) => {
        const isAccent = ch === ch.toUpperCase() && ch !== ch.toLowerCase();
        return (
          <Box key={i} sx={{ overflow:'hidden', lineHeight:1.15 }}>
            <Box component="span" sx={{
              display:'inline-block',
              fontWeight:800,
              fontSize:{xs:'2.6rem', sm:'3.4rem'},
              lineHeight:1,
              fontFamily:'"Segoe UI", system-ui, -apple-system, sans-serif',
              background: isAccent
                ? `linear-gradient(175deg, ${GL} 0%, ${G} 50%, ${GD} 100%)`
                : `linear-gradient(175deg, #f4f9ff 0%, #b8d8ee 40%, ${W} 65%, #cce8ff 100%)`,
              backgroundSize:'100% 200%',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              animation:`${kLetUp} 0.55s cubic-bezier(0.22,1,0.36,1) ${3.5+i*0.055}s both`,
              filter: isAccent
                ? `drop-shadow(0 0 12px ${G}77)`
                : `drop-shadow(0 0 6px rgba(0,200,255,0.2))`,
            }}>
              {ch}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ═══════════════════════════════════════════
   EST BADGE
═══════════════════════════════════════════ */
function EstBadge() {
  return (
    <Box sx={{ mt:1.5, opacity:0, animation:`${kFade} 0.8s ease-out 4.4s forwards` }}>
      <Box component="span" sx={{
        display:'inline-block',
        fontSize:{xs:'0.56rem', sm:'0.62rem'},
        fontWeight:600,
        letterSpacing:'0.55em',
        textTransform:'uppercase',
        background:`linear-gradient(90deg,
          ${G}88 0%, ${GL} 30%, ${W} 50%, ${GL} 70%, ${G}88 100%)`,
        backgroundSize:'300% auto',
        WebkitBackgroundClip:'text',
        WebkitTextFillColor:'transparent',
        animation:`${kShimmer} 4s linear 4.7s infinite`,
      }}>
        Est. 2024
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════
   DIVIDER
═══════════════════════════════════════════ */
function Divider() {
  return (
    <Box sx={{
      display:'flex', alignItems:'center', justifyContent:'center',
      gap:'14px', my:'20px',
      opacity:0, animation:`${kFade} 0.9s ease-out 4.5s forwards`,
    }}>
      <Box sx={{ width:56, height:'1px', background:`linear-gradient(90deg,transparent,${G}88)` }}/>
      <Box sx={{ width:4, height:4, background:G, opacity:0.55, transform:'rotate(45deg)' }}/>
      <Box sx={{
        width:9, height:9,
        background:`linear-gradient(135deg, ${GL}, ${G})`,
        transform:'rotate(45deg)',
        boxShadow:`0 0 14px ${G}cc, 0 0 28px ${G}44`,
        animation:`${kDiamond} 7s ease-in-out infinite`,
      }}/>
      <Box sx={{ width:4, height:4, background:G, opacity:0.55, transform:'rotate(45deg)' }}/>
      <Box sx={{ width:56, height:'1px', background:`linear-gradient(90deg,${G}88,transparent)` }}/>
    </Box>
  );
}

/* ═══════════════════════════════════════════
   TAGLINE
═══════════════════════════════════════════ */
function Tagline() {
  return (
    <Box component="p" sx={{
      m:0, mb:'44px',
      color:`${CR}66`,
      fontWeight:300,
      fontSize:{xs:'0.62rem', sm:'0.7rem'},
      letterSpacing:'0.32em',
      textTransform:'uppercase',
      fontStyle:'italic',
      opacity:0,
      animation:`${kTagIn} 1.8s ease-out 4.7s forwards`,
    }}>
      Premium Tailoring Services
    </Box>
  );
}

/* ═══════════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════════ */
function ProgressBar({ progress, phase }) {
  const SEGS  = 28;
  const filled = Math.floor((progress / 100) * SEGS);

  return (
    <Box sx={{ width:'100%', maxWidth:320, mx:'auto' }}>

      {/* Segments */}
      <Box sx={{ display:'flex', gap:'2px', mb:'4px' }}>
        {Array.from({length:SEGS}).map((_,i) => {
          const ratio = i / SEGS;
          return (
            <Box key={i} sx={{
              flex:1, height:'3px', borderRadius:'2px',
              position:'relative', overflow:'hidden',
              bgcolor: i < filled ? 'transparent' : `${G}14`,
            }}>
              {i < filled && (
                <Box sx={{
                  position:'absolute', inset:0,
                  background: ratio < 0.5
                    ? `linear-gradient(90deg, ${GD}, ${G})`
                    : `linear-gradient(90deg, ${G}, ${GL})`,
                  backgroundSize:'200% auto',
                  animation:`${kSegFill} 0.12s ease-out ${i*0.018}s both,
                             ${kBarShine} 2.5s linear infinite`,
                  boxShadow: i === filled-1
                    ? `0 0 10px ${G}dd, 0 0 22px ${G}55`
                    : 'none',
                }}/>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Cyan underline */}
      <Box sx={{
        height:'1px', mb:'10px',
        background:'linear-gradient(90deg,transparent,rgba(0,200,255,0.16),transparent)',
      }}/>

      {/* Status row */}
      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>

        <Box component="span" sx={{
          fontSize:'0.58rem', letterSpacing:'0.18em',
          textTransform:'uppercase', fontWeight:700,
          color: phase===1 ? G : 'rgba(255,255,255,0.28)',
          transition:'color 0.6s',
          textShadow: phase===1 ? `0 0 14px ${G}` : 'none',
          animation: phase===1 ? `${kReadyPop} 0.7s ease-out` : 'none',
          fontFamily:'inherit',
        }}>
          {phase===1 ? '✦  Ready' : `${Math.max(0,Math.ceil(SPLASH_MS*(1-progress/100)/1000))}s`}
        </Box>

        <Box component="span" sx={{
          color:G, fontSize:'0.62rem', letterSpacing:'0.1em',
          fontWeight:700, fontFamily:'monospace',
          textShadow:`0 0 8px ${G}88`,
        }}>
          {Math.round(progress).toString().padStart(3,'0')}%
        </Box>

        <Box sx={{ display:'flex', gap:'5px', alignItems:'center' }}>
          {[0,1,2].map(i => (
            <Box key={i} sx={{
              width:4, height:4, borderRadius:'50%',
              background: phase===1 ? G : `${G}66`,
              boxShadow: phase===1 ? `0 0 8px ${G}` : 'none',
              transition:'all 0.5s',
              animation:`${kBounce} 1.5s ease-in-out ${i*0.24}s infinite`,
            }}/>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════
   MAIN
═══════════════════════════════════════════ */
function SplashScreen({ durationMs = SPLASH_MS }) {
  const [progress, setProgress] = useState(0);
  const [phase,    setPhase   ] = useState(0);
  const frameRef                = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const tick  = (now) => {
      const pct = Math.min(100, ((now - start) / durationMs) * 100);
      setProgress(pct);
      if (pct >= 100) { setPhase(1); setProgress(100); }
      else frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [durationMs]);

  return (
    <Box sx={{
      position:'relative', minHeight:'100vh', width:'100%',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      overflow:'hidden',
      opacity:0, animation:`${kFade} 0.5s ease-out forwards`,
    }}>

      {/* ── Background ── */}
      <Background />
      <ScanLine />
      <Glows />
      <OrbitRings />
      <PulseRings />
      <Particles />
      <ThreadCanvas />
      <CornerBrackets />

      {/* ── Tailoring props ── */}
      <Scissors />
      <Spool />
      <Pins />
      <MeasureTape />
      <StitchWave />
      <FabricWave />

      {/* ── Curtain (on top, slides away at 1.2s) ── */}
      <Curtain />

      {/* ── Accent rules ── */}
      <Box aria-hidden sx={{
        position:'absolute', top:16, left:'4%', right:'4%',
        height:'1px', zIndex:2, pointerEvents:'none',
        background:`linear-gradient(90deg, transparent, ${G}2c, transparent)`,
        transformOrigin:'left',
        animation:`${kRule} 2.2s cubic-bezier(0.22,1,0.36,1) 2.2s both`,
      }}/>
      <Box aria-hidden sx={{
        position:'absolute', bottom:46, left:'4%', right:'4%',
        height:'1px', zIndex:2, pointerEvents:'none',
        background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.055),transparent)',
        transformOrigin:'left',
        animation:`${kRule} 2.2s cubic-bezier(0.22,1,0.36,1) 2.4s both`,
      }}/>

      {/* ── Content ── */}
      <Box sx={{
        position:'relative', zIndex:2,
        textAlign:'center', px:3, maxWidth:540,
      }}>
        <LogoMark />
        <BrandName />
        <EstBadge />
        <Divider />
        <Tagline />
        <Box sx={{ opacity:0, animation:`${kFade} 0.8s ease-out 5s forwards` }}>
          <ProgressBar progress={progress} phase={phase} />
        </Box>
      </Box>

      {/* ── Footer ── */}
      <Box sx={{
        position:'absolute', bottom:13, left:0, right:0,
        textAlign:'center', zIndex:2,
        opacity:0, animation:`${kFade} 1s ease-out 5.2s forwards`,
      }}>
        <Box component="span" sx={{
          color:'rgba(255,255,255,0.13)',
          fontSize:'0.56rem', letterSpacing:'0.18em',
          textTransform:'uppercase',
        }}>
          Powered by LogixInventor (PVT) Ltd.
        </Box>
      </Box>
    </Box>
  );
}

export default SplashScreen;
export { SPLASH_MS };
