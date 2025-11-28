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
   * The notary cost applied in calculations
   */
  _notary: number;
  /**
   * The registry cost applied in calculations
   */
  _registry: number;
  /**
   * The appraisal cost applied in calculations
   */
  _appraisal: number;
  /**
   * The study commission applied in calculations
   */
  _study_commission: number;
  /**
   * The activation commission applied in calculations
   */
  _activation_commission: number;
  /**
   * The commission applied in calculations
   */
  _commission: number;
  /**
   * The charges applied in calculations
   */
  _charges: number;
  /**
   * The administrative expense used in calculations
   */
  _admin_expense: number;
  /**
   * The life insurance annual rate used in calculations
   */
  _life_insurance_annual_rate: number;
  /**
   * The risk insurance annual rate used in calculations
   */
  _risk_insurance_annual_rate: number;
  /**
   * The (COK) opportunity effective annual rate (TEA) used in calculations
   */
  _opportunity_tea: number;
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
   * The total payments made over the loan period
   */
  _total_payments_report: number;
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
  _tcea: number;

  /**
   * Constructor to create a Report entity
   * @param report - An object containing all necessary properties to initialize the Report entity
   */
  constructor(report: { id: number; user_id: number; credit_id: number;
    property_project_id: number; settings_id: number; generated_at: string;
    price: number; down_payment: number; bond_applied: number; years: number; frequency: string;
    base_tea: number; notary: number; registry: number; appraisal: number; study_commission: number;
    activation_commission: number; commission: number; charges: number; admin_expense: number;
    life_insurance_annual_rate: number; risk_insurance_annual_rate: number; opportunity_tea: number;
    total_installments_paid: number; total_amortization: number; total_interest: number; total_payments_report: number;
    van: number; tir: number; tcea: number; }) {
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
    this._notary = report.notary;
    this._registry = report.registry;
    this._appraisal = report.appraisal;
    this._study_commission = report.study_commission;
    this._activation_commission = report.activation_commission;
    this._commission = report.commission;
    this._charges = report.charges;
    this._admin_expense = report.admin_expense;
    this._life_insurance_annual_rate = report.life_insurance_annual_rate;
    this._risk_insurance_annual_rate = report.risk_insurance_annual_rate;
    this._opportunity_tea = report.opportunity_tea;
    this._total_installments_paid = report.total_installments_paid;
    this._total_amortization = report.total_amortization;
    this._total_interest = report.total_interest;
    this._total_payments_report = report.total_payments_report;
    this._van = report.van;
    this._tir = report.tir;
    this._tcea = report.tcea;
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
  get notary(): number { return this._notary; }
  set notary(value: number) { this._notary = value; }
  get registry(): number { return this._registry; }
  set registry(value: number) { this._registry = value; }
  get appraisal(): number { return this._appraisal; }
  set appraisal(value: number) { this._appraisal = value; }
  get study_commission(): number { return this._study_commission; }
  set study_commission(value: number) { this._study_commission = value; }
  get activation_commission(): number { return this._activation_commission; }
  set activation_commission(value: number) { this._activation_commission = value; }
  get commission(): number { return this._commission; }
  set commission(value: number) { this._commission = value; }
  get charges(): number { return this._charges; }
  set charges(value: number) { this._charges = value; }
  get admin_expense(): number { return this._admin_expense; }
  set admin_expense(value: number) { this._admin_expense = value; }
  get life_insurance_annual_rate(): number { return this._life_insurance_annual_rate; }
  set life_insurance_annual_rate(value: number) { this._life_insurance_annual_rate = value; }
  get risk_insurance_annual_rate(): number { return this._risk_insurance_annual_rate; }
  set risk_insurance_annual_rate(value: number) { this._risk_insurance_annual_rate = value; }
  get opportunity_tea(): number { return this._opportunity_tea; }
  set opportunity_tea(value: number) { this._opportunity_tea = value; }
  get total_installments_paid(): number { return this._total_installments_paid; }
  set total_installments_paid(value: number) { this._total_installments_paid = value; }
  get total_amortization(): number { return this._total_amortization; }
  set total_amortization(value: number) { this._total_amortization = value; }
  get total_interest(): number { return this._total_interest; }
  set total_interest(value: number) { this._total_interest = value; }
  get total_payments_report(): number { return this._total_payments_report; }
  set total_payments_report(value: number) { this._total_payments_report = value; }
  get van(): number { return this._van; }
  set van(value: number) { this._van = value; }
  get tir(): number { return this._tir; }
  set tir(value: number) { this._tir = value; }
  get tcea(): number { return this._tcea; }
  set tcea(value: number) { this._tcea = value; }
}
