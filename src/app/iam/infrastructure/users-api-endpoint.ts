import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {User} from '@iam/domain/model/user.entity';
import {UserResource, UserResponse} from '@iam/infrastructure/user-response';
import {UserAssembler} from '@iam/infrastructure/user-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * Api endpoint para manejar usuarios.
 */
export class UsersApiEndpoint extends BaseApiEndpoint<User, UserResource, UserResponse, UserAssembler> {
  /**
   * Constructor del UsersApiEndpoint.
   * @param http - El cliente HTTP.
   */
  constructor(http: HttpClient) {
    super(http, environment.crediViviendaProviderUsersEndpointPath, new UserAssembler(),
      { usePathParams: environment.usePathParams });
  }
}
