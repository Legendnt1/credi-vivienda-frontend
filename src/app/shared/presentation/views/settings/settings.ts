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

  // Current Setting
  readonly currentSetting = this.iamStore.getCurrentUserSetting();

  constructor() {
    this.settingsForm = this.fb.group({
      default_currency_catalog_id: [null, Validators.required],
      default_interest_type: ['EFFECTIVE', Validators.required],
      default_grace_period: ['TOTAL', Validators.required]
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
      this.settingsForm.patchValue({
        default_currency_catalog_id: setting.default_currency_catalog_id,
        default_interest_type: setting.default_interest_type,
        default_grace_period: setting.default_grace_period
      });
    } else {
      // Set default values if no setting exists
      const defaultCurrency = this.currencies()[0];
      if (defaultCurrency) {
        this.settingsForm.patchValue({
          default_currency_catalog_id: defaultCurrency.id
        });
      }
    }
  }

  /**
   * Save settings
   */
  onSaveSettings(): void {
    if (this.settingsForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos requeridos.');
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
    const existingSetting = this.currentSetting();

    if (existingSetting) {
      // Update existing setting
      const updatedSetting = new Setting({
        id: existingSetting.id,
        user_id: existingSetting.user_id,
        default_currency_catalog_id: formValue.default_currency_catalog_id,
        default_interest_type: formValue.default_interest_type,
        default_grace_period: formValue.default_grace_period
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
        default_currency_catalog_id: formValue.default_currency_catalog_id,
        default_interest_type: formValue.default_interest_type,
        default_grace_period: formValue.default_grace_period
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
