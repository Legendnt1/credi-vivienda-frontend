import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Payment} from '@financial/domain/model/payment.entity';
import {PaymentResource, PaymentResponse} from '@financial/infrastructure/payment-response';
import {PaymentAssembler} from '@financial/infrastructure/payment-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing Payment entities.
 */
export class PaymentsApiEndpoint extends BaseApiEndpoint<Payment, PaymentResource, PaymentResponse, PaymentAssembler> {
  /**
   * Creates a new PaymentsApiEndpoint instance.
   * @param http - The HttpClient to use for API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderPaymentsEndpointPath}`,
      new PaymentAssembler(), { usePathParams: environment.usePathParams });
  }
}
