import {Injectable} from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {UsersApiEndpoint} from '@iam/infrastructure/users-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '@iam/domain/model/user.entity';

/**
 * IAM API servicio que proporciona métodos para interactuar con el backend de IAM.
 * Utiliza varios puntos finales de API para realizar operaciones CRUD en usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class IamApi extends BaseApi {
  /**
   * API endpoint para operaciones relacionadas con usuarios.
   * @private
   */
  private readonly usersEndpoint: UsersApiEndpoint;

  /**
   * Constructor para inicializar el servicio IAM API con los puntos finales necesarios.
   * @param http - La instancia de HttpClient para realizar solicitudes HTTP.
   */
  constructor(http: HttpClient) {
    super();
    this.usersEndpoint = new UsersApiEndpoint(http);
  }

  /**
   * Obtiene todos los usuarios del backend.
   * @returns Un Observable que emite una matriz de entidades User.
   */
  getUsers(): Observable<User[]> {
    return this.usersEndpoint.getAll();
  }

  /**
   * Obtiene un usuario por ID.
   * @param id - El ID del usuario a obtener.
   */
  getUser(id: number): Observable<User> {
    return this.usersEndpoint.getById(id);
  }

  /**
   * Crea un nuevo usuario.
   * @param user - La entidad User a crear.
   */
  createUser(user: User): Observable<User> {
    return this.usersEndpoint.create(user);
  }

  /**
   * Actualiza un usuario existente.
   * @param user - La entidad User a actualizar.
   */
  updateUser(user: User): Observable<User> {
    return this.usersEndpoint.update(user, user.id);
  }

  /**
   * Elimina un usuario por ID.
   * @param id - El ID del usuario a eliminar.
   */
  deleteUser(id: number): Observable<void> {
    return this.usersEndpoint.delete(id);
  }
}
