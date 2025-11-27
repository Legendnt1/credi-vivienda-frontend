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
      payment_amount: resource.payment_amount,
      capital_amortization: resource.capital_amortization,
      remaining_balance: resource.remaining_balance,
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
      payment_amount: entity.payment_amount,
      capital_amortization: entity.capital_amortization,
      remaining_balance: entity.remaining_balance,
    } as PaymentResource;
  }

}
