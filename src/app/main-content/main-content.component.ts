import { Component } from '@angular/core';
import {NgClass} from '@angular/common';

export enum Year{
  Year2023 = '2023',
  Year2025 = '2025',
  Difference = '+/-'
}

@Component({
  selector: 'app-main-content',
  imports: [
    NgClass
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent {

  Year = Year;
  protected selectedYear = Year.Year2025;

  constructor() {
  }

  changeYear(year: Year){
    this.selectedYear = year;
  }

}
