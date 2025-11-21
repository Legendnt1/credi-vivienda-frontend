import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {User} from '@iam/domain/model/user.entity';
import {UserResource, UserResponse} from '@iam/infrastructure/user-response';

/**
 * Assembler class for converting between User entities and User resources/responses.
 */
export class UserAssembler implements BaseAssembler<User, UserResource, UserResponse> {
  /**
   * Converts a UserResponse to an array of User entities.
   * @param response - The UserResponse to convert.
   * @returns An array of User entities.
   */
  toEntitiesFromResponse(response: UserResponse): User[] {
    return response.users.map(resource => this.toEntityFromResource(resource as UserResource));
  }

  /**
   * Converts a UserResource to a User entity.
   * @param resource - The UserResource to convert.
   * @returns A User entity.
   */
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      username: resource.username,
      password: resource.password,
      enabled: resource.enabled,
      email: resource.email,
      address: resource.address,
      registration_date: resource.registration_date,
      name: resource.name,
      last_name: resource.last_name,
      dni: resource.dni,
      income: resource.income,
      savings: resource.savings,
      has_bond: resource.has_bond,
      role_id: resource.role_id,
    });
  }

  /**
   * Converts a User entity to a UserResource.
   * @param entity - The User entity to convert.
   * @returns A UserResource.
   */
  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      username: entity.username,
      password: entity.password,
      enabled: entity.enabled,
      email: entity.email,
      address: entity.address,
      registration_date: entity.registration_date,
      name: entity.name,
      last_name: entity.last_name,
      dni: entity.dni,
      income: entity.income,
      savings: entity.savings,
      has_bond: entity.has_bond,
      role_id: entity.role_id,
    } as UserResource;
  }
}
