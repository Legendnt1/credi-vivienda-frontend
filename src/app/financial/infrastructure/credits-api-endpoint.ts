import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Credit} from '@financial/domain/model/credit.entity';
import {CreditResource, CreditResponse} from '@financial/infrastructure/credit-response';
import {CreditAssembler} from '@financial/infrastructure/credit-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

export class CreditsApiEndpoint extends BaseApiEndpoint<Credit, CreditResource, CreditResponse, CreditAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderCreditsEndpointPath}`,
      new CreditAssembler(), { usePathParams: environment.usePathParams });
  }
}
