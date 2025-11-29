import {computed, Injectable, Signal, signal} from '@angular/core';
import {CurrencyCatalog} from '@financial/domain/model/currency-catalog.entity';
import {Credit} from '@financial/domain/model/credit.entity';
import {Payment} from '@financial/domain/model/payment.entity';
import {FinancialApi} from '@financial/infrastructure/financial-api';
import {retry} from 'rxjs';
import {Report} from '@financial/domain/model/report.entity';

/**
 * Financial Store to manage state related to financial entities.
 */
@Injectable({
  providedIn: 'root'
})
export class FinancialStore {
  /**
   * Currency Catalogs signal.
   * @private
   */
  private readonly currencyCatalogsSignal = signal<CurrencyCatalog[]>([]);
  /**
   * Currency Catalogs readonly signal.
   */
  readonly currencyCatalogs = this.currencyCatalogsSignal.asReadonly();
  /**
   * Credits signal.
   * @private
   */
  private readonly creditsSignal = signal<Credit[]>([]);
  /**
   * Credits readonly signal.
   */
  readonly credits = this.creditsSignal.asReadonly();
  /**
   * Payments signal.
   * @private
   */
  private readonly paymentsSignal = signal<Payment[]>([]);
  /**
   * Payments readonly signal.
   */
  readonly payments = this.paymentsSignal.asReadonly();

  /**
   * Reports signal.
   * @private
   */
  private readonly reportsSignal = signal<Report[]>([]);

  /**
   * Reports readonly signal.
   */
  readonly reports = this.reportsSignal.asReadonly();

  /**
   * Loading signal.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Loading readonly signal.
   */
  readonly loading = this.loadingSignal.asReadonly();
  /**
   * Error signal.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Error readonly signal.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Currency Catalog count signal.
   */
  readonly currencyCatalogCount = signal(() => this.currencyCatalogsSignal().length);
  /**
   * Credit count signal.
   */
  readonly creditCount = signal(() => this.creditsSignal().length);
  /**
   * Payment count signal.
   */
  readonly paymentCount = signal(() => this.paymentsSignal().length);

  /**
   * Report count signal.
   */
  readonly reportCount = signal(() => this.reportsSignal().length);

  /**
   * Constructor to initialize the Financial Store with Financial API.
   * @param financialApi - The Financial API service.
   */
  constructor(private financialApi: FinancialApi) {
    this.loadCurrencyCatalogs();
    this.loadCredits();
    this.loadPayments();
    this.loadReports();
  }

  /**
   * Get Currency Catalog by ID.
   * @param id - The ID of the Currency Catalog.
   * @returns A signal of the Currency Catalog or undefined.
   */
  getCurrencyCatalogById(id: number | null | undefined): Signal<CurrencyCatalog | undefined> {
    return computed(() => id ? this.currencyCatalogs().find(cc => cc.id === id) : undefined);
  }

  /**
   * Get Credit by ID.
   * @param id - The ID of the Credit.
   * @returns A signal of the Credit or undefined.
   */
  getCreditById(id: number | null | undefined): Signal<Credit | undefined> {
    return computed(() => id ? this.credits().find(c => c.id === id) : undefined);
  }

  /**
   * Get Payment by ID.
   * @param id - The ID of the Payment.
   * @returns A signal of the Payment or undefined.
   */
  getPaymentById(id: number | null | undefined): Signal<Payment | undefined> {
    return computed(() => id ? this.payments().find(p => p.id === id) : undefined);
  }

  /**
   * Get Report by ID.
   * @param id - The ID of the Report.
   * @returns A signal of the Report or undefined.
   */
  getReportById(id: number | null | undefined): Signal<Report | undefined> {
    return computed(() => id ? this.reports().find(r => r.id === id) : undefined);
  }

