import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Estructura de la respuesta que contiene una lista de usuarios.
 */
export interface UserResponse extends BaseResponse {
  /**
   * Lista de usuarios.
   */
  users: UserResource[];
}

/**
 * Estructura del recurso que representa a un usuario.
 */
export interface UserResource extends BaseResource {
  /**
   * Identificador único del usuario.
   */
  id: number;
  /**
   * Nombre de usuario.
   */
  username: string;
  /**
   * Contraseña del usuario.
   */
  password: string;
  /**
   * Indica si el usuario está habilitado.
   */
  enable: boolean;
  /**
   * Correo electrónico del usuario.
   */
  email: string;
  /**
   * Dirección del usuario.
   */
  direccion: string;
  /**
   * Fecha de registro del usuario.
   */
  fecha_registro: string;
  /**
   * Nombre real de usuario.
   */
  nombre: string;
  /**
   * Apellido del usuario.
   */
  apellido: string;
  /**
   * Dni del usuario.
   */
  dni: string;
  /**
   * Ingresos del usuario.
   */
  ingreso: number;
  /**
   * Ahorros del usuario.
   */
  ahorro: number;
  /**
   * Indica si el usuario tiene el bono vivienda.
   */
  vivienda: boolean;
  /**
   * Indica el rol del usuario.
   */
  rol_id: number;
}
