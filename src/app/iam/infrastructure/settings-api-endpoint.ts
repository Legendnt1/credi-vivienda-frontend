import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Setting} from '@iam/domain/model/setting.entity';
import {SettingResource, SettingResponse} from '@iam/infrastructure/setting-response';
import {SettingAssembler} from '@iam/infrastructure/setting-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing user settings.
 */
export class SettingsApiEndpoint extends BaseApiEndpoint<Setting, SettingResource, SettingResponse, SettingAssembler> {
  /**
   * Creates an instance of SettingsApiEndpoint.
   * @param http - The HTTP client to be used for API calls.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderSettingsEndpointPath}`,
      new SettingAssembler(), { usePathParams: environment.usePathParams });
  }
}
