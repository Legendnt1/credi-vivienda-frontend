import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Credit} from '@financial/domain/model/credit.entity';
import {CreditResource, CreditResponse} from '@financial/infrastructure/credit-response';

/**
 * Assembler for converting between Credit entities and resources.
 */
export class CreditAssembler implements BaseAssembler<Credit, CreditResource, CreditResponse> {
  /**
   * Converts a CreditResponse to an array of Credit entities.
   * @param response _ The CreditResponse to convert.
   * @returns An array of Credit entities.
   */
  toEntitiesFromResponse(response: CreditResponse): Credit[] {
    return response.credits.map(resource => this.toEntityFromResource(resource as CreditResource));
  }

  /**
   * Converts a CreditResource to a Credit entity.
   * @param resource - The CreditResource to convert.
   * @returns A Credit entity.
   */
  toEntityFromResource(resource: CreditResource): Credit {
    return new Credit({
      id: resource.id,
      program: resource.program,
      default_credit_term_months: resource.default_credit_term_months,
      default_grace_period_total_months: resource.default_grace_period_total_months,
      default_grace_period_partial_months: resource.default_grace_period_partial_months,
      default_interest_rate: resource.default_interest_rate,
      default_interest_type: resource.default_interest_type,
      default_payment_frequency: resource.default_payment_frequency,
      default_bond_id: resource.default_bond_id,
      notary_cost: resource.notary_cost,
      registry_cost: resource.registry_cost,
      appraisal_cost: resource.appraisal_cost,
      study_commission: resource.study_commission,
      activation_commission: resource.activation_commission,
      periodic_commission: resource.periodic_commission,
      periodic_charges: resource.periodic_charges,
      periodic_admin_expense: resource.periodic_admin_expense,
      life_insurance_annual_rate: resource.life_insurance_annual_rate,
      risk_insurance_annual_rate: resource.risk_insurance_annual_rate,
    })
  }

  /**
   * Converts a Credit entity to a CreditResource.
   * @param entity - The Credit entity to convert.
   * @returns A CreditResource.
   */
  toResourceFromEntity(entity: Credit): CreditResource {
    return {
      id: entity.id,
      program: entity.program,
      default_credit_term_months: entity.default_credit_term_months,
      default_grace_period_total_months: entity.default_grace_period_total_months,
      default_grace_period_partial_months: entity.default_grace_period_partial_months,
      default_interest_rate: entity.default_interest_rate,
      default_interest_type: entity.default_interest_type,
      default_payment_frequency: entity.default_payment_frequency,
      default_bond_id: entity.default_bond_id,
      notary_cost: entity.notary_cost,
      registry_cost: entity.registry_cost,
      appraisal_cost: entity.appraisal_cost,
      study_commission: entity.study_commission,
      activation_commission: entity.activation_commission,
      periodic_commission: entity.periodic_commission,
      periodic_charges: entity.periodic_charges,
      periodic_admin_expense: entity.periodic_admin_expense,
      life_insurance_annual_rate: entity.life_insurance_annual_rate,
      risk_insurance_annual_rate: entity.risk_insurance_annual_rate,
    } as CreditResource;
  }

}
