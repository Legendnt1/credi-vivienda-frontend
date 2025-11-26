import {Injectable} from '@angular/core';
import {Credit} from '@financial/domain/model/credit.entity';
import {PropertyProject} from '@projects/domain/property-project.entity';
import {Bond} from '@projects/domain/bond.entity';

/**
 * Payment frequency options.
 */
export type PaymentFrequency =
  | 'DIARIA'
  | 'QUINCENAL'
  | 'MENSUAL'
  | 'BIMESTRAL'
  | 'TRIMESTRAL'
  | 'CUATRIMESTRAL'
  | 'SEMESTRAL'
  | 'ANUAL';


/**
 * Type of grace period.
 */
export type GraceType = 'TOTAL' | 'PARCIAL' | 'SIN_PLAZO';


/**
 * Configuration for grace periods.
 */
export interface GraceConfig {
  /**
   * Type of grace period.
   */
  totalPeriods: number;
  /**
   * Number of partial periods.
   */
  partialPeriods: number;
}

/**
 * Input parameters for French amortization calculations.
 */
export interface FrenchInput {
  /**
   * Property price: PV
   */
  price: number;
  /**
   * Amount of down payment(no percentage): CI
   */
  downPaymentAmount: number;
  /**
   * Amount of bond or loan.
   */
  bondAmount?: number;
  /**
   * Number of years for the amortization.
   */
  years: number;
  /**
   * Payment frequency.
   */
  frequency: PaymentFrequency;
  /**
   * Array of annual interest rates in percentage (TEA(NC) %).
   */
  annualRates: number[];
  /**
   * Configuration for grace periods.
   */
  graceConfig?: GraceConfig;
  /**
   * Grace type by period (optional).
   */
  graceByPeriod?: GraceType[];
  /**
   * Number of days in a year (optional, defaults to 360): NDxA
   */
  daysInYear?: number;
}

/**
 * A row in the French amortization schedule.
 */
export interface FrenchScheduleRow {
  period: number;             // NC
  graceType: GraceType;       // Type of grace period
  annualRate: number;         // TEA(NC) en %
  effectivePeriodRate: number;// TES(NC)
  initialBalance: number;     // SI(NC)
  interest: number;           // I(NC)
  installment: number;        // R(NC)
  amortization: number;       // A(NC)
  finalBalance: number;       // SF(NC)
}

/**
 * Result of French amortization schedule calculation.
 */
export interface FrenchScheduleResult {
  price: number; // PV
  downPayment: number; // CI
  bondApplied: number; // Bond applied
  financedCapital: number;     // C
  frequency: PaymentFrequency; // F
  periodsPerYear: number;      // NCxA
  totalPeriods: number;        // N
  schedule: FrenchScheduleRow[]; // Amortization schedule
  totalInstallmentsPaid: number; // SumaR
  totalAmortization: number;     // SumaA
  totalInterest: number;         // SumaI
}

/**
 * Service to calculate French amortization schedules.
 */
@Injectable({
  providedIn: 'root'
})
export class FrenchAmortizationService {
  /**
   * Mapping of payment frequencies to number of days.
   * @private
   */
  private readonly FREQUENCY_DAYS: Record<PaymentFrequency, number> = {
    DIARIA: 1,
    QUINCENAL: 15,
    MENSUAL: 30,
    BIMESTRAL: 60,
    TRIMESTRAL: 90,
    CUATRIMESTRAL: 120,
    SEMESTRAL: 180,
    ANUAL: 360
  };

  /**
   * Calculates the French amortization schedule based on the provided input.
   * @param input - Input parameters for the calculation.
   * @returns The calculated French amortization schedule result.
   */
  calculateSchedule(input: FrenchInput): FrenchScheduleResult {
    const daysInYear = input.daysInYear ?? 360; // NDxA
    const frequencyDays = this.FREQUENCY_DAYS[input.frequency];

    if (!frequencyDays) {
      throw new Error(`Frecuencia de pago no soportada: ${input.frequency}`);
    }


    const periodsPerYear = daysInYear / frequencyDays;
    const totalPeriods = Math.floor(periodsPerYear * input.years); // N


    const downPayment = this.round2(input.downPaymentAmount);
    const bond = this.round2(input.bondAmount ?? 0);

    let financedCapital = input.price - downPayment - bond;
    if (financedCapital < 0) {
      financedCapital = 0;
    }
    financedCapital = this.round2(financedCapital);

    const graceConfig: GraceConfig = input.graceConfig ?? {
      totalPeriods: 0,
      partialPeriods: 0
    };

    const schedule: FrenchScheduleRow[] = [];

    let sumInstallments = 0;  // SumaR
    let sumAmortization = 0;  // SumaA
    let currentInitialBalance = financedCapital; // SI(NC)

    for (let period = 1; period <= totalPeriods; period++) {
      const index = period - 1;

      // Determine grace type for the current period
      const graceType: GraceType =
        input.graceByPeriod?.[index] ?? this.resolveGraceType(period, graceConfig);

      // Resolve annual interest rate for the current period
      const annualRatePercent = this.resolveAnnualRateForPeriod(period, input.annualRates);
      const annualRate = annualRatePercent / 100; // TEA(NC) as decimal

      // TES(NC) = (1 + TEA(NC))^(F / NDxA) - 1
      const effectivePeriodRate = Math.pow(1 + annualRate, frequencyDays / daysInYear) - 1;

      // SI(NC)
      const initialBalance = currentInitialBalance;

      // I(NC) = TES(NC) * SI(NC)
      const interest = this.round2(effectivePeriodRate * initialBalance);

      let installment = 0;   // R(NC)
      let amortization = 0;  // A(NC)
      let finalBalance = 0;  // SF(NC)

      if (graceType === 'TOTAL') {
        // TOTAL: only interest is paid
        installment = 0;
        amortization = 0;
        finalBalance = this.round2(initialBalance + interest);
      } else if (graceType === 'PARCIAL') {
        // PARCIAL: pay interest only as
        installment = interest;
        amortization = 0;
        finalBalance = initialBalance;
      } else {
        // SIN_PLAZO: normal amortization
        const remainingPeriods = totalPeriods - period + 1; // (N - NC + 1)
        const r = this.computeFrenchInstallment(
          initialBalance,
          effectivePeriodRate,
          remainingPeriods
        );
        installment = this.round2(r);
        amortization = this.round2(installment - interest);
        finalBalance = this.round2(initialBalance - amortization);
      }

      sumInstallments += installment;
      sumAmortization += amortization;

      schedule.push({
        period,
        graceType,
        annualRate: annualRatePercent,
        effectivePeriodRate,
        initialBalance,
        interest,
        installment,
        amortization,
        finalBalance
      });

      // Update for next period
      currentInitialBalance = finalBalance;
    }

    const totalInstallmentsPaid = this.round2(sumInstallments);
    const totalAmortization = this.round2(sumAmortization);
    const totalInterest = this.round2(totalInstallmentsPaid - totalAmortization);

    return {
      price: input.price,
      downPayment,
      bondApplied: bond,
      financedCapital,
      frequency: input.frequency,
      periodsPerYear,
      totalPeriods,
      schedule,
      totalInstallmentsPaid,
      totalAmortization,
      totalInterest
    };
  }

