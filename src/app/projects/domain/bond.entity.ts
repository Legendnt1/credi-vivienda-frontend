import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Bond entity in the projects bounded context.
 */
export class Bond implements BaseEntity {
  /**
   * The unique identifier of the bond.
   */
  _id: number;
  /**
   * The name of the bond.
   */
  _name: string;
  /**
   * The total bond amount.
   */
  _total_bond: number;

  /**
   * Creates a new Bond instance.
   * @param bond - An object containing bond properties.
   */
  constructor(bond: {id: number; name: string; total_bond: number}) {
    this._id = bond.id;
    this._name = bond.name;
    this._total_bond = bond.total_bond;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }
  get total_bond(): number { return this._total_bond; }
  set total_bond(value: number) { this._total_bond = value; }
}
