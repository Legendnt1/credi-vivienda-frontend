import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Payment entity in the financial bounded context.
 */
export class Payment implements BaseEntity {
  /**
   * The unique identifier of the payment.
   */
  _id: number;
  /**
   * The report identifier associated with the payment.
   */
  _report_id: number;
  /**
   * The period number of the payment.
   */
  _period: number;
  /**
   * The type of grace period for the payment.
   */
  _grace_type: string;
  /**
   * The annual interest rate for the payment.
   */
  _annual_rate: number;
  /**
   * The payment amount for the period.
   */
  _effective_period_rate: number;
  /**
   * The effective period interest rate.
   */
  _initial_balance: number;
  /**
   * The initial balance before the payment.
   */
  _interest_paid: number;
  /**
   * The interest paid during the period.
   */
  _installment_base: number;
  /**
   * The installment base amount.
   */
  _capital_amortization: number;
  /**
   * The capital amortization amount.
   */
  _life_insurance: number;
  /**
   * The life insurance amount.
   */
  _risk_insurance: number;
  /**
   * The risk insurance amount.
   */
  _commission: number;
  /**
   * The commission amount.
   */
  _charges: number;
  /**
   * The charges amount.
   */
  _admin_expense: number;
  /**
   * The administrative expense amount.
   */
  _total_payment: number;
  /**
   * The total payment amount.
   */
  _remaining_balance: number;
  /**
   * The remaining balance after the payment.
   */
  _cash_flow: number;


  /**
   * Creates a new Payment instance.
   * @param payment - An object containing payment properties.
   */
  constructor(payment: { id: number; report_id: number; period: number; grace_type: string; annual_rate: number;
    effective_period_rate: number; initial_balance: number;
    interest_paid: number; installment_base: number; capital_amortization: number;
    life_insurance: number; risk_insurance: number;
    commission: number; charges: number; admin_expense: number; total_payment: number; remaining_balance: number; cash_flow: number; }) {
    this._id = payment.id;
    this._report_id = payment.report_id;
    this._period = payment.period;
    this._grace_type = payment.grace_type;
    this._annual_rate = payment.annual_rate;
    this._effective_period_rate = payment.effective_period_rate;
    this._initial_balance = payment.initial_balance;
    this._interest_paid = payment.interest_paid;
    this._installment_base = payment.installment_base;
    this._capital_amortization = payment.capital_amortization;
    this._life_insurance = payment.life_insurance;
    this._risk_insurance = payment.risk_insurance;
    this._commission = payment.commission;
    this._charges = payment.charges;
    this._admin_expense = payment.admin_expense;
    this._total_payment = payment.total_payment;
    this._remaining_balance = payment.remaining_balance;
    this._cash_flow = payment.cash_flow;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get report_id(): number { return this._report_id; }
  set report_id(value: number) { this._report_id = value; }
  get period(): number { return this._period; }
  set period(value: number) { this._period = value; }
  get grace_type(): string { return this._grace_type; }
  set grace_type(value: string) { this._grace_type = value; }
  get annual_rate(): number { return this._annual_rate; }
  set annual_rate(value: number) { this._annual_rate = value; }
  get effective_period_rate(): number { return this._effective_period_rate; }
  set effective_period_rate(value: number) { this._effective_period_rate = value; }
  get initial_balance(): number { return this._initial_balance; }
  set initial_balance(value: number) { this._initial_balance = value; }
  get interest_paid(): number { return this._interest_paid; }
  set interest_paid(value: number) { this._interest_paid = value; }
  get installment_base(): number { return this._installment_base; }
  set installment_base(value: number) { this._installment_base = value; }
  get capital_amortization(): number { return this._capital_amortization; }
  set capital_amortization(value: number) { this._capital_amortization = value; }
  get life_insurance(): number { return this._life_insurance; }
  set life_insurance(value: number) { this._life_insurance = value; }
  get risk_insurance(): number { return this._risk_insurance; }
  set risk_insurance(value: number) { this._risk_insurance = value; }
  get commission(): number { return this._commission; }
  set commission(value: number) { this._commission = value; }
  get charges(): number { return this._charges; }
  set charges(value: number) { this._charges = value; }
  get admin_expense(): number { return this._admin_expense; }
  set admin_expense(value: number) { this._admin_expense = value; }
  get total_payment(): number { return this._total_payment; }
  set total_payment(value: number) { this._total_payment = value; }
  get remaining_balance(): number { return this._remaining_balance; }
  set remaining_balance(value: number) { this._remaining_balance = value; }
  get cash_flow(): number { return this._cash_flow; }
  set cash_flow(value: number) { this._cash_flow = value; }
}
