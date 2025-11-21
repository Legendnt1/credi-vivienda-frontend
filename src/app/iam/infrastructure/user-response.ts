import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response structure for user-related API calls.
 */
export interface UserResponse extends BaseResponse {
  /**
   * List of user resources.
   */
  users: UserResource[];
}

/**
 * Represents a user resource in the system.
 */
export interface UserResource extends BaseResource {
  /**
   * Unique identifier of the user.
   */
  id: number;
  /**
   * Username of the user.
   */
  username: string;
  /**
   * Password of the user.
   */
  password: string;
  /**
   * Indicates if the user is enabled.
   */
  enabled: boolean;
  /**
   * Email of the user.
   */
  email: string;
  /**
   * Address of the user.
   */
  address: string;
  /**
   * Registration date of the user.
   */
  registration_date: string;
  /**
   * Name of the user.
   */
  name: string;
  /**
   * Last name of the user.
   */
  last_name: string;
  /**
   * DNI of the user.
   */
  dni: string;
  /**
   * Income of the user.
   */
  income: number;
  /**
   * Savings of the user.
   */
  savings: number;
  /**
   * Indicates if the user has a bond.
   */
  has_bond: boolean;
  /**
   * Role ID associated with the user.
   */
  role_id: number;
}
