import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@env/environment';

/**
 * Interceptor that adds authentication headers to outgoing HTTP requests.
 */
interface SessionShape {
  token?: { accessToken?: string };
}

const API_KEY = environment.crediViviendaProviderApiKey;
const API_BASE = environment.crediViviendaProviderApiBaseUrl;
const AUTH_STORAGE_KEY = 'cv_iam_auth';

/**
 * Reads the access token from local storage.
 * @returns The access token if available, otherwise null.
 */
function readAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const snap = JSON.parse(raw) as SessionShape;
    return snap?.token?.accessToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Determines if the request is for assets.
 * @param url - The request URL.
 * @returns True if the request is for assets, otherwise false.
 */
function isAssetsRequest(url: string): boolean {
  return url.startsWith('/assets/') || url.includes('/assets/i18n/');
}

/**
 * Checks if the URL matches the API base URL.
 * @param url - The request URL.
 * @returns True if the URL matches the API base, otherwise false.
 */
function matchesApiBase(url: string): boolean {
  try {
    const req = new URL(url, window.location.origin);
    const api = new URL(API_BASE, window.location.origin);
    return req.origin === api.origin && req.pathname.startsWith(api.pathname);
  } catch {
    return true;
  }
}

/**
 * Interceptor function that appends authentication headers to HTTP requests
 * targeting the CrediVivienda Provider API.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (isAssetsRequest(req.url) || !matchesApiBase(req.url)) {
    return next(req);
  }

  const accessToken = readAccessToken();
  const setHeaders: Record<string, string> = {
    'apikey': API_KEY,
  };

  if (!req.headers.has('Authorization')) {
    if (accessToken) {
      setHeaders['Authorization'] = `Bearer ${accessToken}`;
    } else {
      // Si no hay token de acceso, usar la API key como fallback
      setHeaders['Authorization'] = `Bearer ${API_KEY}`;
    }
  }
  const authReq = req.clone({ setHeaders });
  return next(authReq);
};
