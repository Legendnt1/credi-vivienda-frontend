import {Component, effect, inject, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {IamStore} from '@iam/application/iam-store';
import {TranslateModule} from '@ngx-translate/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [TranslateModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  readonly store = inject(IamStore);
  private route = inject(ActivatedRoute);
    private router = inject(Router);

  isPasswordVisible = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }

  private _autoRedirect = effect(() => {
    if (!this.store.isAuthenticated()) return;
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    const navigateTo = '/dashboard';
    const target = redirect || navigateTo;
    if (this.router.url !== target) {
      void this.router.navigateByUrl(target);
    }
  })

  onSubmit() {
    if (this.loginForm.invalid || this.store.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.store.login(email, password);
  }
}
