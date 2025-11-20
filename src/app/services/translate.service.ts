import { Injectable } from '@angular/core';
import {Language, LanguageService} from './language.service';

const TRANSLATIONS : { [key: string]: Record<Language, string> } = {
  'header.description': {
    'sq': 'Rezultatet e zgjedhjeve vendore të 2023 dhe të zgjedhje parlamentare të 2025 në bashkinë e Tiranës sipas ' +
          'vendndodhjes së qendrave të votimit.',
    'en': 'Results of the 2023 local elections and the 2025 parliamentary elections in the municipality of Tirana ' +
          'according to the location of the polling stations.'
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
