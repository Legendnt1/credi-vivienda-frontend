import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for Credit resources.
 */
export interface CreditResponse extends BaseResponse {
  /**
   * The list of Credit resources.
   */
  credits: CreditResource[];
}

/**
 * Represents a Credit resource.
 */
export interface CreditResource extends BaseResource {
  /**
   * The unique identifier of the credit.
   */
  id: number;
  /**
   * The down payment amount.
   */
  down_payment: number;
  /**
   * The credit term in months.
   */
  credit_term_months: number;
  /**
   * The total grace period in months.
   */
  grace_period_total: number;
  /**
   * The partial grace period in months.
   */
  grace_period_partial: number;
  /**
   * The interest rate.
   */
  interest_rate: number;
  /**
   * The type of interest.
   */
  interest_type: string;
  /**
   * The payment frequency.
   */
  payment_frequency: string;
  /**
   * The credit program.
   */
  program: string;
  /**
   * The effective annual cost rate (TCEA).
   */
  tcea: number;
  /**
   * The currency catalog identifier.
   */
  currency_catalogs_id: number;
  /**
   * The bond identifier.
   */
  bond_id: number;
  /**
   * The user identifier.
   */
  user_id: number;
  /**
   * The property project identifier.
   */
  property_project_id: number;
}
