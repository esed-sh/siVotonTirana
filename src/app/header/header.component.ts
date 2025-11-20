import { Component } from '@angular/core';
import {TranslateService} from '../services/translate.service';
import {Language, LanguageService} from '../services/language.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private translateService: TranslateService,
              private languageService: LanguageService) {
  }

  changeLanguage(lang: Language){
    this.languageService.setCurrentLanguage(lang)
  }

  currentLanguage(){
    return this.languageService.getCurrentLanguage();
  }

  __(key: string): string {
    return this.translateService.translate('header.' + key);
  }

  protected readonly Language = Language;
}
