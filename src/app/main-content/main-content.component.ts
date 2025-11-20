import {Component, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {CsvLoaderService} from '../services/csv-loader.service';

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
export class MainContentComponent implements OnInit{

  Year = Year;
  protected selectedYear = Year.Year2025;
  private parties: any[] = [];

  constructor(private csvLoader: CsvLoaderService) {
  }

  ngOnInit() {
    this.csvLoader.loadParties().subscribe(data => {
      this.parties = data;
      console.log(data);
    })
  }

  changeYear(year: Year){
    this.selectedYear = year;
  }

}
