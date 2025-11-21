import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {IamStore} from '@iam/application/iam-store';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [TranslateModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly store = inject(IamStore);

  isPasswordVisible = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.update(visible => !visible);
  }

  onSubmit() {
    if (this.loginForm.invalid || this.store.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.store.login(email, password);
  }
}
