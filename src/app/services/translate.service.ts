import { Injectable } from '@angular/core';
import {Language, LanguageService} from './language.service';

const TRANSLATIONS : { [key: string]: Record<Language, string> } = {
  'header.test': {
    'sq': 'KONTAKTO',
    'en': 'CONTACT'
  },
}

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private baseLanguage = Language.Albanian;

  constructor(private languageService: LanguageService) { }

  public translate(key: string): string {
    const translations = TRANSLATIONS[key];
    return translations[this.languageService.getCurrentLanguage()] || translations[this.baseLanguage];
  }
}
