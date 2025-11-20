import { Component } from '@angular/core';
import {TranslateService} from '../services/translate.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private translateService: TranslateService) {
  }

  __(key: string): string {
    return this.translateService.translate('header.' + key);
  }
}
