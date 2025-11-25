import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-calculations',
  imports: [ReactiveFormsModule, TranslateModule, DecimalPipe],
  templateUrl: './calculations.html',
  styleUrl: './calculations.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculations {
  /**
   * Form builder service
   * @private
   */
  private readonly fb = new FormBuilder();

  /**
   * Calculation form
   */
  readonly calculationForm: FormGroup = this.fb.group({
    loanAmount: ['', [Validators.required, Validators.min(0)]],
    term: ['', [Validators.required, Validators.min(1)]],
    interestRate: ['', [Validators.required, Validators.min(0)]],
    rateType: ['', Validators.required]
  });

  /**
   * Mock payment schedule data
   */
  readonly mockPaymentSchedule = signal([
    {
      month: 1,
      installment: 2575.00,
      interest: 2500.00,
      amortization: 75.00,
      balanceWithBond: 349925.00
    },
    {
      month: 2,
      installment: 2575.00,
      interest: 2495.00,
      amortization: 80.00,
      balanceWithBond: 349845.00
    }
  ]);

  /**
   * Mock summary data
   */
  readonly mockSummary = signal({
    van: 15000.00,
    tir: 14.2,
    cet: 15.1
  });

  /**
   * Calculate payment schedule (placeholder)
   */
  onCalculate(): void {
    if (this.calculationForm.valid) {
      console.log('Form values:', this.calculationForm.value);
      // Here will go the actual calculation logic using FrenchAmortizationService
    }
  }
}
