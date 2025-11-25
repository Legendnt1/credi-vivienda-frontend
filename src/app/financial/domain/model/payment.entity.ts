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
   * The payment period.
   */
  _period: number;
  /**
   * The payment date.
   */
  _payment_date: string;
  /**
   * The payment amount.
   */
  _payment_amount: number;
  /**
   * The capital amortization amount.
   */
  _capital_amortization: number;
  /**
   * The interest paid amount.
   */
  _interest_paid: number;
  /**
   * The effective rate for the period.
   */
  _effective_rate_period: number;
  /**
   * The type of grace period.
   */
  _grace_type: string;
  /**
   * The remaining balance after the payment.
   */
  _remaining_balance: number;
  /**
   * The credit identifier associated with the payment.
   */
  _credit_id: number;

  /**
   * Creates a new Payment instance.
   * @param payment - An object containing payment properties.
   */
  constructor(payment: { id: number; period: number; payment_date: string; payment_amount: number;
    capital_amortization: number; interest_paid: number; effective_rate_period: number;
    grace_type: string; remaining_balance: number; credit_id: number }) {

    this._id = payment.id;
    this._period = payment.period;
    this._payment_date = payment.payment_date;
    this._payment_amount = payment.payment_amount;
    this._capital_amortization = payment.capital_amortization;
    this._interest_paid = payment.interest_paid;
    this._effective_rate_period = payment.effective_rate_period;
    this._grace_type = payment.grace_type;
    this._remaining_balance = payment.remaining_balance;
    this._credit_id = payment.credit_id;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get period(): number { return this._period; }
  set period(value: number) { this._period = value; }
  get payment_date(): string { return this._payment_date; }
  set payment_date(value: string) { this._payment_date = value; }
  get payment_amount(): number { return this._payment_amount; }
  set payment_amount(value: number) { this._payment_amount = value; }
  get capital_amortization(): number { return this._capital_amortization; }
  set capital_amortization(value: number) { this._capital_amortization = value; }
  get interest_paid(): number { return this._interest_paid; }
  set interest_paid(value: number) { this._interest_paid = value; }
  get effective_rate_period(): number { return this._effective_rate_period; }
  set effective_rate_period(value: number) { this._effective_rate_period = value; }
  get grace_type(): string { return this._grace_type; }
  set grace_type(value: string) { this._grace_type = value; }
  get remaining_balance(): number { return this._remaining_balance; }
  set remaining_balance(value: number) { this._remaining_balance = value; }
  get credit_id(): number { return this._credit_id; }
  set credit_id(value: number) { this._credit_id = value; }
}
