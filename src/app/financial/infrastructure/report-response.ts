import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface ReportResponse extends BaseResponse {
  reports: ReportResource[];
}

export interface ReportResource extends BaseResource {
  /**
   * The unique identifier of the report
   */
  id: number;
  /**
   * The identifier of the user associated with the report
   */
  user_id: number;
  /**
   * The identifier of the credit associated with the report
   */
  credit_id: number;
  /**
   * The identifier of the property project associated with the report
   */
  property_project_id: number;
  /**
   * The identifier of the currency settings used in the report
   */
  currency_catalog_id: number;
  /**
   * The timestamp when the report was generated
   */
  generated_at: string;
  /**
   * The price of the property in the report
   */
  price: number;
  /**
   * The down payment made for the property
   */
  down_payment: number;
  /**
   * The bond amount applied for the property
   */
  bond_applied: number;
  /**
   * The duration of the loan in years
   */
  years: number;
  /**
   * The payment frequency (e.g., monthly, quarterly)
   */
  frequency: string;
  /**
   * The base effective annual rate (TEA) used in calculations
   */
  base_tea: number;
  /**
   * The notary cost applied in calculations
   */
  notary: number;
  /**
   * The registry cost applied in calculations
   */
  registry: number;
  /**
   * The appraisal cost applied in calculations
   */
  appraisal: number;
  /**
   * The study commission applied in calculations
   */
  study_commission: number;
  /**
   * The activation commission applied in calculations
   */
  activation_commission: number;
  /**
   * The commission applied in calculations
   */
  commission: number;
  /**
   * The charges applied in calculations
   */
  charges: number;
  /**
   * The administrative expense used in calculations
   */
  admin_expense: number;
  /**
   * The life insurance annual rate used in calculations
   */
  life_insurance_annual_rate: number;
  /**
   * The risk insurance annual rate used in calculations
   */
  risk_insurance_annual_rate: number;
  /**
   * The (COK) opportunity effective annual rate (TEA) used in calculations
   */
  opportunity_tea: number;
  /**
   * The total number of installments paid over the loan period
   */
  total_installments_paid: number;
  /**
   * The total amortization amount paid over the loan period
   */
  total_amortization: number;
  /**
   * The total interest paid over the loan period
   */
  total_interest: number;
  /**
   * The total payments made over the loan period
   */
  total_payments_report: number;
  /**
   * The net present value (VAN) of the loan
   */
  van: number;
  /**
   * The internal rate of return (TIR) of the loan
   */
  tir: number;
  /**
   * The total effective cost (CET) of the loan
   */
  tcea: number;
}
