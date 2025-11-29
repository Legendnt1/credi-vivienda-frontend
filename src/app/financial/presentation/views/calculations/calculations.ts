import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import {
  FrenchAmortizationService,
  FrenchInput,
  GraceType,
  FrenchScheduleResult
} from '@financial/application/services/french-amortization.service';
import { IamStore } from '@iam/application/iam-store';
import { FinancialStore } from '@financial/application/financial-store';
import { ProjectsStore } from '@projects/application/projects-store';
import { CurrencyConversionService } from '@shared/infrastructure/services/currency-conversion.service';
import { Report } from '@financial/domain/model/report.entity';
import { Payment } from '@financial/domain/model/payment.entity';
import { ModalCalculations } from '@financial/presentation/components/modal-calculations/modal-calculations';

interface EditableRow {
  period: number;
  tea: number;
  graceType: GraceType;
}

interface PaymentScheduleRow {
  period: number;
  graceType: GraceType;
  annualRate: number;
  effectivePeriodRate: number;
  initialBalance: number;
  interest: number;
  installment: number;
  amortization: number;
  lifeInsurance: number;
  riskInsurance: number;
  commission: number;
  charges: number;
  adminExpense: number;
  totalPayment: number;
  remainingBalance: number;
  cashFlow: number;
}

@Component({
  selector: 'app-calculations',
  imports: [ReactiveFormsModule, TranslateModule, DecimalPipe, ModalCalculations],
  templateUrl: './calculations.html',
  styleUrl: './calculations.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculations implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly frenchService = inject(FrenchAmortizationService);
  private readonly iamStore = inject(IamStore);
  private readonly financialStore = inject(FinancialStore);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly currencyService = inject(CurrencyConversionService);
  private readonly translate = inject(TranslateService);

  // Modal reference
  readonly modal = viewChild.required<ModalCalculations>('reportModal');

  // Stores signals
  readonly currentUser = this.iamStore.sessionUser;
  readonly userSettings = this.iamStore.getCurrentUserSetting();
  readonly properties = this.projectsStore.propertyProjects;
  readonly bonds = this.projectsStore.bonds;
  readonly credits = this.financialStore.credits;

  // Get the default MiVivienda credit template
  readonly defaultCredit = computed(() => {
    const creditsList = this.credits();
    return creditsList.find(c => c.program === 'Fondo MIVIVIENDA') || null;
  });

  // State signals
  readonly editableRows = signal<EditableRow[]>([]);
  readonly paymentSchedule = signal<PaymentScheduleRow[]>([]);
  readonly selectedProperty = signal<number | null>(null);
  readonly isCalculated = signal(false);
  readonly isFormValid = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // Calculation result
  readonly lastCalculationResult = signal<FrenchScheduleResult | null>(null);

  // Financial metrics from the calculation
  readonly van = signal<number>(0);
  readonly tir = signal<number>(0);
  readonly tcea = signal<number>(0);

  // Forms
  calculationForm!: FormGroup;
  costsForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForms();
  }

  /**
   * Initialize all forms with defaults from Credit and Settings
   */
  private initializeForms(): void {
    const settings = this.userSettings();
    const credit = this.defaultCredit();

    // Main calculation form
    this.calculationForm = this.fb.group({
      property_id: [null, [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      downPayment: [0, [Validators.min(0)]],
      bond_id: [credit?.default_bond_id ?? 1, [Validators.required]],
      years: [credit ? credit.default_credit_term_months / 12 : 20, [Validators.required, Validators.min(0.1)]],
      interestRate: [credit?.default_interest_rate ?? 8.5, [Validators.required, Validators.min(0.01)]],
      interestType: [settings?.default_interest_type ?? credit?.default_interest_type ?? 'EFFECTIVE', [Validators.required]],
      capitalization: [credit?.default_payment_frequency ?? 'MENSUAL', [Validators.required]],
      paymentFrequency: [credit?.default_payment_frequency ?? 'MENSUAL', [Validators.required]],
      opportunityTea: [settings?.default_opportunity_tea ?? 10.0, [Validators.required, Validators.min(0.01)]],
      daysInYear: [settings?.default_days_in_year ?? 360, [Validators.required, Validators.min(300), Validators.max(400)]]
    });

    // Costs form - Initial and periodic costs
    this.costsForm = this.fb.group({
      // Initial costs
      notary: [credit?.notary_cost ?? 0, [Validators.min(0)]],
      registry: [credit?.registry_cost ?? 0, [Validators.min(0)]],
      appraisal: [credit?.appraisal_cost ?? 0, [Validators.min(0)]],
      studyCommission: [credit?.study_commission ?? 0, [Validators.min(0)]],
      activationCommission: [credit?.activation_commission ?? 0, [Validators.min(0)]],

      // Periodic costs
      commission: [credit?.periodic_commission ?? 0, [Validators.min(0)]],
      charges: [credit?.periodic_charges ?? 0, [Validators.min(0)]],
      adminExpense: [credit?.periodic_admin_expense ?? 0, [Validators.min(0)]],
      lifeInsuranceRate: [credit?.life_insurance_annual_rate ?? 0, [Validators.min(0)]],
      riskInsuranceRate: [credit?.risk_insurance_annual_rate ?? 0, [Validators.min(0)]]
    });

    // Watch form validity
    this.calculationForm.statusChanges.subscribe(() => {
      this.isFormValid.set(this.calculationForm.valid);
    });

    // Watch interest type changes to enable/disable capitalization
    const interestTypeControl = this.calculationForm.get('interestType');
    const capitalizationControl = this.calculationForm.get('capitalization');

    if (interestTypeControl && capitalizationControl) {
      // Set initial state
      const initialInterestType = interestTypeControl.value;
      if (initialInterestType === 'EFFECTIVE') {
        capitalizationControl.disable();
      } else {
        capitalizationControl.enable();
      }

      // Watch for changes
      interestTypeControl.valueChanges.subscribe(value => {
        if (value === 'EFFECTIVE') {
          capitalizationControl.disable();
        } else {
          capitalizationControl.enable();
        }
      });
    }
  }

  /**
   * Handle property selection
   */
  onPropertySelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const propertyId = parseInt(target.value);
    this.selectedProperty.set(propertyId);

    const property = this.properties().find(p => p.id === propertyId);
    if (property) {
      // Convert property price to user's currency
      const settings = this.userSettings();
      const userCurrencyId = settings?.default_currency_catalog_id ?? 1;

      const convertedPrice = this.currencyService.convert(
        property.price,
        property.currency_catalog_id,
        userCurrencyId
      );

      this.calculationForm.patchValue({
        property_id: propertyId,
        price: this.round2(convertedPrice)
      });
    }
  }

  /**
   * Generate editable table rows based on years and frequency
   */
  onGenerateTable(): void {
    if (!this.calculationForm.valid) {
      this.errorMessage.set('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    this.errorMessage.set(null);

    const years = this.round2(this.calculationForm.get('years')?.value ?? 0);
    const frequency = this.calculationForm.get('paymentFrequency')?.value ?? 'MENSUAL';
    const interestRate = this.round2(this.calculationForm.get('interestRate')?.value ?? 0);
    const interestType = this.calculationForm.get('interestType')?.value ?? 'EFFECTIVE';
    const capitalization = this.calculationForm.get('capitalization')?.value ?? 'MENSUAL';
    const credit = this.defaultCredit();

    // Calculate total periods - ensure it's an integer
    const periodsPerYear = this.getPeriodsPerYear(frequency);
    const totalPeriods = Math.round(years * periodsPerYear); // Round to nearest integer

    if (totalPeriods <= 0) {
      this.errorMessage.set('El plazo debe generar al menos 1 período de pago.');
      return;
    }

    // Convert to TEA if needed
    let tea = interestRate / 100; // Convert percentage to decimal
    if (interestType === 'NOMINAL') {
      // Convert nominal to effective using capitalization frequency: TEA = (1 + j/m)^m - 1
      const capitalizationPerYear = this.getPeriodsPerYear(capitalization);
      tea = Math.pow(1 + tea / capitalizationPerYear, capitalizationPerYear) - 1;
      console.log(`Converting nominal to TEA: ${interestRate}% nominal with ${capitalization} capitalization = ${(tea * 100).toFixed(7)}% TEA`);
    }

    // Determine grace periods based on credit defaults or calculated
    const totalGraceMonths = credit?.default_grace_period_total_months ?? 0;
    const partialGraceMonths = credit?.default_grace_period_partial_months ?? 0;

    // Convert grace months to periods (based on the selected frequency)
    const totalGracePeriods = Math.round((totalGraceMonths / 12) * periodsPerYear);
    const partialGracePeriods = Math.round((partialGraceMonths / 12) * periodsPerYear);

    // Generate rows
    const rows: EditableRow[] = [];
    for (let i = 1; i <= totalPeriods; i++) {
      let graceType: GraceType = 'SIN_PLAZO';

      if (i <= totalGracePeriods) {
        graceType = 'TOTAL';
      } else if (i <= totalGracePeriods + partialGracePeriods) {
        graceType = 'PARCIAL';
      }

      rows.push({
        period: i,
        tea: Number((tea * 100).toFixed(7)), // Store as percentage with 7 decimals for precision
        graceType: graceType
      });
    }

    this.editableRows.set(rows);
    this.isCalculated.set(false);
    this.paymentSchedule.set([]);
    this.lastCalculationResult.set(null);
  }

  /**
   * Calculate payment schedule using FrenchAmortizationService
   */
  onCalculate(): void {
    if (!this.calculationForm.valid || this.editableRows().length === 0) {
      this.errorMessage.set('Primero genera la tabla de períodos.');
      return;
    }

    this.errorMessage.set(null);

    try {
      const formValue = this.calculationForm.value;
      const costsValue = this.costsForm.value;
      const rows = this.editableRows();

      // Get bond amount and convert to user's currency (bonds are stored in PEN)
      const bondId = parseInt(formValue.bond_id);
      const bond = this.bonds().find(b => b.id === bondId);
      const bondAmountPEN = bond?.total_bond ?? 0;

      const settings = this.userSettings();
      const userCurrencyId = settings?.default_currency_catalog_id ?? 1;
      const bondAmount = this.currencyService.convert(
        bondAmountPEN,
        this.currencyService.CURRENCY_PEN_ID,
        userCurrencyId
      );

      // Normalize all inputs to 2 decimals and ensure no null/undefined
      const price = this.round2(formValue.price ?? 0);
      const downPayment = this.round2(formValue.downPayment ?? 0);
      const years = this.round2(formValue.years ?? 0);
      const frequency = formValue.paymentFrequency ?? 'MENSUAL';
      const opportunityTea = this.round2(formValue.opportunityTea ?? 10) / 100; // Convert to decimal
      const daysInYear = parseInt(formValue.daysInYear ?? 360);

      // Build FrenchInput
      const input: FrenchInput = {
        price: price,
        downPaymentAmount: downPayment,
        bondAmount: bondAmount,
        years: years,
        frequency: frequency,
        annualRates: rows.map(r => this.round2(r.tea) / 100), // Convert to decimal
        graceByPeriod: rows.map(r => r.graceType),
        daysInYear: daysInYear,
        initialCosts: {
          notary: this.round2(costsValue.notary ?? 0),
          registry: this.round2(costsValue.registry ?? 0),
          appraisal: this.round2(costsValue.appraisal ?? 0),
          studyCommission: this.round2(costsValue.studyCommission ?? 0),
          activationCommission: this.round2(costsValue.activationCommission ?? 0)
        },
        periodicCosts: {
          commission: this.round2(costsValue.commission ?? 0),
          charges: this.round2(costsValue.charges ?? 0),
          adminExpense: this.round2(costsValue.adminExpense ?? 0),
          lifeInsuranceAnnualRate: this.round2(costsValue.lifeInsuranceRate ?? 0) / 100,
          riskInsuranceAnnualRate: this.round2(costsValue.riskInsuranceRate ?? 0) / 100
        },
        opportunityAnnualRatePercent: opportunityTea
      };

      // Calculate schedule
      const result = this.frenchService.calculateSchedule(input);
      this.lastCalculationResult.set(result);

      // Map to display format
      const displaySchedule: PaymentScheduleRow[] = result.schedule.map(row => ({
        period: row.period,
        graceType: row.graceType,
        annualRate: this.round2(row.annualRate * 100),
        effectivePeriodRate: this.round2(row.effectivePeriodRate * 100),
        initialBalance: this.round2(row.initialBalance),
        interest: this.round2(row.interest),
        installment: this.round2(row.installment),
        amortization: this.round2(row.amortization),
        lifeInsurance: this.round2(row.lifeInsurance ?? 0),
        riskInsurance: this.round2(row.riskInsurance ?? 0),
        commission: this.round2(row.commission ?? 0),
        charges: this.round2(row.charges ?? 0),
        adminExpense: this.round2(row.adminExpense ?? 0),
        totalPayment: this.round2(row.totalInstallmentWithCharges!),
        remainingBalance: this.round2(row.finalBalance),
        cashFlow: this.round2(row.cashFlow!)
      }));

      this.paymentSchedule.set(displaySchedule);

      // Set financial metrics from result
      this.van.set(this.round2(result.npv ?? 0));
      this.tir.set(this.round2((result.irrPerPeriod ?? 0) * 100));
      this.tcea.set(this.round2((result.tcea ?? 0) * 100));

      this.isCalculated.set(true);
      this.successMessage.set('Cálculo completado exitosamente.');

      // Clear success message after 3 seconds
      setTimeout(() => this.successMessage.set(null), 3000);

    } catch (error) {
      console.error('Error calculating schedule:', error);
      this.errorMessage.set('Error al calcular el cronograma. Verifique los datos ingresados.');
      this.isCalculated.set(false);
    }
  }

  /**
   * Save report and payments to the store
   */
  onSaveReport(): void {
    if (!this.isCalculated() || !this.currentUser()) {
      const modalRef = this.modal();
      modalRef.openError(
        this.translate.instant('calculations.modal.errorTitle'),
        'Primero debe calcular el cronograma.'
      );
      return;
    }

    const result = this.lastCalculationResult();
    if (!result) {
      const modalRef = this.modal();
      modalRef.openError(
        this.translate.instant('calculations.modal.errorTitle'),
        'No hay resultados de cálculo para guardar.'
      );
      return;
    }

    try {
      const formValue = this.calculationForm.value;
      const costsValue = this.costsForm.value;
      const settings = this.userSettings();
      const userId = this.currentUser()!.id;
      const creditId = this.defaultCredit()?.id ?? 1;

      // Calculate totals from schedule
      const schedule = this.paymentSchedule();
      const totalInstallmentsPaid = this.round2(schedule.reduce((sum, row) => sum + row.installment, 0));
      const totalAmortization = this.round2(schedule.reduce((sum, row) => sum + row.amortization, 0));
      const totalInterest = this.round2(schedule.reduce((sum, row) => sum + row.interest, 0));
      const totalPaymentsReport = this.round2(schedule.reduce((sum, row) => sum + row.totalPayment, 0));

      // Get bond amount and convert to user's currency (bonds are stored in PEN)
      const bondId = parseInt(formValue.bond_id ?? 1);
      const bond = this.bonds().find(b => b.id === bondId);
      const bondAmountPEN = bond?.total_bond ?? 0;

      const userCurrencyId = settings?.default_currency_catalog_id ?? 1;
      const bondAmount = this.round2(this.currencyService.convert(
        bondAmountPEN,
        this.currencyService.CURRENCY_PEN_ID,
        userCurrencyId
      ));

      // Create report entity
      const reports = this.financialStore.reports();
      const newReportId = reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1;

      const report = new Report({
        id: newReportId,
        user_id: userId,
        credit_id: creditId,
        property_project_id: parseInt(formValue.property_id ?? 0),
        currency_catalog_id: settings?.default_currency_catalog_id ?? 1,
        generated_at: new Date().toISOString(),
        price: this.round2(formValue.price ?? 0),
        down_payment: this.round2(formValue.downPayment ?? 0),
        bond_applied: bondAmount,
        years: this.round2(formValue.years ?? 0),
        frequency: formValue.paymentFrequency ?? 'MENSUAL',
        base_tea: this.round2(formValue.interestRate ?? 0),
        notary: this.round2(costsValue.notary ?? 0),
        registry: this.round2(costsValue.registry ?? 0),
        appraisal: this.round2(costsValue.appraisal ?? 0),
        study_commission: this.round2(costsValue.studyCommission ?? 0),
        activation_commission: this.round2(costsValue.activationCommission ?? 0),
        commission: this.round2(costsValue.commission ?? 0),
        charges: this.round2(costsValue.charges ?? 0),
        admin_expense: this.round2(costsValue.adminExpense ?? 0),
        life_insurance_annual_rate: this.round2(costsValue.lifeInsuranceRate ?? 0),
        risk_insurance_annual_rate: this.round2(costsValue.riskInsuranceRate ?? 0),
        opportunity_tea: this.round2(formValue.opportunityTea ?? 10),
        total_installments_paid: totalInstallmentsPaid,
        total_amortization: totalAmortization,
        total_interest: totalInterest,
        total_payments_report: totalPaymentsReport,
        van: this.round2(this.van()),
        tir: this.round2(this.tir()),
        tcea: this.round2(this.tcea())
      });

      // Save report
      this.financialStore.addReport(report);

      // Create and save payments
      const payments = this.financialStore.payments();
      let nextPaymentId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;

      for (const row of schedule) {
        const payment = new Payment({
          id: nextPaymentId++,
          report_id: newReportId,
          period: row.period,
          grace_type: row.graceType,
          annual_rate: this.round2(row.annualRate),
          effective_period_rate: this.round2(row.effectivePeriodRate),
          initial_balance: this.round2(row.initialBalance),
          interest_paid: this.round2(row.interest),
          installment_base: this.round2(row.installment),
          capital_amortization: this.round2(row.amortization),
          life_insurance: this.round2(row.lifeInsurance),
          risk_insurance: this.round2(row.riskInsurance),
          commission: this.round2(row.commission),
          charges: this.round2(row.charges),
          admin_expense: this.round2(row.adminExpense),
          total_payment: this.round2(row.totalPayment),
          remaining_balance: this.round2(row.remainingBalance),
          cash_flow: this.round2(row.cashFlow)
        });

        this.financialStore.addPayment(payment);
      }

      // Show success modal
      const modalRef = this.modal();
      modalRef.openSuccess(
        this.translate.instant('calculations.modal.successTitle'),
        `Reporte #${newReportId} guardado exitosamente con ${schedule.length} pagos.`
      );

    } catch (error) {
      console.error('Error saving report:', error);
      const modalRef = this.modal();
      modalRef.openError(
        this.translate.instant('calculations.modal.errorTitle'),
        'Error al guardar el reporte. Intente nuevamente.'
      );
    }
  }

  /**
   * Reset all form values and state when modal is closed
   */
  onModalClosed(): void {
    // Reset forms to initial values
    this.initializeForms();

    // Reset state signals
    this.editableRows.set([]);
    this.paymentSchedule.set([]);
    this.selectedProperty.set(null);
    this.isCalculated.set(false);
    this.lastCalculationResult.set(null);
    this.van.set(0);
    this.tir.set(0);
    this.tcea.set(0);
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  /**
   * Update TEA for a specific row
   */
  updateRowTea(index: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value) || 0;
    const rows = [...this.editableRows()];
    // Store TEA with 7 decimals for precision
    rows[index].tea = Number(value.toFixed(7));
    this.editableRows.set(rows);
  }

  /**
   * Update grace type for a specific row
   */
  updateRowGraceType(index: number, event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = target.value as GraceType;
    const rows = [...this.editableRows()];
    rows[index].graceType = value;
    this.editableRows.set(rows);
  }

  /**
   * Round input to 2 decimals on blur
   */
  onMonetaryBlur(event: Event, controlName: string, formGroup: FormGroup = this.calculationForm): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value) || 0;
    const rounded = this.round2(value);
    formGroup.get(controlName)?.setValue(rounded, { emitEvent: false });
  }

  /**
   * Helper: Round to 2 decimal places
   */
  private round2(value: number): number {
    return Math.round(value * 100) / 100;
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
   * Helper: Map grace period string to GraceType
   */
  private mapGracePeriodToType(gracePeriod: string): GraceType {
    if (gracePeriod === 'TOTAL') return 'TOTAL';
    if (gracePeriod === 'PARTIAL') return 'PARCIAL';
    return 'SIN_PLAZO';
  }

  /**
   * Format currency for display
   */
  formatCurrency(amount: number): string {
    const settings = this.userSettings();
    const currencyId = settings?.default_currency_catalog_id ?? 1;
    return this.currencyService.formatAmount(amount, currencyId);
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(): string {
    const settings = this.userSettings();
    const currencyId = settings?.default_currency_catalog_id ?? 1;
    return this.currencyService.getCurrencySymbol(currencyId);
  }

  /**
   * Convert bond amount to user's currency
   * Bonds are stored in PEN by default
   */
  convertBondAmount(bondAmount: number): number {
    const settings = this.userSettings();
    const userCurrencyId = settings?.default_currency_catalog_id ?? 1;

    // Bonds are stored in PEN (id=1), convert to user's currency
    return this.currencyService.convert(
      bondAmount,
      this.currencyService.CURRENCY_PEN_ID,
      userCurrencyId
    );
  }
}
