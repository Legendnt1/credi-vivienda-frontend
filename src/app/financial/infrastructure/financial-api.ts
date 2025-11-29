import {Injectable} from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {CurrencyCatalogsApiEndpoint} from '@financial/infrastructure/currency-catalogs-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CurrencyCatalog} from '@financial/domain/model/currency-catalog.entity';
import {CreditsApiEndpoint} from '@financial/infrastructure/credits-api-endpoint';
import {PaymentsApiEndpoint} from '@financial/infrastructure/payments-api-endpoint';
import {Credit} from '@financial/domain/model/credit.entity';
import {Payment} from '@financial/domain/model/payment.entity';
import {ReportsApiEndpoint} from '@financial/infrastructure/reports-api-endpoint';
import {Report} from '@financial/domain/model/report.entity';

/**
 * Service to interact with the Financial API endpoints.
 */
@Injectable({
    providedIn: 'root'
})
export class FinancialApi extends BaseApi {
  /**
   * Currency Catalogs API endpoint.
   * @private
   */
  private readonly currencyCatalogsEndpoint: CurrencyCatalogsApiEndpoint;

  /**
   * Credits API endpoint.
   * @private
   */
  private readonly creditsEndpoint: CreditsApiEndpoint;

  /**
   * Payments API endpoint.
   * @private
   */
  private readonly paymentsEndpoint: PaymentsApiEndpoint;

  /**
   * Reports API endpoint.
   * @private
   */
  private readonly reportsEndpoint: ReportsApiEndpoint;

  /**
   * Constructor to initialize the Financial API service with HTTP client.
   * @param http - The HTTP client to make API requests.
   */
  constructor(http: HttpClient) {
    super();
    this.currencyCatalogsEndpoint = new CurrencyCatalogsApiEndpoint(http);
    this.creditsEndpoint = new CreditsApiEndpoint(http);
    this.paymentsEndpoint = new PaymentsApiEndpoint(http);
    this.reportsEndpoint = new ReportsApiEndpoint(http);
  }

  /**
   * Get all currency catalogs.
   * @returns An observable of an array of currency catalogs.
   */
  getCurrencyCatalogs(): Observable<CurrencyCatalog[]>{
    return this.currencyCatalogsEndpoint.getAll();
  }

  /**
   * Get a currency catalog by ID.
   * @param id - The ID of the currency catalog to retrieve.
   * @returns An observable of the currency catalog.
   */
  getCurrencyCatalog(id: number): Observable<CurrencyCatalog>{
    return this.currencyCatalogsEndpoint.getById(id);
  }

  /**
   * Create a new currency catalog.
   * @param currencyCatalog - The currency catalog data to create.
   * @returns An observable of the created currency catalog.
   */
  createCurrencyCatalog(currencyCatalog: CurrencyCatalog): Observable<CurrencyCatalog>{
    return this.currencyCatalogsEndpoint.create(currencyCatalog);
  }

  /**
   * Update an existing currency catalog.
   * @param currencyCatalog - The currency catalog data to update.
   * @returns An observable of the updated currency catalog.
   */
  updateCurrencyCatalog(currencyCatalog: CurrencyCatalog): Observable<CurrencyCatalog>{
    return this.currencyCatalogsEndpoint.update(currencyCatalog, currencyCatalog.id);
  }

  /**
   * Delete a currency catalog by ID.
   * @param id - The ID of the currency catalog to delete.
   * @returns An observable of void.
   */
  deleteCurrencyCatalog(id: number): Observable<void>{
    return this.currencyCatalogsEndpoint.delete(id);
  }

  /**
   * Get all credits.
   * @returns An observable of an array of credits.
   */
  getCredits(): Observable<Credit[]> {
    return this.creditsEndpoint.getAll();
  }

  /**
   * Get a credit by ID.
   * @param id - The ID of the credit to retrieve.
   * @returns An observable of the credit.
   */
  getCredit(id: number): Observable<Credit> {
    return this.creditsEndpoint.getById(id);
  }

  /**
   * Create a new credit.
   * @param credit - The credit data to create.
   * @returns An observable of the created credit.
   */
  createCredit(credit: Credit): Observable<Credit> {
    return this.creditsEndpoint.create(credit);
  }

  /**
   * Update an existing credit.
   * @param credit - The credit data to update.
   * @returns An observable of the updated credit.
   */
  updateCredit(credit: Credit): Observable<Credit> {
    return this.creditsEndpoint.update(credit, credit.id);
  }

  /**
   * Delete a credit by ID.
   * @param id - The ID of the credit to delete.
   * @returns An observable of void.
   */
  deleteCredit(id: number): Observable<void> {
    return this.creditsEndpoint.delete(id);
  }

  /**
   * Get all payments.
   * @returns An observable of an array of payments.
   */
  getPayments(): Observable<Payment[]> {
    return this.paymentsEndpoint.getAll();
  }

  /**
   * Get a payment by ID.
   * @param id - The ID of the payment to retrieve.
   * @returns An observable of the payment.
   */
  getPayment(id: number): Observable<Payment> {
    return this.paymentsEndpoint.getById(id);
  }

  /**
   * Create a new payment.
   * @param payment - The payment data to create.
   * @returns An observable of the created payment.
   */
  createPayment(payment: Payment): Observable<Payment> {
    return this.paymentsEndpoint.create(payment);
  }

  /**
   * Update an existing payment.
   * @param payment - The payment data to update.
   * @returns An observable of the updated payment.
   */
  updatePayment(payment: Payment): Observable<Payment> {
    return this.paymentsEndpoint.update(payment, payment.id);
  }

  /**
   * Delete a payment by ID.
   * @param id - The ID of the payment to delete.
   * @returns An observable of void.
   */
  deletePayment(id: number): Observable<void> {
    return this.paymentsEndpoint.delete(id);
  }

  /**
   * Get all reports.
   * @returns An observable of an array of reports.
   */
  getReports(): Observable<Report[]> {
    return this.reportsEndpoint.getAll();
  }

  /**
   * Get a report by ID.
   * @param id - The ID of the report to retrieve.
   * @returns An observable of the report.
   */
  getReport(id: number): Observable<Report> {
    return this.reportsEndpoint.getById(id);
  }

  /**
   * Create a new report.
   * @param report - The report data to create.
   * @returns An observable of the created report.
   */
  createReport(report: Report): Observable<Report> {
    return this.reportsEndpoint.create(report);
  }

  /**
   * Update an existing report.
   * @param report - The report data to update.
   * @returns An observable of the updated report.
   */
  updateReport(report: Report): Observable<Report> {
    return this.reportsEndpoint.update(report, report.id);
  }

  /**
   * Delete a report by ID.
   * @param id - The ID of the report to delete.
   * @returns An observable of void.
   */
  deleteReport(id: number): Observable<void> {
    return this.reportsEndpoint.delete(id);
  }
}
