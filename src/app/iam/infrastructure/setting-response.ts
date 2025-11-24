import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response interface for User Settings in the IAM bounded context.
 */
export interface SettingResponse extends BaseResponse {
  /**
   * The list of user settings.
   */
  settings: SettingResource[];
}

/**
 * Resource interface representing a User Setting.
 */
export interface SettingResource extends BaseResource {
  /**
   * The unique identifier of the user setting.
   */
  id: number;
  /**
   * The identifier of the user associated with the setting.
   */
  default_currency_catalog_id: number;
  /**
   * The default interest type for the user.
   */
  default_interest_type: string;
  /**
   * The default number of total grace months.
   */
  default_grace_period: string;
}
