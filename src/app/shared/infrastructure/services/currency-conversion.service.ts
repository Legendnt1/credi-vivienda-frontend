import { Injectable, inject } from '@angular/core';
import { IamStore } from '@iam/application/iam-store';

/**
 * Service to handle currency conversions between PEN and USD.
 * Uses the exchange rate from user settings.
 */
@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {
  private readonly iamStore = inject(IamStore);

  /**
   * Currency catalog IDs
   */
  readonly CURRENCY_PEN_ID = 1;
  readonly CURRENCY_USD_ID = 2;

  /**
   * Get the current exchange rate from user settings.
   * Falls back to 3.75 if not configured.
   */
  private getExchangeRateFromSettings(): number {
    const settings = this.iamStore.getCurrentUserSetting()();
    return settings?.default_change_usd_pen ?? 3.75;
  }

  /**
   * Convert amount from one currency to another.
   * @param amount - The amount to convert
   * @param fromCurrencyId - Source currency catalog ID (1=PEN, 2=USD)
   * @param toCurrencyId - Target currency catalog ID (1=PEN, 2=USD)
   * @returns Converted amount
   */
  convert(amount: number, fromCurrencyId: number, toCurrencyId: number): number {
    // If same currency, no conversion needed
    if (fromCurrencyId === toCurrencyId) {
      return amount;
    }

    const exchangeRate = this.getExchangeRateFromSettings();

    // Convert from USD to PEN
    if (fromCurrencyId === this.CURRENCY_USD_ID && toCurrencyId === this.CURRENCY_PEN_ID) {
      return amount * exchangeRate;
    }
    // Convert from PEN to USD
    if (fromCurrencyId === this.CURRENCY_PEN_ID && toCurrencyId === this.CURRENCY_USD_ID) {
      return amount / exchangeRate;
    }
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
   * Get the current exchange rate from user settings.
   * @returns Current exchange rate
   */
  getExchangeRate(): number {
    return this.getExchangeRateFromSettings();
  }
}

