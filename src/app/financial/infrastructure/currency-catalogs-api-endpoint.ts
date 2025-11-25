import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {CurrencyCatalog} from '@financial/domain/model/currency-catalog.entity';
import {CurrencyCatalogResource, CurrencyCatalogResponse} from '@financial/infrastructure/currency-catalog-response';
import {CurrencyCatalogAssembler} from '@financial/infrastructure/currency-catalog-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing currency catalogs.
 */
export class CurrencyCatalogsApiEndpoint extends BaseApiEndpoint<CurrencyCatalog, CurrencyCatalogResource, CurrencyCatalogResponse, CurrencyCatalogAssembler> {
  /**
   * Creates an instance of CurrencyCatalogsApiEndpoint.
   * @param http - The HTTP client to be used for API calls.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderCurrencyCatalogsEndpointPath}`,
      new CurrencyCatalogAssembler(), { usePathParams: environment.usePathParams });
  }
}
