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
   * The payment amount for the period.
   */
  effective_period_rate: number;
  /**
   * The effective period interest rate.
   */
  initial_balance: number;
  /**
   * The initial balance before the payment.
   */
  interest_paid: number;
  /**
   * The interest paid during the period.
   */
  installment_base: number;
  /**
   * The installment base amount.
   */
  capital_amortization: number;
  /**
   * The capital amortization amount.
   */
  life_insurance: number;
  /**
   * The life insurance amount.
   */
  risk_insurance: number;
  /**
   * The risk insurance amount.
   */
  commission: number;
  /**
   * The commission amount.
   */
  charges: number;
  /**
   * The charges amount.
   */
  admin_expense: number;
  /**
   * The administrative expense amount.
   */
  total_payment: number;
  /**
   * The total payment amount.
   */
  remaining_balance: number;
  /**
   * The remaining balance after the payment.
   */
  cash_flow: number;
}
