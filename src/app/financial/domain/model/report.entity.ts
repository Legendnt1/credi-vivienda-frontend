import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Report Entity in the Financial Bounded Context
 */
export class Report implements BaseEntity{
  /**
   * The unique identifier of the report
   */
  _id: number;
  /**
   * The identifier of the user associated with the report
   */
  _user_id: number;
  /**
   * The identifier of the credit associated with the report
   */
  _credit_id: number;
  /**
   * The identifier of the property project associated with the report
   */
  _property_project_id: number;
  /**
   * The identifier of the settings used to generate the report
   */
  _settings_id: number;
  /**
   * The timestamp when the report was generated
   */
  _generated_at: string;
  /**
   * The price of the property in the report
   */
  _price: number;
  /**
   * The down payment made for the property
   */
  _down_payment: number;
  /**
   * The bond amount applied for the property
   */
  _bond_applied: number;
  /**
   * The duration of the loan in years
   */
  _years: number;
  /**
   * The payment frequency (e.g., monthly, quarterly)
   */
  _frequency: string;
  /**
   * The base effective annual rate (TEA) used in calculations
   */
  _base_tea: number;
  /**
   * The total number of installments paid over the loan period
   */
  _total_installments_paid: number;
  /**
   * The total amortization amount paid over the loan period
   */
  _total_amortization: number;
  /**
   * The total interest paid over the loan period
   */
  _total_interest: number;
  /**
   * The net present value (VAN) of the loan
   */
  _van: number;
  /**
   * The internal rate of return (TIR) of the loan
   */
  _tir: number;
  /**
   * The total effective cost (CET) of the loan
   */
  _cet: number;

  /**
   * Constructor to create a Report entity
   * @param report - An object containing all necessary properties to initialize the Report entity
   */
  constructor(report: { id: number; user_id: number; credit_id: number; property_project_id: number;
    settings_id: number; generated_at: string; price: number; down_payment: number; bond_applied: number;
    years: number; frequency: string; base_tea: number; total_installments_paid: number; total_amortization: number;
    total_interest: number; van: number; tir: number; cet: number }) {
    this._id = report.id;
    this._user_id = report.user_id;
    this._credit_id = report.credit_id;
    this._property_project_id = report.property_project_id;
    this._settings_id = report.settings_id;
    this._generated_at = report.generated_at;
    this._price = report.price;
    this._down_payment = report.down_payment;
    this._bond_applied = report.bond_applied;
    this._years = report.years;
    this._frequency = report.frequency;
    this._base_tea = report.base_tea;
    this._total_installments_paid = report.total_installments_paid;
    this._total_amortization = report.total_amortization;
    this._total_interest = report.total_interest;
    this._van = report.van;
    this._tir = report.tir;
    this._cet = report.cet;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get user_id(): number { return this._user_id; }
  set user_id(value: number) { this._user_id = value; }
  get credit_id(): number { return this._credit_id; }
  set credit_id(value: number) { this._credit_id = value; }
  get property_project_id(): number { return this._property_project_id; }
  set property_project_id(value: number) { this._property_project_id = value; }
  get settings_id(): number { return this._settings_id; }
  set settings_id(value: number) { this._settings_id = value; }
  get generated_at(): string { return this._generated_at; }
  set generated_at(value: string) { this._generated_at = value; }
  get price(): number { return this._price; }
  set price(value: number) { this._price = value; }
  get down_payment(): number { return this._down_payment; }
  set down_payment(value: number) { this._down_payment = value; }
  get bond_applied(): number { return this._bond_applied; }
  set bond_applied(value: number) { this._bond_applied = value; }
  get years(): number { return this._years; }
  set years(value: number) { this._years = value; }
  get frequency(): string { return this._frequency; }
  set frequency(value: string) { this._frequency = value; }
  get base_tea(): number { return this._base_tea; }
  set base_tea(value: number) { this._base_tea = value; }
  get total_installments_paid(): number { return this._total_installments_paid; }
  set total_installments_paid(value: number) { this._total_installments_paid = value; }
  get total_amortization(): number { return this._total_amortization; }
  set total_amortization(value: number) { this._total_amortization = value; }
  get total_interest(): number { return this._total_interest; }
  set total_interest(value: number) { this._total_interest = value; }
  get van(): number { return this._van; }
  set van(value: number) { this._van = value; }
  get tir(): number { return this._tir; }
  set tir(value: number) { this._tir = value; }
  get cet(): number { return this._cet; }
  set cet(value: number) { this._cet = value; }
}
