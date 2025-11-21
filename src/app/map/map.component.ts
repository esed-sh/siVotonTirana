import {Component, Input, OnInit} from '@angular/core';
import {CsvLoaderService, LoadOption} from '../services/csv-loader.service';
import {NgForOf} from '@angular/common';
import {TranslateService} from '../services/translate.service';
import {Year} from '../main-content/main-content.component';

@Component({
  selector: 'app-map',
  imports: [
    NgForOf
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{

  @Input() selected_2023!: number;
  @Input() selected_2025!: number;
  @Input() selected_diff!: number;
  @Input() selectedYear!: Year.Year2023 | Year.Difference | Year.Year2025;

  protected administrativeUnitsCity: any[] = [];
  protected administrativeUnitsMunicipality: any[] = [];
  protected coordinates: any[] = [];
  protected municipality_coordinates: any[] = [];

  protected results2023: any[] = [];
  protected results2025: any[] = [];
  protected resultsDiff: any[] = [];

  protected showCity: boolean = true;

  constructor(private csvLoader: CsvLoaderService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.csvLoader.loadData(LoadOption.AdministrativeUnitsCity).subscribe(data => {
      this.administrativeUnitsCity = data;
      console.log(data)
    })
    this.csvLoader.loadData(LoadOption.AdministrativeUnitsMunicipality).subscribe(data => {
      this.administrativeUnitsMunicipality = data;
      console.log(data)
    })
    this.csvLoader.loadData(LoadOption.Coordinates).subscribe(data => {
      this.coordinates = data;
      console.log(data);
    })
    this.csvLoader.loadData(LoadOption.Results2023).subscribe(data => {
      this.results2023 = data;
      console.log(data);
    })
    this.csvLoader.loadData(LoadOption.Results2025).subscribe(data => {
      this.results2025 = data;
      console.log(data);
    })
    this.csvLoader.loadData(LoadOption.ResultsDiff).subscribe(data => {
      this.resultsDiff = data;
      console.log(data);
    })
  }

  click(name: string){
    console.log('Clicking: ' + name)
  }

  switchMap(){
    this.showCity = !this.showCity;
  }

  __(key: string): string {
    return this.translateService.translate('map.' + key);
  }
}
