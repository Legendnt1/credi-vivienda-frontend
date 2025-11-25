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
      down_payment: resource.down_payment,
      credit_term_months: resource.credit_term_months,
      grace_period_total: resource.grace_period_total,
      grace_period_partial: resource.grace_period_partial,
      interest_rate: resource.interest_rate,
      interest_type: resource.interest_type,
      payment_frequency: resource.payment_frequency,
      program: resource.program,
      tcea: resource.tcea,
      currency_catalogs_id: resource.currency_catalogs_id,
      bond_id: resource.bond_id,
      user_id: resource.user_id,
      property_project_id: resource.property_project_id
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
      down_payment: entity.down_payment,
      credit_term_months: entity.credit_term_months,
      grace_period_total: entity.grace_period_total,
      grace_period_partial: entity.grace_period_partial,
      interest_rate: entity.interest_rate,
      interest_type: entity.interest_type,
      payment_frequency: entity.payment_frequency,
      program: entity.program,
      tcea: entity.tcea,
      currency_catalogs_id: entity.currency_catalogs_id,
      bond_id: entity.bond_id,
      user_id: entity.user_id,
      property_project_id: entity.property_project_id
    } as CreditResource;
  }

}
