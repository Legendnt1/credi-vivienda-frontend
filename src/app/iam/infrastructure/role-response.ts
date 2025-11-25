import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response structure for role-related API calls.
 */
export interface RoleResponse extends BaseResponse {
  /**
   * List of role resources.
   */
  roles : RoleResource[];
}


export interface RoleResource extends BaseResource {
  /**
   * Unique identifier of the role.
   */
  id: number;
  /**
   * Name of the role.
   */
  role: string;
}
