import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IamStore } from '@iam/application/iam-store';

@Component({
  selector: 'app-home',
  imports: [TranslateModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private fb = inject(FormBuilder);
  private iamStore = inject(IamStore);

  profileForm: FormGroup;

  // Check if user needs to complete profile
  needsProfile = computed(() => {
    const user = this.iamStore.sessionUser();
    return user ? !user.enabled : false;
  });

  userName = computed(() => {
    const user = this.iamStore.sessionUser();
    return user ? user.name : '';
  });

  constructor() {
    this.profileForm = this.fb.group({
      income: ['', [Validators.required, Validators.min(0)]],
      savings: ['', [Validators.required, Validators.min(0)]],
      hasProperty: [false]
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const formValue = this.profileForm.value;
      console.log('Profile completed:', formValue);

      // TODO: Actualizar el usuario en la API con los nuevos datos
      // y cambiar enabled a true

      // Por ahora, simular actualización
      const user = this.iamStore.sessionUser();
      if (user) {
        user.income = formValue.income;
        user.savings = formValue.savings;

        // Lógica de negocio para has_bond
        user.has_bond = false;

        // Activar el usuario
        user.enabled = true;

        this.iamStore.saveSessionToStorage();
        console.log('Usuario actualizado:', user);
      }
    }
  }
}

