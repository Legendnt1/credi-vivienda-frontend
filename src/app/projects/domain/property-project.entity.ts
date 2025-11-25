import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Property Project entity in the projects bounded context.
 */
export class PropertyProject implements BaseEntity {
  /**
   * The unique identifier of the property project.
   */
  _id: number;
  /**
   * The code of the property.
   */
  _property_code: string;
  /**
   * The name of the project.
   */
  _project: string;
  /**
   * The type of the property.
   */
  _type: string;
  /**
   * The area of the property.
   */
  _area: string;
  /**
   * The price of the property.
   */
  _price: number;
  /**
   * The availability status of the property.
   */
  _availability: number;
  /**
   * The status of the property project.
   */
  _status: string;

  /**
   * Creates a new PropertyProject instance.
   * @param project - An object containing property project properties.
   */
  constructor(project: { id: number; property_code: string; project: string; type: string; area: string;
    price: number; availability: number; status: string; }) {
    this._id = project.id;
    this._property_code = project.property_code;
    this._project = project.project;
    this._type = project.type;
    this._area = project.area;
    this._price = project.price;
    this._availability = project.availability;
    this._status = project.status;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get property_code(): string { return this._property_code; }
  set property_code(value: string) { this._property_code = value; }
  get project(): string { return this._project; }
  set project(value: string) { this._project = value; }
  get type(): string { return this._type; }
  set type(value: string) { this._type = value; }
  get area(): string { return this._area; }
  set area(value: string) { this._area = value; }
  get price(): number { return this._price; }
  set price(value: number) { this._price = value; }
  get availability(): number { return this._availability; }
  set availability(value: number) { this._availability = value; }
  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }
}
