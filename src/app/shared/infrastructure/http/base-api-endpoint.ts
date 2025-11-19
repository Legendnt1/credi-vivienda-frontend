import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseEntity } from './base-entity';
import { BaseResource, BaseResponse } from './base-response';
import { BaseAssembler } from './base-assembler';
import {BaseApiConfig} from './base-api-config';

/**
 * Clase base para puntos finales de API que proporciona operaciones CRUD genéricas.
 * @template TEntity - El tipo de entidad (por ejemplo, Curso), debe extender BaseEntity.
 * @template TResource - El tipo de recurso, debe extender BaseResource.
 * @template TResponse - El tipo de respuesta, debe extender BaseResponse.
 * @template TAssembler - El tipo de ensamblador, debe implementar BaseAssembler.
 */
@Injectable()
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>
> {

  protected constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler,
    protected config: BaseApiConfig
  ) {}

  /**
   * Obtener todas las entidades.
   * Soporta configuración para parámetros de ruta o parámetros de consulta.
   * @returns Un Observable de una matriz de entidades.
   */
  getAll(): Observable<TEntity[]> {
    let params = new HttpParams();
    if (!this.config.usePathParams) {
      params = params.set('select', '*');
    }
    const options = {
      params: params,
    }
    return this.http.get<TResponse | TResource[]>(this.endpointUrl, options).pipe(
      map(response => {
        console.log(response);
        if (Array.isArray(response)) {
          return response.map(resource => this.assembler.toEntityFromResource(resource));
        }
        return this.assembler.toEntitiesFromResponse(response as TResponse);
      }),
      catchError(this.handleError('Failed to fetch entities'))
    );
  }

  /**
   * Obtiene una entidad por ID.
   * Soporta configuración para parámetros de ruta o parámetros de consulta.
   * @param id
   */
  getById(id: number | string): Observable<TEntity> {
    let url: string;
    let paramsConfig: { params?: HttpParams } = {};
    const idString = id.toString();

    if (this.config.usePathParams) {
      url = `${this.endpointUrl}/${idString}`;
    } else {
      url = this.endpointUrl;
      let params = new HttpParams();
      params = params.set('id', `eq.${idString}`);
      paramsConfig = { params };
    }

    return this.http.get<TResource>(url, paramsConfig).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch entity'))
    );
  }

  /**
   * Crea una nueva entidad.
   * Soporta configuración para parámetros de ruta o parámetros de consulta.
   * @param entity - La entidad a crear.
   * @returns Un Observable de la entidad creada.
   */
  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);

    if (!this.config.usePathParams) {
      return this.http.post<TResource>(this.endpointUrl, resource).pipe(
        map(created => this.assembler.toEntityFromResource(created)),
        catchError(this.handleError('Failed to create entity'))
      );
    }

    const headers = new HttpHeaders().set('Prefer', 'return=representation');
    return this.http.post<TResource | TResource[]>(this.endpointUrl, resource, { headers }).pipe(
      map((body) => {
        const res = Array.isArray(body) ? body[0] : body;
        return this.assembler.toEntityFromResource(res);
      }),
      catchError(this.handleError('Failed to create entity'))
    );
  }

  /**
   * Actualiza una entidad existente.
   * Soporta configuración para parámetros de ruta o parámetros de consulta.
   * @param entity - La entidad a actualizar.
   * @param id - El ID de la entidad a actualizar.
   * @returns Un Observable de la entidad actualizada.
   */
  update(entity: TEntity, id: number | string): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    const idString = id.toString();

    if (!this.config.usePathParams) {
      return this.http.put<TResource>(`${this.endpointUrl}/${idString}`, resource).pipe(
        map(updated => this.assembler.toEntityFromResource(updated)),
        catchError(this.handleError('Failed to update entity'))
      );
    }

    const params = new HttpParams()
      .set('id', `eq.${idString}`)
      .set('select', '*');
    const headers = new HttpHeaders()
      .set('Prefer', 'return=representation');

    return this.http.patch<TResource | TResource[]>(this.endpointUrl, resource, { params, headers }).pipe(
      map((body) => {
        const res = Array.isArray(body) ? body[0] : body;
        return this.assembler.toEntityFromResource(res);
      }),
      catchError(this.handleError('Failed to update entity'))
    );
  }

  /**
   * Elimina una entidad por ID.
   * Soporta configuración para parámetros de ruta o parámetros de consulta.
   * @param id - El ID de la entidad a eliminar.
   * @returns Un Observable que completa cuando se elimina la entidad.
   */
  delete(id: number | string): Observable<void> {
    const idString = id.toString();

    if (!this.config.usePathParams) {
      return this.http.delete<void>(`${this.endpointUrl}/${idString}`).pipe(
        catchError(this.handleError('Failed to delete entity'))
      );
    }

    const params = new HttpParams().set('id', `eq.${idString}`);
    return this.http.delete<void>(this.endpointUrl, { params }).pipe(
      catchError(this.handleError('Failed to delete entity'))
    );
  }

  /**
   * Maneja errores HTTP y devuelve un Observable que lanza un error con un mensaje descriptivo.
   * @param operation - El nombre de la operación que falló.
   * @protected
   */
  protected handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      let errorMessage = operation;
      if (error.status === 404) {
        errorMessage = `${operation}: Resource not found`;
      } else if (error.error instanceof ErrorEvent) {
        errorMessage = `${operation}: ${error.error.message}`;
      } else {
        errorMessage = `${operation}: ${error.statusText || 'Unexpected error'}`;
      }
      return throwError(() => new Error(errorMessage));
    };
  }
}
