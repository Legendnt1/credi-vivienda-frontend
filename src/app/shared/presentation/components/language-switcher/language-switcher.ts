import {Component, inject, OnInit, signal, ChangeDetectionStrategy} from '@angular/core';
import {TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslateModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitcher implements OnInit {
  protected currentLang = signal<string>('es');

  /** List of available languages with display info */
  protected languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  /** Translation service instance */
  private translate = inject(TranslateService);

  /**
   * Initializes the component and syncs with the current language
   */
  ngOnInit(): void {
    // Get the current language from the translation service
    const currentLanguage = this.translate.currentLang || this.translate.defaultLang || 'es';
    this.currentLang.set(currentLanguage);

    // Subscribe to language changes to keep in sync
    this.translate.onLangChange.subscribe(event => {
      this.currentLang.set(event.lang);
    });
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
    this.currentLang.set(language);
  }
}
