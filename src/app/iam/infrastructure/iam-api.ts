import {Injectable} from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {UsersApiEndpoint} from '@iam/infrastructure/users-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '@iam/domain/model/user.entity';
import {RolesApiEndpoint} from '@iam/infrastructure/roles-api-endpoint';
import {Role} from '@iam/domain/model/role.entity';
import {SettingsApiEndpoint} from '@iam/infrastructure/settings-api-endpoint';
import {Setting} from '@iam/domain/model/setting.entity';

/**
 * IAM API service to interact with user and role endpoints.
 * Provides methods to perform CRUD operations on users and roles.
 */
@Injectable({
  providedIn: 'root'
})
export class IamApi extends BaseApi {
  /**
   * Users API endpoint.
   * @private
   */
  private readonly usersEndpoint: UsersApiEndpoint;

  /**
   * Roles API endpoint.
   * @private
   */
  private readonly rolesEndpoint: RolesApiEndpoint;

  /**
   * Settings API endpoint.
   * @private
   */
  private readonly settingsEndpoint: SettingsApiEndpoint;

  /**
   * Constructor to initialize the IAM API service with HTTP client.
   * @param http - The HTTP client to make API requests.
   */
  constructor(http: HttpClient) {
    super();
    this.usersEndpoint = new UsersApiEndpoint(http);
    this.rolesEndpoint = new RolesApiEndpoint(http);
    this.settingsEndpoint = new SettingsApiEndpoint(http);
  }

  /**
   * Get all users.
   * @returns An observable of an array of users.
   */
  getUsers(): Observable<User[]> {
    return this.usersEndpoint.getAll();
  }

  /**
   * Get a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns An observable of the user.
   */
  getUser(id: number): Observable<User> {
    return this.usersEndpoint.getById(id);
  }

  /**
   * Create a new user.
   * @param user - The user data to create.
   * @returns An observable of the created user.
   */
  createUser(user: User): Observable<User> {
    return this.usersEndpoint.create(user);
  }

  /**
   * Update an existing user.
   * @param user - The user data to update.
   * @returns An observable of the updated user.
   */
  updateUser(user: User): Observable<User> {
    return this.usersEndpoint.update(user, user.id);
  }

  /**
   * Delete a user by ID.
   * @param id - The ID of the user to delete.
   * @returns An observable of void.
   */
  deleteUser(id: number): Observable<void> {
    return this.usersEndpoint.delete(id);
  }

  /**
   * Get all roles.
   * @returns An observable of an array of roles.
   */
  getRoles(): Observable<Role[]> {
    return this.rolesEndpoint.getAll();
  }

  /**
   * Get a role by ID.
   * @param id - The ID of the role to retrieve.
   * @returns An observable of the role.
   */
  getRol(id: number): Observable<Role> {
    return this.rolesEndpoint.getById(id);
  }

  /**
   * Create a new role.
   * @param role - The role data to create.
   * @returns An observable of the created role.
   */
  createRole(role: Role): Observable<Role> {
    return this.rolesEndpoint.create(role);
  }

  /**
   * Update an existing role.
   * @param role - The role data to update.
   * @returns An observable of the updated role.
   */
  updateRole(role: Role): Observable<Role> {
    return this.rolesEndpoint.update(role, role.id);
  }

  /**
   * Delete a role by ID.
   * @param id - The ID of the role to delete.
   * @returns An observable of void.
   */
  deleteRol(id: number): Observable<void> {
    return this.rolesEndpoint.delete(id);
  }

  /**
   * Get all settings.
   * @returns An observable of an array of settings.
   */
  getSettings(): Observable<Setting[]> {
    return this.settingsEndpoint.getAll();
  }

  /**
   * Get a setting by ID.
   * @param id - The ID of the setting to retrieve.
   * @returns An observable of the setting.
   */
  getSetting(id: number): Observable<Setting> {
    return this.settingsEndpoint.getById(id);
  }

  /**
   * Create a new setting.
   * @param setting - The setting data to create.
   * @returns An observable of the created setting.
   */
  createSetting(setting: Setting): Observable<Setting> {
    return this.settingsEndpoint.create(setting);
  }

  /**
   * Update an existing setting.
   * @param setting - The setting data to update.
   * @returns An observable of the updated setting.
   */
  updateSetting(setting: Setting): Observable<Setting> {
    return this.settingsEndpoint.update(setting, setting.id);
  }

  /**
   * Delete a setting by ID.
   * @param id - The ID of the setting to delete.
   * @returns An observable of void.
   */
  deleteSetting(id: number): Observable<void> {
    return this.settingsEndpoint.delete(id);
  }
}
