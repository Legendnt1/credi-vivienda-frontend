import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '@iam/application/iam-store';
import { User } from '@iam/domain/model/user.entity';

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
      id: Date.now(), // Temporal ID, será reemplazado por la API
      username: formValue.username,
      password: formValue.password,
      enabled: false, // Usuario necesita completar perfil
      email: formValue.email,
      address: formValue.address,
      registration_date: new Date().toISOString(),
      name: formValue.name,
      last_name: formValue.last_name,
      dni: formValue.dni,
      income: 0, // Se completará en el home
      savings: 0, // Se completará en el home
      has_bond: false, // Default false
      role_id: 1 // USER role
    });

    this.iamStore.addUser(newUser);
    setTimeout(() => {
      console.log('Usuario registrado:', newUser);
      this.isLoading.set(false);

      // Redirigir al login
      this.router.navigate(['/login']).then();
    }, 1000);
  }

  goToLogin() {
    this.router.navigate(['/login']).then();
  }
}
