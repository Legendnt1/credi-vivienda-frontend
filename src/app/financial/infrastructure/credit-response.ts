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
   * The program associated with the credit.
   */
  program: string;
  /**
   * The type of credit.
   */
  default_credit_term_months: number;
  /**
   * The default grace period in total months.
   */
  default_grace_period_total_months: number;
  /**
   * The default grace period in partial months.
   */
  default_grace_period_partial_months: number;
  /**
   * The default interest rate for the credit.
   */
  default_interest_rate: number;
  /**
   * The default interest type for the credit.
   */
  default_interest_type: string;
  /**
   * The default payment frequency for the credit.
   */
  default_payment_frequency: string;
  /**
   * The default bond ID associated with the credit.
   */
  default_bond_id: number;
  /**
   * The default currency ID for the credit.
   */
  notary_cost: number;
  /**
   * The default currency ID for the credit.
   */
  registry_cost: number;
  /**
   * The default currency ID for the credit.
   */
  appraisal_cost: number;
  /**
   * The default currency ID for the credit.
   */
  study_commission: number;
  /**
   * The activation commission for the credit.
   */
  activation_commission: number;
  /**
   * The periodic commission for the credit.
   */
  periodic_commission: number;
  /**
   * The periodic charges for the credit.
   */
  periodic_charges: number;
  /**
   * The periodic admin expense for the credit.
   */
  periodic_admin_expense: number;
  /**
   * The life insurance annual rate for the credit.
   */
  life_insurance_annual_rate: number;
  /**
   * The risk insurance annual rate for the credit.
   */
  risk_insurance_annual_rate: number;
}
