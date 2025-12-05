import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '@iam/application/iam-store';
import { User } from '@iam/domain/model/user.entity';
import {Setting} from '@iam/domain/model/setting.entity';

@Component({
  selector: 'app-register',
  imports: [TranslateModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private iamStore = inject(IamStore);

  isPasswordVisible = signal(false);
  isConfirmPasswordVisible = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.passwordMatchValidator
  });

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }
    return null;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible.update(visible => !visible);
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible.update(visible => !visible);
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.registerForm.getRawValue();

    // Create new user with enabled=false (needs to complete profile)
    const newUser = new User({
      id: this.iamStore.userCount() + 1, // Simple ID generation
      username: formValue.username,
      password: formValue.password,
      enabled: false, // Needs to complete profile
      email: formValue.email,
      address: formValue.address,
      registration_date: new Date().toISOString(),
      name: formValue.name,
      last_name: formValue.last_name,
      dni: formValue.dni,
      income: 0, // It will be completed in the home
      savings: 0, // It will be completed in the home
      has_bond: false, // Default false
      has_home: false, // Default false
      role_id: 1 // USER role
    });

    const newSetting = new Setting({
      id: this.iamStore.settingCount() + 1,
      user_id: newUser.id,
      default_currency_catalog_id: 1, // Default PEN currency
      default_interest_type: 'EFFECTIVE', // Default interest type
      default_grace_period: "TOTAL", // Default grace period
      default_opportunity_tea: 10.00, // Default opportunity TEA
      default_days_in_year: 360, // Default days in year
      default_change_usd_pen: 3.70 // Default USD to PEN exchange rate
    });

    // Add user first, then setting
    this.iamStore.addUser(newUser);
    this.iamStore.addSetting(newSetting);

    // Wait and monitor for completion
    const checkCompletion = setInterval(() => {
      const storeLoading = this.iamStore.loading();
      const storeError = this.iamStore.error();

      if (!storeLoading) {
        clearInterval(checkCompletion);

        if (storeError) {
          this.errorMessage.set(storeError);
          this.isLoading.set(false);
        } else {
          // Success - redirect to login
          this.isLoading.set(false);
          console.log('Usuario registrado exitosamente. Redirigiendo al login...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 500);
        }
      }
    }, 100);

    // Timeout de seguridad
    setTimeout(() => {
      if (this.isLoading()) {
        clearInterval(checkCompletion);
        this.errorMessage.set('Error: La operación tardó demasiado tiempo. Por favor, intenta nuevamente.');
        this.isLoading.set(false);
      }
    }, 15000); // 15 segundos timeout
  }

  goToLogin() {
    this.router.navigate(['/login']).then();
  }
}
