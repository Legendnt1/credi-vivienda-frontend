import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Currency Catalog entity in the financial bounded context.
 */
export class CurrencyCatalog implements BaseEntity {
  /**
   * The unique identifier of the currency catalog.
   */
  _id: number;
  /**
   * The currency type.
   */
  _currency: string;

  /**
   * Creates a new CurrencyCatalog instance.
   * @param currencyCatalog - An object containing currency catalog properties.
   */
  constructor(currencyCatalog: {id: number; currency: string;}) {
    this._id = currencyCatalog.id;
    this._currency = currencyCatalog.currency;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get currency(): string { return this._currency; }
  set currency(value: string) { this._currency = value; }
}
