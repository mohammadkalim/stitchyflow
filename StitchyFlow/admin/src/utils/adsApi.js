import { api } from './api';

/** Try mounts: /admin/ads (always loaded with admin routes), /ca-sub/ads, /ads */
const ADS_PREFIXES = ['/admin/ads', '/ca-sub/ads', '/ads'];

export async function adsRequest(requestWithPrefix) {
  let last404;
  for (const prefix of ADS_PREFIXES) {
    try {
      return await requestWithPrefix(prefix);
    } catch (e) {
      if (e.response?.status === 404) {
        last404 = e;
        continue;
      }
      throw e;
    }
  }
  throw last404;
}

/** Shown when POST …/upload-image returns 404 on every mount (wrong port or old deploy). */
export const ADS_UPLOAD_ENDPOINT_MISSING =
  'Image upload API not found (404). Restart the backend from StitchyFlow/backend (npm start) and match REACT_APP_API_URL to that server’s port.';

/** Multipart upload — field name must be `image` (matches backend multer). */
export async function uploadAdImage(file) {
  const body = new FormData();
  body.append('image', file);
  try {
    return await adsRequest((p) => api.post(`${p}/upload-image`, body));
  } catch (e) {
    if (e.response?.status === 404) {
      const err = new Error(ADS_UPLOAD_ENDPOINT_MISSING);
      err.cause = e;
      throw err;
    }
    throw e;
  }
}
