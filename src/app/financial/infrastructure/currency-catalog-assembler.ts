import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {CurrencyCatalog} from '@financial/domain/model/currency-catalog.entity';
import {CurrencyCatalogResource, CurrencyCatalogResponse} from '@financial/infrastructure/currency-catalog-response';

/**
 * Assembler for converting between CurrencyCatalog entities and their corresponding resources and responses.
 */
export class CurrencyCatalogAssembler implements BaseAssembler<CurrencyCatalog, CurrencyCatalogResource, CurrencyCatalogResponse>{
  /**
   * Converts a CurrencyCatalogResponse to an array of CurrencyCatalog entities.
   * @param response - The CurrencyCatalogResponse to convert.
   * @returns An array of CurrencyCatalog entities.
   */
  toEntitiesFromResponse(response: CurrencyCatalogResponse): CurrencyCatalog[] {
    return response.currencyCatalogs.map(resource => this.toEntityFromResource(resource as CurrencyCatalogResource));
  }

  /**
   * Converts a CurrencyCatalogResource to a CurrencyCatalog entity.
   * @param resource - The CurrencyCatalogResource to convert.
   * @returns A CurrencyCatalog entity.
   */
  toEntityFromResource(resource: CurrencyCatalogResource): CurrencyCatalog {
    return new CurrencyCatalog({
      id: resource.id,
      currency: resource.currency,
    });
  }

  /**
   * Converts a CurrencyCatalog entity to a CurrencyCatalogResource.
   * @param entity - The CurrencyCatalog entity to convert.
   * @returns A CurrencyCatalogResource.
   */
  toResourceFromEntity(entity: CurrencyCatalog): CurrencyCatalogResource {
    return {
      id: entity.id,
      currency: entity.currency,
    };
  }
}
