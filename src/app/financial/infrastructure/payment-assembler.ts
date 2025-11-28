import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Payment} from '@financial/domain/model/payment.entity';
import {PaymentResource, PaymentResponse} from '@financial/infrastructure/payment-response';

/**
 * Assembler for converting between Payment entities and resources.
 */
export class PaymentAssembler implements BaseAssembler<Payment, PaymentResource, PaymentResponse> {
  /**
   * Converts a PaymentResponse to an array of Payment entities.
   * @param response - The PaymentResponse containing payment resources.
   * @returns An array of Payment entities.
   */
  toEntitiesFromResponse(response: PaymentResponse): Payment[] {
    return response.payments.map(resource => this.toEntityFromResource(resource as PaymentResource));
  }

  /**
   * Converts a PaymentResource to a Payment entity.
   * @param resource - The PaymentResource to convert.
   * @returns The corresponding Payment entity.
   */
  toEntityFromResource(resource: PaymentResource): Payment {
    return new Payment({
      id: resource.id,
      report_id: resource.report_id,
      period: resource.period,
      grace_type: resource.grace_type,
      annual_rate: resource.annual_rate,
      effective_period_rate: resource.effective_period_rate,
      initial_balance: resource.initial_balance,
      interest_paid: resource.interest_paid,
      installment_base: resource.installment_base,
      capital_amortization: resource.capital_amortization,
      life_insurance: resource.life_insurance,
      risk_insurance: resource.risk_insurance,
      commission: resource.commission,
      charges: resource.charges,
      admin_expense: resource.admin_expense,
      total_payment: resource.total_payment,
      remaining_balance: resource.remaining_balance,
      cash_flow: resource.cash_flow,
    });
  }

  /**
   * Converts a Payment entity to a PaymentResource.
   * @param entity - The Payment entity to convert.
   * @returns The corresponding PaymentResource.
   */
  toResourceFromEntity(entity: Payment): PaymentResource {
    return {
      id: entity.id,
      report_id: entity.report_id,
      period: entity.period,
      grace_type: entity.grace_type,
      annual_rate: entity.annual_rate,
      effective_period_rate: entity.effective_period_rate,
      initial_balance: entity.initial_balance,
      interest_paid: entity.interest_paid,
      installment_base: entity.installment_base,
      capital_amortization: entity.capital_amortization,
      life_insurance: entity.life_insurance,
      risk_insurance: entity.risk_insurance,
      commission: entity.commission,
      charges: entity.charges,
      admin_expense: entity.admin_expense,
      total_payment: entity.total_payment,
      remaining_balance: entity.remaining_balance,
      cash_flow: entity.cash_flow,

    } as PaymentResource;
  }

}
