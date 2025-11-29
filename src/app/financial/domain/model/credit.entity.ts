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
   * The program associated with the credit.
   */
  _program: string;
  /**
   * The type of credit.
   */
  _default_credit_term_months: number;
  /**
   * The default grace period in total months.
   */
  _default_grace_period_total_months: number;
  /**
   * The default grace period in partial months.
   */
  _default_grace_period_partial_months: number;
  /**
   * The default interest rate for the credit.
   */
  _default_interest_rate: number;
  /**
   * The default interest type for the credit.
   */
  _default_interest_type: string;
  /**
   * The default payment frequency for the credit.
   */
  _default_payment_frequency: string;
  /**
   * The default bond ID associated with the credit.
   */
  _default_bond_id: number;
  /**
   * The default currency ID for the credit.
   */
  _notary_cost: number;
  /**
   * The default currency ID for the credit.
   */
  _registry_cost: number;
  /**
   * The default currency ID for the credit.
   */
  _appraisal_cost: number;
  /**
   * The default currency ID for the credit.
   */
  _study_commission: number;
  /**
   * The activation commission for the credit.
   */
  _activation_commission: number;
  /**
   * The periodic commission for the credit.
   */
  _periodic_commission: number;
  /**
   * The periodic charges for the credit.
   */
  _periodic_charges: number;
  /**
   * The periodic admin expense for the credit.
   */
  _periodic_admin_expense: number;
  /**
   * The life insurance annual rate for the credit.
   */
  _life_insurance_annual_rate: number;
  /**
   * The risk insurance annual rate for the credit.
   */
  _risk_insurance_annual_rate: number;


  /**
   * Creates a new Credit instance.
   * @param credit - An object containing credit properties.
   */
  constructor(credit: { id: number; program: string; default_credit_term_months: number; default_grace_period_total_months: number;
    default_grace_period_partial_months: number; default_interest_rate: number; default_interest_type: string;
    default_payment_frequency: string; default_bond_id: number; notary_cost: number; registry_cost: number;
    appraisal_cost: number; study_commission: number; activation_commission: number; periodic_commission: number;
    periodic_charges: number; periodic_admin_expense: number; life_insurance_annual_rate: number; risk_insurance_annual_rate: number; }) {
    this._id = credit.id;
    this._program = credit.program;
    this._default_credit_term_months = credit.default_credit_term_months;
    this._default_grace_period_total_months = credit.default_grace_period_total_months;
    this._default_grace_period_partial_months = credit.default_grace_period_partial_months;
    this._default_interest_rate = credit.default_interest_rate;
    this._default_interest_type = credit.default_interest_type;
    this._default_payment_frequency = credit.default_payment_frequency;
    this._default_bond_id = credit.default_bond_id;
    this._notary_cost = credit.notary_cost;
    this._registry_cost = credit.registry_cost;
    this._appraisal_cost = credit.appraisal_cost;
    this._study_commission = credit.study_commission;
    this._activation_commission = credit.activation_commission;
    this._periodic_commission = credit.periodic_commission;
    this._periodic_charges = credit.periodic_charges;
    this._periodic_admin_expense = credit.periodic_admin_expense;
    this._life_insurance_annual_rate = credit.life_insurance_annual_rate;
    this._risk_insurance_annual_rate = credit.risk_insurance_annual_rate;

  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get program(): string { return this._program; }
  set program(value: string) { this._program = value; }
  get default_credit_term_months(): number { return this._default_credit_term_months; }
  set default_credit_term_months(value: number) { this._default_credit_term_months = value; }
  get default_grace_period_total_months(): number { return this._default_grace_period_total_months; }
  set default_grace_period_total_months(value: number) { this._default_grace_period_total_months = value; }
  get default_grace_period_partial_months(): number { return this._default_grace_period_partial_months; }
  set default_grace_period_partial_months(value: number) { this._default_grace_period_partial_months = value; }
  get default_interest_rate(): number { return this._default_interest_rate; }
  set default_interest_rate(value: number) { this._default_interest_rate = value; }
  get default_interest_type(): string { return this._default_interest_type; }
  set default_interest_type(value: string) { this._default_interest_type = value; }
  get default_payment_frequency(): string { return this._default_payment_frequency; }
  set default_payment_frequency(value: string) { this._default_payment_frequency = value; }
  get default_bond_id(): number { return this._default_bond_id; }
  set default_bond_id(value: number) { this._default_bond_id = value; }
  get notary_cost(): number { return this._notary_cost; }
  set notary_cost(value: number) { this._notary_cost = value; }
  get registry_cost(): number { return this._registry_cost; }
  set registry_cost(value: number) { this._registry_cost = value; }
  get appraisal_cost(): number { return this._appraisal_cost; }
  set appraisal_cost(value: number) { this._appraisal_cost = value; }
  get study_commission(): number { return this._study_commission; }
  set study_commission(value: number) { this._study_commission = value; }
  get activation_commission(): number { return this._activation_commission; }
  set activation_commission(value: number) { this._activation_commission = value; }
  get periodic_commission(): number { return this._periodic_commission; }
  set periodic_commission(value: number) { this._periodic_commission = value; }
  get periodic_charges(): number { return this._periodic_charges; }
  set periodic_charges(value: number) { this._periodic_charges = value; }
  get periodic_admin_expense(): number { return this._periodic_admin_expense; }
  set periodic_admin_expense(value: number) { this._periodic_admin_expense = value; }
  get life_insurance_annual_rate(): number { return this._life_insurance_annual_rate; }
  set life_insurance_annual_rate(value: number) { this._life_insurance_annual_rate = value; }
  get risk_insurance_annual_rate(): number { return this._risk_insurance_annual_rate; }
  set risk_insurance_annual_rate(value: number) { this._risk_insurance_annual_rate = value; }
}
