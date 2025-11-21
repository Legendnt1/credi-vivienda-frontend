import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Role entity in the system.
 */
export class Role implements BaseEntity {
  /**
   * Unique identifier of the role.
   */
  _id: number;
  /**
   * Name of the role.
   */
  _role: string;

  /**
   * Creates an instance of Role.
   * @param rol - An object containing the role's id and name.
   */
  constructor(rol: { id: number, role: string }) {
    this._id = rol.id;
    this._role = rol.role;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get rol(): string { return this._role; }
  set rol(value: string) { this._role = value; }
}
