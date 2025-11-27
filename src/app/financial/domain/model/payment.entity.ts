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
   * The effective period interest rate for the payment.
   */
  _effective_period_rate: number;
  /**
   * The initial balance before the payment.
   */
  _initial_balance: number;
  /**
   * The interest paid in the payment.
   */
  _interest_paid: number;
  /**
   * The total payment amount.
   */
  _payment_amount: number;
  /**
   * The capital amortization portion of the payment.
   */
  _capital_amortization: number;
  /**
   * The remaining balance after the payment.
   */
  _remaining_balance: number;


  /**
   * Creates a new Payment instance.
   * @param payment - An object containing payment properties.
   */
  constructor(payment: { id: number; report_id: number; period: number; grace_type:
      string; annual_rate: number; effective_period_rate: number; initial_balance: number;
      interest_paid: number; payment_amount: number; capital_amortization: number; remaining_balance: number }) {
    this._id = payment.id;
    this._report_id = payment.report_id;
    this._period = payment.period;
    this._grace_type = payment.grace_type;
    this._annual_rate = payment.annual_rate;
    this._effective_period_rate = payment.effective_period_rate;
    this._initial_balance = payment.initial_balance;
    this._interest_paid = payment.interest_paid;
    this._payment_amount = payment.payment_amount;
    this._capital_amortization = payment.capital_amortization;
    this._remaining_balance = payment.remaining_balance;
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
  get payment_amount(): number { return this._payment_amount; }
  set payment_amount(value: number) { this._payment_amount = value; }
  get capital_amortization(): number { return this._capital_amortization; }
  set capital_amortization(value: number) { this._capital_amortization = value; }
  get remaining_balance(): number { return this._remaining_balance; }
  set remaining_balance(value: number) { this._remaining_balance = value; }
}
