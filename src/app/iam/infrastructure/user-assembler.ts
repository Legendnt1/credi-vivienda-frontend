import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {User} from '@iam/domain/model/user.entity';
import {UserResource, UserResponse} from '@iam/infrastructure/user-response';

/**
 * Ensambla y desensambla objetos User entre diferentes representaciones.
 */
export class UserAssembler implements BaseAssembler<User, UserResource, UserResponse> {
  /**
   * Convierte una respuesta de usuario en una lista de entidades User.
   *
   * @param response la respuesta que contiene los recursos de usuario
   */
  toEntitiesFromResponse(response: UserResponse): User[] {
    return response.users.map(resource => this.toEntityFromResource(resource as UserResource));
  }

  /**
   * Convierte un UserResource en una entidad User.
   *
   * @param resource el recurso de usuario a convertir
   */
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      username: resource.username,
      password: resource.password,
      enable: resource.enable,
      email: resource.email,
      direccion: resource.direccion,
      fecha_registro: resource.fecha_registro,
      nombre: resource.nombre,
      apellido: resource.apellido,
      dni: resource.dni,
      ingreso: resource.ingreso,
      ahorro: resource.ahorro,
      vivienda: resource.vivienda,
      rol_id: resource.rol_id,
    });
  }

  /**
   * Convierte una entidad User en un UserResource.
   *
   * @param entity la entidad de usuario a convertir
   */
  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity._id,
      username: entity._username,
      password: entity._password,
      enable:  entity._enable,
      email: entity._email,
      direccion: entity._direccion,
      fecha_registro: entity._fecha_registro,
      nombre: entity._nombre,
      apellido: entity._apellido,
      dni: entity._dni,
      ingreso: entity._ingreso,
      ahorro: entity._ahorro,
      vivienda: entity._vivienda,
      rol_id: entity._rol_id,
    } as UserResource;
  }
}
