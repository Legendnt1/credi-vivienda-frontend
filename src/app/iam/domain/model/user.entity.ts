import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Representa a un usuario en el sistema.
 */
export class User implements BaseEntity {
  /**
   * Identificador único del usuario.
   */
  _id: number;
  /**
   * Nombre de usuario.
   */
  _username: string;
  /**
   * Contraseña del usuario.
   */
  _password: string;
  /**
   * Indica si el usuario está habilitado.
   */
  _enable: boolean;
  /**
   * Correo electrónico del usuario.
   */
  _email: string;
  /**
   * Dirección del usuario.
   */
  _direccion: string;
  /**
   * Fecha de registro del usuario.
   */
  _fecha_registro: string;
  /**
   * Nombre real de usuario.
   */
  _nombre: string;
  /**
   * Apellido del usuario.
   */
  _apellido: string;
  /**
   * Dni del usuario.
   */
  _dni: string;
  /**
   * Ingresos del usuario.
   */
  _ingreso: number;
  /**
   * Ahorros del usuario.
   */
  _ahorro: number;
  /**
   * Indica si el usuario tiene el bono vivienda.
   */
  _vivienda: boolean;
  /**
   * Indica el rol del usuario.
   */
  _rol_id: number;


  /**
   * Constructor de la clase User.
   *
   * @param user Objeto con los datos del usuario.
   */
  constructor(user: { id: number, username: string, password: string, enable: boolean,
    email: string, direccion: string, fecha_registro: string, nombre: string, apellido: string,
    dni: string, ingreso: number, ahorro: number, vivienda: boolean, rol_id: number }) {
    this._id = user.id;
    this._username = user.username;
    this._password = user.password;
    this._enable = user.enable;
    this._email = user.email;
    this._direccion = user.direccion;
    this._fecha_registro = user.fecha_registro;
    this._nombre = user.nombre;
    this._apellido = user.apellido;
    this._dni = user.dni;
    this._ingreso = user.ingreso;
    this._ahorro = user.ahorro;
    this._vivienda = user.vivienda;
    this._rol_id = user.rol_id;
  }

  /** Getters y Setters */
  get id(): number { return this._id };
  set id(value: number) { this._id = value };
  get username(): string { return this._username };
  set username(value: string) { this._username = value };
  get password(): string { return this._password };
  set password(value: string) { this._password = value };
  get enable(): boolean { return this._enable };
  set enable(value: boolean) { this._enable = value };
  get email(): string { return this._email };
  set email(value: string) { this._email = value };
  get direccion(): string { return this._direccion };
  set direccion(value: string) { this._direccion = value }
  get fecha_registro(): string { return this._fecha_registro };
  set fecha_registro(value: string) { this._fecha_registro = value }
  get nombre(): string { return this._nombre };
  set nombre(value: string) { this._nombre = value }
  get apellido(): string { return this._apellido };
  set apellido(value: string) { this._apellido = value }
  get dni(): string { return this._dni };
  set dni(value: string) { this._dni = value }
  get ingreso(): number { return this._ingreso };
  set ingreso(value: number) { this._ingreso = value }
  get ahorro(): number { return this._ahorro };
  set ahorro(value: number) { this._ahorro = value }
  get vivienda(): boolean { return this._vivienda };
  set vivienda(value: boolean) { this._vivienda = value }
  get rol_id(): number { return this._rol_id };
  set rol_id(value: number) { this._rol_id = value };
}
