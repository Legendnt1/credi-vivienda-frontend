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
   * The report identifier associated with the payment.
   */
  report_id: number;
  /**
   * The period number of the payment.
   */
  period: number;
  /**
   * The type of grace period for the payment.
   */
  grace_type: string;
  /**
   * The annual interest rate for the payment.
   */
  annual_rate: number;
  /**
   * The effective period interest rate for the payment.
   */
  effective_period_rate: number;
  /**
   * The initial balance before the payment.
   */
  initial_balance: number;
  /**
   * The interest paid in the payment.
   */
  interest_paid: number;
  /**
   * The total payment amount.
   */
  payment_amount: number;
  /**
   * The capital amortization portion of the payment.
   */
  capital_amortization: number;
  /**
   * The remaining balance after the payment.
   */
  remaining_balance: number;
}
