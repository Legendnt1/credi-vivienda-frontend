import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '@iam/application/iam-store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-button-logout',
  imports: [TranslateModule],
  templateUrl: './button-logout.html',
  styleUrl: './button-logout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonLogout {
  private iamStore = inject(IamStore);
  private router = inject(Router);

  logout(): void {
    this.iamStore.logout();
    this.router.navigate(['/login']).then();
  }
}

