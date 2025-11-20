import {Component, Input, OnInit} from '@angular/core';
import {CsvLoaderService, LoadOption} from '../services/csv-loader.service';
import {NgForOf} from '@angular/common';
import {TranslateService} from '../services/translate.service';

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

  protected administrativeUnitsCity: any[] = [];
  protected administrativeUnitsMunicipality: any[] = [];

  protected showCity: boolean = false;

  constructor(private csvLoader: CsvLoaderService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.csvLoader.loadParties(LoadOption.AdministrativeUnitsCity).subscribe(data => {
      this.administrativeUnitsCity = data;
      console.log(data)
    })
    this.csvLoader.loadParties(LoadOption.AdministrativeUnitsMunicipality).subscribe(data => {
      this.administrativeUnitsMunicipality = data;
      console.log(data)
    })
  }

  switchMap(){
    this.showCity = !this.showCity;
    console.log(this.showCity)
  }

  __(key: string): string {
    return this.translateService.translate('map.' + key);
  }
}
