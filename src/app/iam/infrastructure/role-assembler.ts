import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Role} from '@iam/domain/model/role.entity';
import {RoleResource, RoleResponse} from '@iam/infrastructure/role-response';

/**
 * Assembler for converting between Role entities and their corresponding resources and responses.
 */
export class RoleAssembler implements BaseAssembler<Role, RoleResource, RoleResponse> {
  /**
   * Converts a RoleResponse to an array of Role entities.
   * @param response - The RoleResponse containing role resources.
   * @returns An array of Role entities.
   */
  toEntitiesFromResponse(response: RoleResponse): Role[] {
    return response.roles.map(resource => this.toEntityFromResource(resource as RoleResource));
  }

  /**
   * Converts a RoleResource to a Role entity.
   * @param resource - The RoleResource to convert.
   */
  toEntityFromResource(resource: RoleResource): Role {
    return new Role({
      id: resource.id,
      role: resource.role,
    });
  }

  /**
   * Converts a Role entity to a RoleResource.
   * @param entity - The Role entity to convert.
   * @returns The corresponding RoleResource.
   */
  toResourceFromEntity(entity: Role): RoleResource {
    return {
      id: entity._id,
      role: entity._role,
    };
  }
}
