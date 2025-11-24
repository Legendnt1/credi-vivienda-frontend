import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Credit entity in the financial bounded context.
 */
export class Credit implements BaseEntity {
  /**
   * The unique identifier of the credit.
   */
  _id: number;
  /**
   * The down payment amount.
   */
  _down_payment: number;
  /**
   * The credit term in months.
   */
  _credit_term_months: number;
  /**
   * The total grace period in months.
   */
  _grace_period_total: number;
  /**
   * The partial grace period in months.
   */
  _grace_period_partial: number;
  /**
   * The interest rate.
   */
  _interest_rate: number;
  /**
   * The type of interest.
   */
  _interest_type: string;
  /**
   * The payment frequency.
   */
  _payment_frequency: string;
  /**
   * The credit program.
   */
  _program: string;
  /**
   * The effective annual cost rate (TCEA).
   */
  _tcea: number;
  /**
   * The currency catalog identifier.
   */
  _currency_catalogs_id: number;
  /**
   * The bond identifier.
   */
  _bond_id: number;
  /**
   * The user identifier.
   */
  _user_id: number;
  /**
   * The property project identifier.
   */
  _property_project_id: number;

  /**
   * Creates a new Credit instance.
   * @param credit - An object containing credit properties.
   */
  constructor(credit: { id: number; down_payment: number; credit_term_months: number; grace_period_total: number;
    grace_period_partial: number; interest_rate: number; interest_type: string; payment_frequency: string; program: string;
    tcea: number; currency_catalogs_id: number; bond_id: number; user_id: number; property_project_id: number; }) {
    this._id = credit.id;
    this._down_payment = credit.down_payment;
    this._credit_term_months = credit.credit_term_months;
    this._grace_period_total = credit.grace_period_total;
    this._grace_period_partial = credit.grace_period_partial;
    this._interest_rate = credit.interest_rate;
    this._interest_type = credit.interest_type;
    this._payment_frequency = credit.payment_frequency;
    this._program = credit.program;
    this._tcea = credit.tcea;
    this._currency_catalogs_id = credit.currency_catalogs_id;
    this._bond_id = credit.bond_id;
    this._user_id = credit.user_id;
    this._property_project_id = credit.property_project_id;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get down_payment(): number { return this._down_payment; }
  set down_payment(value: number) { this._down_payment = value; }
  get credit_term_months(): number { return this._credit_term_months; }
  set credit_term_months(value: number) { this._credit_term_months = value; }
  get grace_period_total(): number { return this._grace_period_total; }
  set grace_period_total(value: number) { this._grace_period_total = value; }
  get grace_period_partial(): number { return this._grace_period_partial; }
  set grace_period_partial(value: number) { this._grace_period_partial = value; }
  get interest_rate(): number { return this._interest_rate; }
  set interest_rate(value: number) { this._interest_rate = value; }
  get interest_type(): string { return this._interest_type; }
  set interest_type(value: string) { this._interest_type = value; }
  get payment_frequency(): string { return this._payment_frequency; }
  set payment_frequency(value: string) { this._payment_frequency = value; }
  get program(): string { return this._program; }
  set program(value: string) { this._program = value; }
  get tcea(): number { return this._tcea; }
  set tcea(value: number) { this._tcea = value; }
  get currency_catalogs_id(): number { return this._currency_catalogs_id; }
  set currency_catalogs_id(value: number) { this._currency_catalogs_id = value; }
  get bond_id(): number { return this._bond_id; }
  set bond_id(value: number) { this._bond_id = value; }
  get user_id(): number { return this._user_id; }
  set user_id(value: number) { this._user_id = value; }
  get property_project_id(): number { return this._property_project_id; }
  set property_project_id(value: number) { this._property_project_id = value; }
}
