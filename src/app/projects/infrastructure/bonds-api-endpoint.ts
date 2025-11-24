import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Bond} from '@projects/domain/bond.entity';
import {BondResource, BondResponse} from '@projects/infrastructure/bond-response';
import {BondAssembler} from '@projects/infrastructure/bond-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing bonds.
 */
export class BondsApiEndpoint extends BaseApiEndpoint<Bond, BondResource, BondResponse, BondAssembler> {
  /**
   * Creates an instance of BondsApiEndpoint.
   * @param http - The HTTP client to be used for API calls.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderBondsEndpointPath}`,
      new BondAssembler(), { usePathParams: environment.usePathParams });
  }
}
