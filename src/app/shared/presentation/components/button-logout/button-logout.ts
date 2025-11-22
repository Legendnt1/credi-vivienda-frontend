import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '@iam/application/iam-store';

@Component({
  selector: 'app-button-logout',
  imports: [TranslateModule],
  templateUrl: './button-logout.html',
  styleUrl: './button-logout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonLogout {
  private iamStore = inject(IamStore);

  logout(): void {
    this.iamStore.logout();
  }
}

