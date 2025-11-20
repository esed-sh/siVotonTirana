import { Injectable } from '@angular/core';

export enum Language{
  English = 'en',
  Albanian = 'sq'
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = Language.Albanian;

  constructor() {
  }

  getCurrentLanguage(){
    return this.currentLanguage;
  }

  setCurrentLanguage(lang: Language){
    this.currentLanguage = lang;
  }
}
