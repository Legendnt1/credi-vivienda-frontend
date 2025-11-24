import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {PropertyProject} from '@projects/domain/property-project.entity';
import {PropertyProjectResource, PropertyProjectResponse} from '@projects/infrastructure/property-project-response';
import {PropertyProjectAssembler} from '@projects/infrastructure/property-project-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing property projects.
 */
export class PropertyProjectsApiEndpoint extends BaseApiEndpoint<PropertyProject, PropertyProjectResource, PropertyProjectResponse, PropertyProjectAssembler> {
  /**
   * Creates an instance of PropertyProjectsApiEndpoint.
   * @param http - The HTTP client to be used for API calls.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderPropertiesProjectsEndpointPath}`,
      new PropertyProjectAssembler(), { usePathParams: environment.usePathParams });
  }
}
