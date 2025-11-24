import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response interface for Currency Catalog API responses.
 */
export interface CurrencyCatalogResponse extends BaseResponse {
  /**
   * The list of currency catalogs.
   */
  currencyCatalogs: CurrencyCatalogResource[];
}

/**
 * Resource interface representing a Currency Catalog.
 */
export interface CurrencyCatalogResource extends BaseResource {
  /**
   * The unique identifier of the currency catalog.
   */
  id: number;
  /**
   * The currency type.
   */
  currency: string;
  /**
   * The type of interest rate.
   */
  type_interest_rate: string;
  /**
   * The capitalization method.
   */
  capitalization: string;
}
