import {Component, OnInit} from '@angular/core';
import {NgClass, NgForOf, SlicePipe} from '@angular/common';
import {CsvLoaderService, LoadOption} from '../services/csv-loader.service';
import {TranslateService} from '../services/translate.service';
import {MapComponent} from '../map/map.component';

export enum Year{
  Year2023 = '2023',
  Year2025 = '2025',
  Difference = '+/-'
}

@Component({
  selector: 'app-main-content',
  imports: [
    NgClass,
    SlicePipe,
    NgForOf,
    MapComponent
  ],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.scss'
})
export class MainContentComponent implements OnInit{

  Year = Year;
  protected selectedYear = Year.Year2025;
  protected parties: any[] = [];
  protected main_parties: any[] = [];

  protected selected_2023: number = 1;
  protected selected_2025: number = 7;
  protected selected_diff: number = 18;
  protected smallParties: boolean = false;

  constructor(private csvLoader: CsvLoaderService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.csvLoader.loadParties(LoadOption.PartyStructure).subscribe(data => {
      this.parties = data;

      const indices = [6, 7, 10, 11, 15, 16];
      this.main_parties = this.parties.filter((party, index) => indices.includes(index));
    })
  }

  changeYear(year: Year){
    this.selectedYear = year;
  }

  select_2023(id: number){
    this.selected_2023 = id;
  }

  select_2025(id: number){
    this.selected_2025 = id;
  }

  select_diff(id: number){
    this.selected_diff = id;
  }

  showSmallParties(){
    this.smallParties = true;
  }

  hideSmallParties() {
    this.smallParties = false;
  }

  __(key: string): string {
    return this.translateService.translate('main.' + key);
  }

}
