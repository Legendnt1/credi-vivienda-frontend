import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

/**
 * Forma del objeto de sesión almacenado en local storage.
 */
interface SessionShape {
  token?: { accessToken?: string };
}

/**
 * Un interceptor HTTP que agrega encabezados de autenticación a las solicitudes salientes.
 * Adjunta una clave API y, si está disponible, un token Bearer desde el almacenamiento local.
 * Las solicitudes a URL de activos están excluidas de esta intercepción.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * La clave API utilizada para la autenticación.
   * @private
   */
  private readonly API_KEY = environment.crediViviendaProviderApiKey;
  /**
   * La URL base de la API a la que se aplica el interceptor.
   * @private
   */
  private readonly API_BASE = environment.crediViviendaProviderApiBaseUrl;
  /**
   * La clave utilizada para almacenar datos de autenticación en el almacenamiento local.
   * @private
   */
  private readonly AUTH_STORAGE_KEY = 'cv_iam_auth';

  /**
   * Intercepta las solicitudes HTTP para agregar encabezados de autenticación.
   * @param request - La solicitud HTTP saliente.
   * @param next - El siguiente manejador en la cadena de solicitudes HTTP.
   * @return Un observable del evento HTTP.
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
   * Lee el token de acceso del almacenamiento local.
   * @return El token de acceso o null si no está disponible.
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
   * Determina si la URL de la solicitud es para activos.
   * @param url - La URL de la solicitud.
   * @return True si la URL es para activos, de lo contrario false.
   * @private
   */
  private isAssetsRequest(url: string): boolean {
    return url.startsWith('/assets/') || url.includes('/assets/i18n/');
  }

  /**
   * Verifica si la URL de la solicitud coincide con la URL base de la API.
   * @param url - La URL de la solicitud.
   * @return True si la URL coincide con la base de la API, de lo contrario false.
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