  /**
   * Compute the French installment amount.
   * R = SI * [ i * (1 + i)^(n) ] / [ (1 + i)^(n) - 1 ]
   * @param initialBalance - Initial balance.
   * @param effectivePeriodRate - Effective period interest rate.
   * @param remainingPeriods - Remaining number of periods.
   * @returns The installment amount.
   * @private
   */
  private computeFrenchInstallment(
    initialBalance: number,
    effectivePeriodRate: number,
    remainingPeriods: number
  ): number {
    if (effectivePeriodRate === 0) {
      // If the interest rate is 0%, the installment is simply the initial balance divided by remaining periods
      return initialBalance / remainingPeriods;
    }

    const i = effectivePeriodRate;
    const factor = Math.pow(1 + i, remainingPeriods);
    const numerator = i * factor;
    const denominator = factor - 1;

    return initialBalance * (numerator / denominator);
  }

  /**
   * Resolve the type of grace period for
   * @param period - The current period number.
   * @param cfg - Grace period configuration.
   * @returns The type of grace period.
   * @private
   */
  private resolveGraceType(period: number, cfg: GraceConfig): GraceType {
    if (period <= cfg.totalPeriods) {
      return 'TOTAL';
    }
    if (period <= cfg.totalPeriods + cfg.partialPeriods) {
      return 'PARCIAL';
    }
    return 'SIN_PLAZO';
  }

  /**
   * Resolve the annual interest rate for a given period.
   * @param period - The current period number.
   * @param annualRates - Array of annual rates.
   * @returns The annual rate for the specified period.
   * @private
   */
  private resolveAnnualRateForPeriod(period: number, annualRates: number[]): number {
    if (!annualRates || annualRates.length === 0) {
      throw new Error('Debe especificar al menos una tasa efectiva anual (annualRates).');
    }
    if (annualRates.length === 1) {
      return annualRates[0];
    }
    if (period <= annualRates.length) {
      return annualRates[period - 1];
    }
    return annualRates[annualRates.length - 1];
  }

  /**
   * Round a number to 2 decimal places.
   * @param value - The number to round.
   * @returns The rounded number.
   * @private
   */
  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Build FrenchInput from entities.
   * @param credit
   * @param property
   * @param bond
   */
  buildInputFromEntities(
    credit: Credit,
    property: PropertyProject,
    bond?: Bond | null
  ): FrenchInput {
    // Convert credit term from months to years
    const years = credit.credit_term_months / 12;

    const bondAmount = bond ? bond.total_bond : 0;

    const graceConfig: GraceConfig = {
      totalPeriods: credit.grace_period_total,
      partialPeriods: credit.grace_period_partial
    };

    return {
      price: property.price,
      downPaymentAmount: credit.down_payment,
      bondAmount,
      years,
      // Assign payment frequency directly from credit entity
      frequency: credit.payment_frequency as PaymentFrequency,
      // Assume a single interest rate for simplicity
      annualRates: [credit.interest_rate],
      graceConfig,
      daysInYear: 360
    };
  }

  /**
   * Calculate the French amortization schedule using entities.
   * @param credit - Credit entity.
   * @param property - Property project entity.
   * @param bond - Optional bond entity.
   * @returns The calculated French amortization schedule result.
   * @example const result = service.calculateFromStore(creditSignal(),selectedPropertySignal(),selectedBondSignal());
   */
  calculateFromStore(
    credit: Credit,
    property: PropertyProject,
    bond?: Bond | null
  ): FrenchScheduleResult {
    const input = this.buildInputFromEntities(credit, property, bond);
    return this.calculateSchedule(input);
  }
}
