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
  _area: number;
  /**
   * The price of the property.
   */
  _price: number;
  /**
   * The currency catalog ID for the property's price.
   */
  _currency_catalog_id: number;
  /**
   * The availability status of the property.
   */
  _availability: number;
  /**
   * The status of the property project.
   */
  _status: string;
  /**
   * The address of the property.
   */
  _address: string;
  /**
   * The district where the property is located.
   */
  _district: string;
  /**
   * The province where the property is located.
   */
  _province: string;

  /**
   * Creates a new PropertyProject instance.
   * @param project - An object containing property project properties.
   */
  constructor(project: { id: number; property_code: string; project: string; type: string; area: number;
    price: number; currency_catalog_id: number; availability: number; status: string; address: string; district: string; province: string }) {
    this._id = project.id;
    this._property_code = project.property_code;
    this._project = project.project;
    this._type = project.type;
    this._area = project.area;
    this._price = project.price;
    this._currency_catalog_id = project.currency_catalog_id;
    this._availability = project.availability;
    this._status = project.status;
    this._address = project.address;
    this._district = project.district;
    this._province = project.province;
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
  get area(): number { return this._area; }
  set area(value: number) { this._area = value; }
  get price(): number { return this._price; }
  set price(value: number) { this._price = value; }
  get currency_catalog_id(): number { return this._currency_catalog_id; }
  set currency_catalog_id(value: number) { this._currency_catalog_id = value; }
  get availability(): number { return this._availability; }
  set availability(value: number) { this._availability = value; }
  get status(): string { return this._status; }
  set status(value: string) { this._status = value; }
  get address(): string { return this._address; }
  set address(value: string) { this._address = value; }
  get district(): string { return this._district; }
  set district(value: string) { this._district = value; }
  get province(): string { return this._province; }
  set province(value: string) { this._province = value; }
}
