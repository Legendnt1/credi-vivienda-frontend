import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-bonus-information',
  imports: [TranslateModule],
  templateUrl: './bonus-information.html',
  styleUrl: './bonus-information.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonusInformation {
  /**
   * External link for more information
   * This can be updated with the actual URL
   */
  readonly moreInfoUrl = 'https://www.mivivienda.com.pe/portalweb/usuario-busca-viviendas/pagina.aspx?idpage=30';

  /**
   * Open external link in new tab
   */
  onMoreInfo(): void {
    window.open(this.moreInfoUrl, '_blank', 'noopener,noreferrer');
  }
}
