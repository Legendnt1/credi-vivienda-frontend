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
  _user_id: number;
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
   * The COK default opportunity tea.
   */
  _default_opportunity_tea: number;
  /**
   * The default days in year.
   */
  _default_days_in_year: number;
  /**
   * The default change USD to PEN.
   */
  _default_change_usd_pen: number;

  /**
   * Creates a new UserSetting instance.
   * @param setting - An object containing user setting properties.
   */
  constructor(setting: { id: number; user_id: number; default_currency_catalog_id: number; default_interest_type: string;
    default_grace_period: string; default_opportunity_tea: number; default_days_in_year: number;
    default_change_usd_pen: number}) {
    this._id = setting.id;
    this._user_id = setting.user_id;
    this._default_currency_catalog_id = setting.default_currency_catalog_id;
    this._default_interest_type = setting.default_interest_type;
    this._default_grace_period = setting.default_grace_period;
    this._default_opportunity_tea = setting.default_opportunity_tea;
    this._default_days_in_year = setting.default_days_in_year;
    this._default_change_usd_pen = setting.default_change_usd_pen;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get user_id(): number { return this._user_id; }
  set user_id(value: number) { this._user_id = value; }
  get default_currency_catalog_id(): number { return this._default_currency_catalog_id; }
  set default_currency_catalog_id(value: number) { this._default_currency_catalog_id = value; }
  get default_interest_type(): string { return this._default_interest_type; }
  set default_interest_type(value: string) { this._default_interest_type = value; }
  get default_grace_period(): string { return this._default_grace_period; }
  set default_grace_period(value: string) { this._default_grace_period = value; }
  get default_opportunity_tea(): number { return this._default_opportunity_tea; }
  set default_opportunity_tea(value: number) { this._default_opportunity_tea = value; }
  get default_days_in_year(): number { return this._default_days_in_year; }
  set default_days_in_year(value: number) { this._default_days_in_year = value; }
  get default_change_usd_pen(): number { return this._default_change_usd_pen; }
  set default_change_usd_pen(value: number) { this._default_change_usd_pen = value; }
}
