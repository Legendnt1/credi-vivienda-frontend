import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a User Setting entity in the IAM bounded context.
 */
export class Setting implements BaseEntity {
  /**
   * The unique identifier of the user setting.
   */
  _id: number;
  /**
   * The identifier of the user associated with the setting.
   */
  _default_currency_catalog_id: number;
  /**
   * The default interest type for the user.
   */
  _default_interest_type: string;
  /**
   * The default number of total grace months.
   */
  _default_grace_period: string;

  /**
   * Creates a new UserSetting instance.
   * @param setting - An object containing user setting properties.
   */
  constructor(setting: { id: number; default_currency_catalog_id: number; default_interest_type: string;
    default_grace_period: string; }) {
    this._id = setting.id;
    this._default_currency_catalog_id = setting.default_currency_catalog_id;
    this._default_interest_type = setting.default_interest_type;
    this._default_grace_period = setting.default_grace_period;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get default_currency_catalog_id(): number { return this._default_currency_catalog_id; }
  set default_currency_catalog_id(value: number) { this._default_currency_catalog_id = value; }
  get default_interest_type(): string { return this._default_interest_type; }
  set default_interest_type(value: string) { this._default_interest_type = value; }
  get default_grace_period(): string { return this._default_grace_period; }
  set default_grace_period(value: string) { this._default_grace_period = value; }
}
