import { Component, ChangeDetectionStrategy, signal, computed, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import {
  FrenchAmortizationService,
  FrenchInput,
  GraceType
} from '@financial/application/services/french-amortization.service';
import { IamStore } from '@iam/application/iam-store';
import { FinancialStore } from '@financial/application/financial-store';
import { ProjectsStore } from '@projects/application/projects-store';
import { CurrencyConversionService } from '@shared/infrastructure/services/currency-conversion.service';
import {Report} from '@financial/domain/model/report.entity';
import {Payment} from '@financial/domain/model/payment.entity';

interface EditableRow {
  period: number;
  tea: number;
  graceType: GraceType;
}

interface PaymentScheduleRow {
  month: number;
  installment: number;
  interest: number;
  amortization: number;
  balanceWithBond: number;
}

@Component({
  selector: 'app-calculations',
  imports: [ReactiveFormsModule, TranslateModule, DecimalPipe],
  templateUrl: './calculations.html',
  styleUrl: './calculations.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculations {
  private readonly fb = inject(FormBuilder);
  private readonly frenchService = inject(FrenchAmortizationService);
  private readonly iamStore = inject(IamStore);
  private readonly financialStore = inject(FinancialStore);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly currencyService = inject(CurrencyConversionService);

  // Stores signals
  readonly currentUser = this.iamStore.sessionUser;
  readonly userSettings = computed(() => {
    const userId = this.currentUser()?.id;
    if (!userId) return null;
    return this.iamStore.settings().find(s => s.user_id === userId);
  });
  readonly currencyCatalogs = this.financialStore.currencyCatalogs;
  readonly properties = this.projectsStore.propertyProjects;

  // State signals
  readonly editableRows = signal<EditableRow[]>([]);
  readonly paymentSchedule = signal<PaymentScheduleRow[]>([]);
  readonly selectedProperty = signal<number | null>(null);
  readonly isCalculated = signal(false);

  // Get exchange rate from service
  readonly exchangeRate = computed(() => this.currencyService.getExchangeRate());

  // Computed current currency ID
  readonly currentCurrencyId = computed(() => {
    const settings = this.userSettings();
    return settings?.default_currency_catalog_id ?? 1; // Default to PEN
  });

  // Computed current currency code
  readonly currentCurrency = computed(() => {
    const currencyId = this.currentCurrencyId();
    const catalog = this.currencyCatalogs().find(c => c.id === currencyId);
    return catalog?.currency || 'PEN';
  });

  // Properties with converted prices based on user's preferred currency
  readonly propertiesWithConvertedPrices = computed(() => {
    const props = this.properties();
    const userCurrencyId = this.currentCurrencyId();

    return props.map(property => {
      const displayPrice = this.currencyService.convert(
        property.price,
        property.currency_catalog_id,
        userCurrencyId
      );

      return {
        entity: property,
        displayPrice,
        displayCurrencyId: userCurrencyId,
        originalPrice: property.price,
        originalCurrencyId: property.currency_catalog_id
      };
    });
  });

  // Financial metrics
  readonly van = signal<number>(0);
  readonly tir = signal<number>(0);
  readonly cet = signal<number>(0);

  // Calculation form - will be initialized with user settings
  calculationForm!: FormGroup;

  constructor() {
    // Initialize form with default values
    this.initializeForm();

    // Update form when user settings change
    effect(() => {
      const settings = this.userSettings();
      if (settings && this.calculationForm) {
        this.updateFormWithSettings(settings);
      }
    });
  }

  /**
   * Initialize the calculation form
   */
  private initializeForm(): void {
    const settings = this.userSettings();

    this.calculationForm = this.fb.group({
      property_id: [null, Validators.required],
      loanAmount: [0, [Validators.required, Validators.min(0)]],
      downPayment: [0, [Validators.min(0)]],
      bondAmount: [0, [Validators.min(0)]],
      termMonths: [0, [Validators.required, Validators.min(1)]],
      baseRate: [0, [Validators.required, Validators.min(0)]],
      rateType: [settings?.default_interest_type || 'EFFECTIVE', Validators.required],
      frequency: ['MENSUAL', Validators.required]
    });
  }

  /**
   * Update form with user settings
   */
  private updateFormWithSettings(settings: any): void {
    // Only update if the current value is still the default
    const currentRateType = this.calculationForm.get('rateType')?.value;
    if (currentRateType === 'EFFECTIVE' || currentRateType === 'NOMINAL') {
      this.calculationForm.patchValue({
        rateType: settings.default_interest_type
      }, { emitEvent: false });
    }
  }

  /**
   * Generate editable table rows
   */
  onGenerateTable(): void {
    const termMonths = this.calculationForm.get('termMonths')?.value;
    const baseRate = this.calculationForm.get('baseRate')?.value;
    const rateType = this.calculationForm.get('rateType')?.value;
    const frequency = this.calculationForm.get('frequency')?.value;
    const settings = this.userSettings();

    console.log('=== GENERATE TABLE DEBUG ===');
    console.log('User Settings:', settings);
    console.log('Rate Type:', rateType);
    console.log('Default Interest Type:', settings?.default_interest_type);
    console.log('Default Grace Period:', settings?.default_grace_period);
    console.log('Current Currency:', this.currentCurrency());

    if (!termMonths || !baseRate || !settings) {
      console.warn('Missing required data for table generation');
      return;
    }

    // Calculate number of periods based on frequency
    const periodsPerYear = this.getPeriodsPerYear(frequency);
    const totalPeriods = Math.ceil((termMonths / 12) * periodsPerYear);

    // Convert to TEA if needed
    let tea = baseRate / 100; // Convert percentage to decimal
    if (rateType === 'NOMINAL') {
      // Convert nominal to effective: TEA = (1 + j/m)^m - 1
      tea = Math.pow(1 + tea / periodsPerYear, periodsPerYear) - 1;
      console.log(`Converted NOMINAL rate to TEA: ${baseRate}% → ${(tea * 100).toFixed(2)}%`);
    }

    // Determine grace periods based on term
    const gracePeriods = this.calculateGracePeriods(termMonths);
    const defaultGraceType = this.mapGracePeriodToType(settings.default_grace_period);

    console.log(`Grace Periods: ${gracePeriods} periods with type ${defaultGraceType}`);

    // Generate rows
    const rows: EditableRow[] = [];
    for (let i = 1; i <= totalPeriods; i++) {
      rows.push({
        period: i,
        tea: tea * 100, // Store as percentage for display
        graceType: i <= gracePeriods ? defaultGraceType : 'SIN_PLAZO'
      });
    }

    this.editableRows.set(rows);
    this.isCalculated.set(false);
    console.log(`Generated ${rows.length} rows for calculation`);
  }

  /**
   * Calculate payment schedule using FrenchAmortizationService
   */
  onCalculate(): void {
    if (!this.calculationForm.valid || this.editableRows().length === 0) return;

    const formValue = this.calculationForm.value;
    const rows = this.editableRows();
    const currency = this.currentCurrency();

    // Convert amounts to base currency (PEN)
    const loanAmount = this.convertToBaseCurrency(formValue.loanAmount, currency);
    const downPayment = this.convertToBaseCurrency(formValue.downPayment || 0, currency);
    const bondAmount = this.convertToBaseCurrency(formValue.bondAmount || 0, currency);

    // Build FrenchInput
    const input: FrenchInput = {
      price: loanAmount + downPayment,
      downPaymentAmount: downPayment,
      bondAmount: bondAmount,
      years: formValue.termMonths / 12,
      frequency: formValue.frequency,
      annualRates: rows.map(r => r.tea / 100), // Convert back to decimal
      graceByPeriod: rows.map(r => r.graceType),
      daysInYear: 360
    };

    // Calculate schedule
    const schedule = this.frenchService.calculateSchedule(input);

    // Convert to display currency and map to UI format
    const displaySchedule: PaymentScheduleRow[] = schedule.schedule.map(row => ({
      month: row.period,
      installment: this.convertFromBaseCurrency(row.installment, currency),
      interest: this.convertFromBaseCurrency(row.interest, currency),
      amortization: this.convertFromBaseCurrency(row.amortization, currency),
      balanceWithBond: this.convertFromBaseCurrency(row.finalBalance, currency)
    }));

    this.paymentSchedule.set(displaySchedule);

    // Calculate financial metrics
    this.calculateFinancialMetrics(schedule.schedule, loanAmount, currency);
    this.isCalculated.set(true);
  }

  /**
   * Save report to store
   */
  async onSaveReport(): Promise<void> {
    if (!this.isCalculated() || !this.currentUser()) return;

    const formValue = this.calculationForm.value;
    const rows = this.editableRows();
    const schedule = this.paymentSchedule();
    const settings = this.userSettings();
    const currency = this.currentCurrency();

    if (!settings) return;

    // Calculate totals
    const totalInstallments = schedule.reduce((sum, row) => sum + row.installment, 0);
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
    const totalAmortization = schedule.reduce((sum, row) => sum + row.amortization, 0);

    // Convert to base currency for storage
    const price = this.convertToBaseCurrency(formValue.loanAmount + formValue.downPayment, currency);
    const downPayment = this.convertToBaseCurrency(formValue.downPayment || 0, currency);
    const bondApplied = this.convertToBaseCurrency(formValue.bondAmount || 0, currency);

    // Create credit first (if needed)
    // For now, we'll use a placeholder credit_id = 1
    const creditId = 1;

    // Create report
    const report = new Report({
      id: 0,
      user_id: this.currentUser()!.id,
      credit_id: creditId,
      property_project_id: formValue.property_id,
      settings_id: settings.id,
      generated_at: new Date().toISOString(),
      price: price,
      down_payment: downPayment,
      bond_applied: bondApplied,
      years: formValue.termMonths / 12,
      frequency: formValue.frequency,
      base_tea: rows[0]?.tea || 0,
      total_installments_paid: this.convertToBaseCurrency(totalInstallments, currency),
      total_amortization: this.convertToBaseCurrency(totalAmortization, currency),
      total_interest: this.convertToBaseCurrency(totalInterest, currency),
      van: this.convertToBaseCurrency(this.van(), currency),
      tir: this.tir(),
      cet: this.cet()
    });

    this.financialStore.addReport(report); // Assume this returns the created report with ID

    // Create payments
    if (report) {
      const rawSchedule = this.frenchService.calculateSchedule({
        price: this.convertToBaseCurrency(formValue.loanAmount + formValue.downPayment, currency),
        downPaymentAmount: this.convertToBaseCurrency(formValue.downPayment || 0, currency),
        bondAmount: this.convertToBaseCurrency(formValue.bondAmount || 0, currency),
        years: formValue.termMonths / 12,
        frequency: formValue.frequency,
        annualRates: rows.map(r => r.tea / 100),
        graceByPeriod: rows.map(r => r.graceType),
        daysInYear: 360
      });

      for (const row of rawSchedule.schedule) {
        const newPayment = new Payment({
          id: 0,
          report_id: report.id,
          period: row.period,
          grace_type: row.graceType,
          annual_rate: row.annualRate,
          effective_period_rate: row.effectivePeriodRate,
          initial_balance: row.initialBalance,
          interest_paid: row.interest,
          payment_amount: row.installment,
          capital_amortization: row.amortization,
          remaining_balance: row.finalBalance
        })
        this.financialStore.addPayment(newPayment);
      }
    }

    alert('Reporte guardado exitosamente');
  }

  /**
   * Update editable row TEA
   */
  updateRowTea(index: number, value: number): void {
    const rows = [...this.editableRows()];
    rows[index].tea = value;
    this.editableRows.set(rows);
  }

  /**
   * Update editable row grace type
   */
  updateRowGraceType(index: number, value: string): void {
    const rows = [...this.editableRows()];
    rows[index].graceType = value as GraceType;
    this.editableRows.set(rows);
  }

  /**
   * Helper: Get periods per year based on frequency
   */
  private getPeriodsPerYear(frequency: string): number {
    const map: Record<string, number> = {
      'MENSUAL': 12,
      'BIMESTRAL': 6,
      'TRIMESTRAL': 4,
      'CUATRIMESTRAL': 3,
      'SEMESTRAL': 2,
      'ANUAL': 1
    };
    return map[frequency] || 12;
  }

  /**
   * Helper: Calculate grace periods based on term
   */
  private calculateGracePeriods(termMonths: number): number {
    if (termMonths <= 12) return 0;
    if (termMonths <= 60) return 3;
    if (termMonths <= 120) return 6;
    return 12;
  }

  /**
   * Helper: Map grace period string to GraceType
   */
  private mapGracePeriodToType(gracePeriod: string): GraceType {
    if (gracePeriod === 'TOTAL') return 'TOTAL';
    if (gracePeriod === 'PARTIAL') return 'PARCIAL';
    return 'SIN_PLAZO';
  }

  /**
   * Helper: Convert amount to base currency (PEN)
   */
  private convertToBaseCurrency(amount: number, fromCurrency: string): number {
    const fromCurrencyId = fromCurrency === 'USD' ? 2 : 1;
    const toCurrencyId = 1; // PEN is base currency
    return this.currencyService.convert(amount, fromCurrencyId, toCurrencyId);
  }

  /**
   * Helper: Convert amount from base currency (PEN)
   */
  private convertFromBaseCurrency(amount: number, toCurrency: string): number {
    const fromCurrencyId = 1; // PEN is base currency
    const toCurrencyId = toCurrency === 'USD' ? 2 : 1;
    return this.currencyService.convert(amount, fromCurrencyId, toCurrencyId);
  }

  /**
   * Format currency with proper symbol
   */
  formatCurrency(amount: number): string {
    const currencyId = this.currentCurrencyId();
    return this.currencyService.formatAmount(amount, currencyId);
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(currencyId: number): string {
    return this.currencyService.getCurrencySymbol(currencyId);
  }

  /**
   * Get currency code
   */
  getCurrencyCode(currencyId: number): string {
    return this.currencyService.getCurrencyCode(currencyId);
  }

  /**
   * Calculate financial metrics (VAN, TIR, CET)
   */
  private calculateFinancialMetrics(schedule: any[], loanAmount: number, currency: string): void {
    // Simple VAN calculation (NPV) using discount rate = first period rate
    const discountRate = schedule[0]?.effectivePeriodRate || 0;
    let van = -loanAmount;
    for (let i = 0; i < schedule.length; i++) {
      van += schedule[i].payment / Math.pow(1 + discountRate, i + 1);
    }
    this.van.set(this.convertFromBaseCurrency(van, currency));

    // Simple TIR calculation (IRR approximation)
    const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);
    const avgRate = schedule.reduce((sum, row) => sum + row.effectivePeriodRate, 0) / schedule.length;
    const periodsPerYear = this.getPeriodsPerYear(this.calculationForm.get('frequency')?.value || 'MENSUAL');
    this.tir.set(avgRate * periodsPerYear * 100);

    // CET calculation (approximation)
    const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);
    const cet = (totalInterest / loanAmount) / (schedule.length / periodsPerYear) * 100;
    this.cet.set(cet);
  }

  /**
   * Get property by ID
   */
  getPropertyById(id: number | null) {
    if (!id) return null;
    return this.properties().find(p => p.id === id);
  }

  /**
   * Handle property selection
   */
  onPropertySelect(propertyId: number): void {
    this.selectedProperty.set(propertyId);
    const propertyWithPrice = this.propertiesWithConvertedPrices().find(p => p.entity.id === propertyId);
    if (propertyWithPrice) {
      // Use the converted price for the loan amount
      this.calculationForm.patchValue({
        loanAmount: Math.round(propertyWithPrice.displayPrice * 100) / 100,
        property_id: propertyId
      });
    }
  }
}
