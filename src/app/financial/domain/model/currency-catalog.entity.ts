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
   * The type of interest rate.
   */
  _type_interest_rate: string;
  /**
   * The capitalization method.
   */
  _capitalization: string;

  /**
   * Creates a new CurrencyCatalog instance.
   * @param currencyCatalog - An object containing currency catalog properties.
   */
  constructor(currencyCatalog: {id: number; currency: string; type_interest_rate: string; capitalization: string}) {
    this._id = currencyCatalog.id;
    this._currency = currencyCatalog.currency;
    this._type_interest_rate = currencyCatalog.type_interest_rate;
    this._capitalization = currencyCatalog.capitalization;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get currency(): string { return this._currency; }
  set currency(value: string) { this._currency = value; }
  get type_interest_rate(): string { return this._type_interest_rate; }
  set type_interest_rate(value: string) { this._type_interest_rate = value; }
  get capitalization(): string { return this._capitalization; }
  set capitalization(value: string) { this._capitalization = value; }
}
