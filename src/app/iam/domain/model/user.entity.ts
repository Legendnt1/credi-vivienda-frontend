import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a user in the system.
 */
export class User implements BaseEntity {
  /**
   * Unique identifier of the user.
   */
  _id: number;
  /**
   * Username of the user.
   */
  _username: string;

  /**
   * Password of the user.
   */
  _password: string;

  /**
   * Indicates if the user is enabled.
   */
  _enabled: boolean;

  /**
   * Email of the user.
   */
  _email: string;

  /**
   * Address of the user.
   */
  _address: string;

  /**
   * Registration date of the user.
   */
  _registration_date: string;

  /**
   * Name of the user.
   */
  _name: string;

  /**
   * Last name of the user.
   */
  _last_name: string;

  /**
   * DNI of the user.
   */
  _dni: string;

  /**
   * Income of the user.
   */
  _income: number;

  /**
   * Savings of the user.
   */
  _savings: number;

  /**
   * Indicates if the user has a bond.
   */
  _has_bond: boolean;

  /**
   * Role ID of the user.
   */
  _role_id: number;


  /**
   * Constructor of the User class.
   * @param user - Object containing the properties of the user.
   */
  constructor(user: { id: number, username: string, password: string, enabled: boolean,
    email: string, address: string, registration_date: string, name: string, last_name: string,
    dni: string, income: number, savings: number, has_bond: boolean, role_id: number }) {
    this._id = user.id;
    this._username = user.username;
    this._password = user.password;
    this._enabled = user.enabled;
    this._email = user.email;
    this._address = user.address;
    this._registration_date = user.registration_date;
    this._name = user.name;
    this._last_name = user.last_name;
    this._dni = user.dni;
    this._income = user.income;
    this._savings = user.savings;
    this._has_bond = user.has_bond;
    this._role_id = user.role_id;
  }

  /** Getters and Setters */
  get id(): number { return this._id };
  set id(value: number) { this._id = value };
  get username(): string { return this._username };
  set username(value: string) { this._username = value };
  get password(): string { return this._password };
  set password(value: string) { this._password = value };
  get enabled(): boolean { return this._enabled };
  set enabled(value: boolean) { this._enabled = value };
  get email(): string { return this._email };
  set email(value: string) { this._email = value };
  get address(): string { return this._address };
  set address(value: string) { this._address = value };
  get registration_date(): string { return this._registration_date };
  set registration_date(value: string) { this._registration_date = value };
  get name(): string { return this._name };
  set name(value: string) { this._name = value };
  get last_name(): string { return this._last_name };
  set last_name(value: string) { this._last_name = value };
  get dni(): string { return this._dni };
  set dni(value: string) { this._dni = value };
  get income(): number { return this._income };
  set income(value: number) { this._income = value };
  get savings(): number { return this._savings };
  set savings(value: number) { this._savings = value };
  get has_bond(): boolean { return this._has_bond };
  set has_bond(value: boolean) { this._has_bond = value };
  get role_id(): number { return this._role_id };
  set role_id(value: number) { this._role_id = value };

}
