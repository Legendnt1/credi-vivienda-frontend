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
      period: resource.period,
      payment_date: resource.payment_date,
      payment_amount: resource.payment_amount,
      capital_amortization: resource.capital_amortization,
      interest_paid: resource.interest_paid,
      effective_rate_period: resource.effective_rate_period,
      grace_type: resource.grace_type,
      remaining_balance: resource.remaining_balance,
      credit_id: resource.credit_id
    })
  }

  /**
   * Converts a Payment entity to a PaymentResource.
   * @param entity - The Payment entity to convert.
   * @returns The corresponding PaymentResource.
   */
  toResourceFromEntity(entity: Payment): PaymentResource {
    return {
      id: entity.id,
      period: entity.period,
      payment_date: entity.payment_date,
      payment_amount: entity.payment_amount,
      capital_amortization: entity.capital_amortization,
      interest_paid: entity.interest_paid,
      effective_rate_period: entity.effective_rate_period,
      grace_type: entity.grace_type,
      remaining_balance: entity.remaining_balance,
      credit_id:  entity.credit_id
    } as PaymentResource;
  }

}
