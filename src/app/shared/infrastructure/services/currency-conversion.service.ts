import { Injectable } from '@angular/core';

/**
 * Service to handle currency conversions between PEN and USD.
 * Uses a fixed exchange rate for development purposes.
 */
@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {
  /**
   * Exchange rate: 1 USD = 3.75 PEN (configurable for development)
   */
  private readonly EXCHANGE_RATE = 3.75;

  /**
   * Currency catalog IDs
   */
  readonly CURRENCY_PEN_ID = 1;
  readonly CURRENCY_USD_ID = 2;

  /**
   * Convert amount from one currency to another.
   * @param amount - The amount to convert
   * @param fromCurrencyId - Source currency catalog ID (1=PEN, 2=USD)
   * @param toCurrencyId - Target currency catalog ID (1=PEN, 2=USD)
   * @returns Converted amount
   */
  convert(amount: number, fromCurrencyId: number, toCurrencyId: number): number {
    console.log(`Converting: ${amount} from currency ${fromCurrencyId} to currency ${toCurrencyId}`);

    // If same currency, no conversion needed
    if (fromCurrencyId === toCurrencyId) {
      console.log('  → Same currency, no conversion needed');
      return amount;
    }

    // Convert from USD to PEN
    if (fromCurrencyId === this.CURRENCY_USD_ID && toCurrencyId === this.CURRENCY_PEN_ID) {
      const result = amount * this.EXCHANGE_RATE;
      console.log(`  → USD to PEN: ${amount} * ${this.EXCHANGE_RATE} = ${result}`);
      return result;
    }

    // Convert from PEN to USD
    if (fromCurrencyId === this.CURRENCY_PEN_ID && toCurrencyId === this.CURRENCY_USD_ID) {
      const result = amount / this.EXCHANGE_RATE;
      console.log(`  → PEN to USD: ${amount} / ${this.EXCHANGE_RATE} = ${result}`);
      return result;
    }

    // Default: return original amount
    console.log('  → No conversion rule matched, returning original amount');
    return amount;
  }

  /**
   * Format amount with currency symbol.
   * @param amount - The amount to format
   * @param currencyId - Currency catalog ID (1=PEN, 2=USD)
   * @returns Formatted string with currency symbol
   */
  formatAmount(amount: number, currencyId: number): string {
    const symbol = this.getCurrencySymbol(currencyId);
    return `${symbol} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  /**
   * Get currency symbol by ID.
   * @param currencyId - Currency catalog ID
   * @returns Currency symbol (S/ or $)
   */
  getCurrencySymbol(currencyId: number): string {
    return currencyId === this.CURRENCY_PEN_ID ? 'S/' : '$';
  }

  /**
   * Get currency code by ID.
   * @param currencyId - Currency catalog ID
   * @returns Currency code (PEN or USD)
   */
  getCurrencyCode(currencyId: number): string {
    return currencyId === this.CURRENCY_PEN_ID ? 'PEN' : 'USD';
  }

  /**
   * Get the exchange rate.
   * @returns Current exchange rate
   */
  getExchangeRate(): number {
    return this.EXCHANGE_RATE;
  }
}

