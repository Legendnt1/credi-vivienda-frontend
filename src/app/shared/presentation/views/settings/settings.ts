import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '@iam/application/iam-store';
import { FinancialStore } from '@financial/application/financial-store';
import { Setting } from '@iam/domain/model/setting.entity';
import {LanguageSwitcher} from '@shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, LanguageSwitcher],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Settings implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly iamStore = inject(IamStore);
  private readonly financialStore = inject(FinancialStore);

  // Signals
  readonly settingsForm!: FormGroup;
  readonly currentUser = this.iamStore.sessionUser;
  readonly currencies = this.financialStore.currencyCatalogs;
  readonly loading = signal<boolean>(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // Interest Type Options
  readonly interestTypes = [
    { value: 'EFFECTIVE', label: 'settings.form.interestType.options.effective' },
    { value: 'NOMINAL', label: 'settings.form.interestType.options.nominal' }
  ];

  // Grace Period Options
  readonly gracePeriods = [
    { value: 'TOTAL', label: 'settings.form.gracePeriod.options.total' },
    { value: 'PARTIAL', label: 'settings.form.gracePeriod.options.partial' }
  ];

  // Days in Year Options
  readonly daysInYearOptions = [
    { value: 360, label: '360' },
    { value: 365, label: '365' }
  ];

  // Current Setting
  readonly currentSetting = this.iamStore.getCurrentUserSetting();

  constructor() {
    // Initialize form with validators
    this.settingsForm = this.fb.group({
      default_currency_catalog_id: [1, [Validators.required]],
      default_interest_type: ['EFFECTIVE', [Validators.required]],
      default_grace_period: ['TOTAL', [Validators.required]],
      default_opportunity_tea: [10.0, [Validators.required, Validators.min(0.01)]],
      default_days_in_year: [360, [Validators.required, Validators.min(300), Validators.max(400)]],
      default_change_usd_pen: [3.70, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentSettings();
  }

  /**
   * Load current user settings into the form
   */
  private loadCurrentSettings(): void {
    const setting = this.currentSetting();
    if (setting) {
      // Use existing settings with fallbacks for any null/undefined values
      this.settingsForm.patchValue({
        default_currency_catalog_id: setting.default_currency_catalog_id ?? 1,
        default_interest_type: setting.default_interest_type ?? 'EFFECTIVE',
        default_grace_period: setting.default_grace_period ?? 'TOTAL',
        default_opportunity_tea: setting.default_opportunity_tea ?? 10.0,
        default_days_in_year: setting.default_days_in_year ?? 360,
        default_change_usd_pen: setting.default_change_usd_pen ?? 3.70,
      });
    } else {
      // Apply default values if no setting exists
      const defaultCurrency = this.currencies()[0];
      if (defaultCurrency) {
        this.settingsForm.patchValue({
          default_currency_catalog_id: defaultCurrency.id
        });
      }
      // Other fields already have defaults from form initialization
    }
  }

  /**
   * Format opportunity TEA to 2 decimals on blur
   */
  onOpportunityTeaBlur(): void {
    const control = this.settingsForm.get('default_opportunity_tea');
    if (control && control.value !== null && control.value !== undefined) {
      const roundedValue = parseFloat(parseFloat(control.value).toFixed(2));
      control.setValue(roundedValue, { emitEvent: false });
    }
  }

  /**
   * Format exchange rate to 2 decimals on blur
   */
  onExchangeRateBlur(): void {
    const control = this.settingsForm.get('default_change_usd_pen');
    if (control && control.value !== null && control.value !== undefined) {
      const roundedValue = parseFloat(parseFloat(control.value).toFixed(2));
      control.setValue(roundedValue, { emitEvent: false });
    }
  }

  /**
   * Save settings
   */
  onSaveSettings(): void {
    if (this.settingsForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.settingsForm.controls).forEach(key => {
        this.settingsForm.get(key)?.markAsTouched();
      });
      this.errorMessage.set('Por favor, completa todos los campos correctamente.');
      return;
    }

    const userId = this.currentUser()?.id;
    if (!userId) {
      this.errorMessage.set('Usuario no encontrado.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValue = this.settingsForm.value;

    // Normalize values before saving
    const normalizedValues = {
      default_currency_catalog_id: parseInt(formValue.default_currency_catalog_id),
      default_interest_type: formValue.default_interest_type,
      default_grace_period: formValue.default_grace_period,
      default_opportunity_tea: parseFloat(parseFloat(formValue.default_opportunity_tea).toFixed(2)),
      default_days_in_year: parseInt(formValue.default_days_in_year),
      default_change_usd_pen: parseFloat(parseFloat(formValue.default_change_usd_pen).toFixed(2))
    };

    const existingSetting = this.currentSetting();

    if (existingSetting) {
      // Update existing setting
      const updatedSetting = new Setting({
        id: existingSetting.id,
        user_id: existingSetting.user_id,
        ...normalizedValues
      });

      this.iamStore.updateSetting(updatedSetting);
      this.successMessage.set('Configuración actualizada exitosamente.');
    } else {
      // Create new setting for this user
      const settings = this.iamStore.settings();
      const newId = settings.length > 0 ? Math.max(...settings.map(s => s.id)) + 1 : 1;

      const newSetting = new Setting({
        id: newId,
        user_id: userId,
        ...normalizedValues
      });

      this.iamStore.addSetting(newSetting);
      this.successMessage.set('Configuración creada exitosamente.');
    }

    this.loading.set(false);

    // Clear success message after 3 seconds
    setTimeout(() => {
      this.successMessage.set(null);
    }, 3000);
  }
}
