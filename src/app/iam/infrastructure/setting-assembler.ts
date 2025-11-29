import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Setting} from '@iam/domain/model/setting.entity';
import {SettingResource, SettingResponse} from '@iam/infrastructure/setting-response';

/**
 * Assembler class for converting between Setting entities and resources.
 */
export class SettingAssembler implements BaseAssembler<Setting, SettingResource, SettingResponse> {
  /**
   * Converts a SettingResponse to an array of Setting entities.
   * @param response - The SettingResponse to convert.
   * @returns An array of Setting entities.
   */
  toEntitiesFromResponse(response: SettingResponse): Setting[] {
    return response.settings.map(resource => this.toEntityFromResource(resource as SettingResource));
  }

  /**
   * Converts a SettingResource to a Setting entity.
   * @param resource - The SettingResource to convert.
   * @returns A Setting entity.
   */
  toEntityFromResource(resource: SettingResource): Setting {
    return new Setting({
      id: resource.id,
      user_id: resource.user_id,
      default_currency_catalog_id: resource.default_currency_catalog_id,
      default_interest_type: resource.default_interest_type,
      default_grace_period: resource.default_grace_period,
      default_opportunity_tea: resource.default_opportunity_tea,
      default_days_in_year: resource.default_days_in_year,
      default_change_usd_pen: resource.default_change_usd_pen,
    });
  }

  /**
   * Converts a Setting entity to a SettingResource.
   * @param entity - The Setting entity to convert.
   */
  toResourceFromEntity(entity: Setting): SettingResource {
    return {
      id: entity.id,
      user_id: entity.user_id,
      default_currency_catalog_id: entity.default_currency_catalog_id,
      default_interest_type: entity.default_interest_type,
      default_grace_period: entity.default_grace_period,
      default_opportunity_tea: entity.default_opportunity_tea,
      default_days_in_year: entity.default_days_in_year,
      default_change_usd_pen: entity.default_change_usd_pen,
    } as SettingResource;
  }

}
