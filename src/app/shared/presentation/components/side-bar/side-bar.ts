import {Component, ChangeDetectionStrategy, signal, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonLogout } from '../button-logout/button-logout';
import {IamStore} from '@iam/application/iam-store';

interface MenuItem {
  label: string;
  iconId: string;
  route: string;
  translationKey: string;
}

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive, TranslateModule, ButtonLogout],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBar {
  readonly spriteUrl = '/assets/icons/sprite.symbol.svg';
  private readonly iamStore = inject(IamStore);
  readonly sessionUser = this.iamStore.sessionUser;

  menuItems = signal<MenuItem[]>([
    {
      label: 'Configuración',
      iconId: 'settings',
      route: '/settings',
      translationKey: 'sidebar.settings'
    },
    {
      label: 'Inmuebles',
      iconId: 'home',
      route: '/projects',
      translationKey: 'sidebar.projects'
    },
    {
      label: 'Cálculos',
      iconId: 'calculator',
      route: '/calculations',
      translationKey: 'sidebar.calculations'
    },
    {
      label: 'Reportes',
      iconId: 'file-analytics',
      route: '/reports',
      translationKey: 'sidebar.reports'
    },
    {
      label: 'Soporte',
      iconId: 'help-circle',
      route: '/support',
      translationKey: 'sidebar.support'
    }
  ]);

  bonusAction = signal({
    label: 'Bono Techo Propio',
    iconId: 'gift',
    route: '/bonus',
    translationKey: 'sidebar.bonus'
  });
}


