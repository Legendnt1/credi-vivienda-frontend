import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

/**
 * Interceptor that adds authentication headers to outgoing HTTP requests.
 */
interface SessionShape {
  token?: { accessToken?: string };
}

/**
 * Interceptor that appends authentication headers to HTTP requests
 * targeting the CrediVivienda Provider API.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * API key for authenticating with the CrediVivienda Provider API.
   * @private
   */
  private readonly API_KEY = environment.crediViviendaProviderApiKey;
  /**
   * Base URL of the CrediVivienda Provider API.
   * @private
   */
  private readonly API_BASE = environment.crediViviendaProviderApiBaseUrl;
  /**
   * Local storage key for retrieving authentication session data.
   * @private
   */
  private readonly AUTH_STORAGE_KEY = 'cv_iam_auth';

  /**
   * Intercepts HTTP requests to add authentication headers when necessary.
   * @param request - The outgoing HTTP request.
   * @param next - The next handler in the HTTP request chain.
   * @returns An observable of the HTTP event stream.
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isAssetsRequest(request.url) || !this.matchesApiBase(request.url)) {
      return next.handle(request);
    }

    const accessToken = this.readAccessToken();
    const setHeaders: Record<string, string> = {
      'apiKey': this.API_KEY,
    };

    if (!request.headers.has('Authorization')) {
      if (accessToken) {
        setHeaders['Authorization'] = `Bearer ${accessToken}`;
      } else {
      }
    }

    const authReq = request.clone({ setHeaders });
    return next.handle(authReq);
  }

  /**
   * Reads the access token from local storage.
   * @returns The access token if available, otherwise null.
   * @private
   */
  private readAccessToken(): string | null {
    try {
      const raw = localStorage.getItem(this.AUTH_STORAGE_KEY);
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
   * @private
   */
  private isAssetsRequest(url: string): boolean {
    return url.startsWith('/assets/') || url.includes('/assets/i18n/');
  }

  /**
   * Checks if the URL matches the API base URL.
   * @param url - The request URL.
   * @returns True if the URL matches the API base, otherwise false.
   * @private
   */
  private matchesApiBase(url: string): boolean {
    try {
      const req = new URL(url, window.location.origin);
      const api = new URL(this.API_BASE, window.location.origin);
      return req.origin === api.origin && req.pathname.startsWith(api.pathname);
    } catch {
      return true;
    }
  }
}