  /**
   * Add a new Currency Catalog.
   * @param currencyCatalog - The Currency Catalog to add.
   */
  addCurrencyCatalog(currencyCatalog: CurrencyCatalog): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.createCurrencyCatalog(currencyCatalog).pipe(retry(2)).subscribe({
      next: (createdCurrencyCatalog) => {
        this.currencyCatalogsSignal.set([...this.currencyCatalogs(), createdCurrencyCatalog]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at creating currency catalog'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Update an existing Currency Catalog.
   * @param updatedCurrencyCatalog - The Currency Catalog to update.
   */
  updateCurrencyCatalog(updatedCurrencyCatalog: CurrencyCatalog): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.updateCurrencyCatalog(updatedCurrencyCatalog).pipe(retry(2)).subscribe({
      next: currencyCatalog => {
        this.currencyCatalogsSignal.update(currencyCatalogs =>
          currencyCatalogs.map(cc => cc.id === currencyCatalog.id ? currencyCatalog : cc))
          this.loadingSignal.set(false);
        },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error at updating currency catalog'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Delete a Currency Catalog by ID.
   * @param id - The ID of the Currency Catalog to delete.
   */
  deleteCurrencyCatalog(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.deleteCurrencyCatalog(id).pipe(retry(2)).subscribe({
      next: () => {
        this.currencyCatalogsSignal.update(currencyCatalogs =>
          currencyCatalogs.filter(cc => cc.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error at deleting currency catalog'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Add a new Credit.
   * @param credit - The Credit to add.
   */
  addCredit(credit: Credit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.createCredit(credit).pipe(retry(2)).subscribe({
      next: (createdCredit) => {
        this.creditsSignal.set([...this.credits(), createdCredit]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at creating credit'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Update an existing Credit.
   * @param updatedCredit - The Credit to update.
   */
  updateCredit(updatedCredit: Credit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.updateCredit(updatedCredit).pipe(retry(2)).subscribe({
      next: credit => {
        this.creditsSignal.update(credits =>
          credits.map(c => c.id === credit.id ? credit : c))
          this.loadingSignal.set(false);
        },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error at updating credit'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Delete a Credit by ID.
   * @param id - The ID of the Credit to delete.
   */
  deleteCredit(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.deleteCredit(id).pipe(retry(2)).subscribe({
      next: () => {
        this.creditsSignal.update(credits =>
          credits.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error at deleting credit'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Add a new Payment.
   * @param payment - The Payment to add.
   */
  addPayment(payment: Payment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.createPayment(payment).pipe(retry(2)).subscribe({
      next: (createdPayment) => {
        this.paymentsSignal.set([...this.payments(), createdPayment]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at creating payment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Update an existing Payment.
   * @param updatedPayment - The Payment to update.
   */
  updatePayment(updatedPayment: Payment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.updatePayment(updatedPayment).pipe(retry(2)).subscribe({
      next: payment => {
        this.paymentsSignal.update(payments =>
          payments.map(p => p.id === payment.id ? payment : p))
          this.loadingSignal.set(false);
        },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error at updating payment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Delete a Payment by ID.
   * @param id - The ID of the Payment to delete.
   */
  deletePayment(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.deletePayment(id).pipe(retry(2)).subscribe({
      next: () => {
        this.paymentsSignal.update(payments =>
          payments.filter(p => p.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error at deleting payment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Add a new Report.
   * @param report - The Report to add.
   */
  addReport(report: Report): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.createReport(report).pipe(retry(2)).subscribe({
      next: (createdReport) => {
        this.reportsSignal.set([...this.reports(), createdReport]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at creating report'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Update an existing Report.
   * @param updatedReport - The Report to update.
   */
  updateReport(updatedReport: Report): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.updateReport(updatedReport).pipe(retry(2)).subscribe({
      next: report => {
        this.reportsSignal.update(reports =>
          reports.map(r => r.id === report.id ? report : r))
          this.loadingSignal.set(false);
        },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error at updating report'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Delete a Report by ID.
   * @param id - The ID of the Report to delete.
   */
  deleteReport(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.deleteReport(id).pipe(retry(2)).subscribe({
      next: () => {
        this.reportsSignal.update(reports =>
          reports.filter(r => r.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Error at deleting report'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Load Currency Catalogs from API.
   * @private
   */
  private loadCurrencyCatalogs(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.getCurrencyCatalogs().pipe(retry(2)).subscribe({
      next: (currencyCatalogs) => {
        console.log("Currency Catalogs loaded:", currencyCatalogs);
        this.currencyCatalogsSignal.set(currencyCatalogs);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at loading currency catalogs'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Load Credits from API.
   * @private
   */
  private loadCredits(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.getCredits().pipe(retry(2)).subscribe({
      next: (credits) => {
        console.log("Credits loaded:", credits);
        this.creditsSignal.set(credits);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at loading credits'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Load Payments from API.
   * @private
   */
  private loadPayments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.getPayments().pipe(retry(2)).subscribe({
      next: (payments) => {
        console.log("Payments loaded:", payments);
        this.paymentsSignal.set(payments);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at loading payments'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Load Reports from API.
   * @private
   */
  private loadReports(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.financialApi.getReports().pipe(retry(2)).subscribe({
      next: (reports) => {
        console.log("Reports loaded:", reports);
        this.reportsSignal.set(reports);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at loading reports'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Format error messages.
   * @param error - The error object.
   * @param fallback - The fallback message.
   * @returns The formatted error message.
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Recurso no econtrado') ? `${fallback}: No econtrado` : error.message;
    }
    return fallback;
  }
}
