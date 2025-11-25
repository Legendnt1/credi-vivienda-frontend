import {Component, inject} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslateModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {
  protected currentLang: string = 'es';

  /** List of available languages with display info */
  protected languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  /** Translation service instance */
  private translate: TranslateService;

  /**
   * Creates an instance of LanguageSwitcherComponent.
   * Initializes the current language from the translation service.
   */
  constructor() {
    this.translate = inject(TranslateService);
    this.currentLang = this.translate.getCurrentLang();
  }

  /**
   * Changes the application's current language.
   * Updates both the translation service and the component's local state.
   *
   * @param event - The change event from the select element
   */
  useLanguage(event: Event) {
    const target = event.target as HTMLSelectElement;
    const language = target.value;
    this.translate.use(language);
    this.currentLang = language;
  }
}
