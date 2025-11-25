import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Role} from '@iam/domain/model/role.entity';
import {RoleResource, RoleResponse} from '@iam/infrastructure/role-response';
import {RoleAssembler} from '@iam/infrastructure/role-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing roles.
 */
export class RolesApiEndpoint extends BaseApiEndpoint<Role, RoleResource, RoleResponse, RoleAssembler> {
  /**
   * Constructor for RolesApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http,`${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderRolesEndpointPath}`,
      new RoleAssembler(), { usePathParams: false });
  }
}
