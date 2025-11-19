import {BaseResource, BaseResponse} from './base-response';
import {BaseEntity} from './base-entity';

/**
 * Define el contrato para los ensambladores que convierten entre entidades, recursos y respuestas de API.
 * @template TEntity - El tipo de entidad (por ejemplo, Curso), debe extender BaseEntity.
 * @template TResource - El tipo de recurso, debe extender BaseResource.
 * @template TResponse - El tipo de respuesta, debe extender BaseResponse.
 */
export interface BaseAssembler<TEntity extends BaseEntity, TResource extends BaseResource, TResponse extends BaseResponse> {
  /**
   * Convierte un recurso a una entidad.
   * @param resource - El recurso a convertir.
   * @returns La entidad convertida.
   */
  toEntityFromResource(resource: TResource): TEntity;

  /**
   * Convierte una entidad a un recurso.
   * @param entity - La entidad a convertir.
   * @returns El recurso convertido.
   */
  toResourceFromEntity(entity: TEntity): TResource;

  /**
   * Convierte una respuesta a una matriz de entidades.
   * @param response - La respuesta a convertir.
   * @returns Una matriz de entidades convertidas.
   */
  toEntitiesFromResponse(response: TResponse): TEntity[];
}
