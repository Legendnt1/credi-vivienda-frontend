import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for payment-related API calls.
 */
export interface PaymentResponse extends BaseResponse {
  /**
   * The list of payments returned in the response.
   */
  payments: PaymentResource[];
}

/**
 * Represents a Payment resource in the financial bounded context.
 */
export interface PaymentResource extends BaseResource {
  /**
   * The unique identifier of the payment.
   */
  id: number;
  /**
   * The payment period.
   */
  period: number;
  /**
   * The payment date.
   */
  payment_date: string;
  /**
   * The payment amount.
   */
  payment_amount: number;
  /**
   * The capital amortization amount.
   */
  capital_amortization: number;
  /**
   * The interest paid amount.
   */
  interest_paid: number;
  /**
   * The effective rate for the period.
   */
  effective_rate_period: number;
  /**
   * The type of grace period.
   */
  grace_type: string;
  /**
   * The remaining balance after the payment.
   */
  remaining_balance: number;
  /**
   * The credit identifier associated with the payment.
   */
  credit_id: number;
}
