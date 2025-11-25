import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {User} from '@iam/domain/model/user.entity';
import {UserResource, UserResponse} from '@iam/infrastructure/user-response';
import {UserAssembler} from '@iam/infrastructure/user-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing users.
 */
export class UsersApiEndpoint extends BaseApiEndpoint<User, UserResource, UserResponse, UserAssembler> {
  /**
   * Creates an instance of UsersApiEndpoint.
   * @param http - The HTTP client to be used for API calls.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderUsersEndpointPath}`,
      new UserAssembler(), { usePathParams: environment.usePathParams });
  }
}
