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
  protected selectedPoint: number = 33;

  protected parties: any[] = [];
  protected administrativeUnitsCity: any[] = [];
  protected administrativeUnitsMunicipality: any[] = [];
  protected coordinates: any[] = [];

  protected results2023: any[] = [];
  protected results2025: any[] = [];
  protected resultsDiff: any[] = [];

  protected indices2023 = [0, 1, 2, 3, 4, 5];
  protected indices2025 = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  protected indicesDiff = [18, 19, 20, 21];

  protected showCity: boolean = true;

  constructor(private csvLoader: CsvLoaderService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.csvLoader.loadData(LoadOption.PartyStructure).subscribe(data => {
      this.parties = data;
      console.log('Loaded parties.')
    })
    this.csvLoader.loadData(LoadOption.AdministrativeUnitsCity).subscribe(data => {
      this.administrativeUnitsCity = data;
      console.log('Loaded city proper.')
    })
    this.csvLoader.loadData(LoadOption.AdministrativeUnitsMunicipality).subscribe(data => {
      this.administrativeUnitsMunicipality = data;
      console.log('Loaded municipality.')
    })
    this.csvLoader.loadData(LoadOption.Coordinates).subscribe(data => {
      this.coordinates = data;
      console.log('Loaded polling places.');
    })
    this.csvLoader.loadData(LoadOption.Results2023).subscribe(data => {
      this.results2023 = data;
      console.log('Loaded 2023 results.');
    })
    this.csvLoader.loadData(LoadOption.Results2025).subscribe(data => {
      this.results2025 = data;
      console.log('Loaded 2025 results.');
    })
    this.csvLoader.loadData(LoadOption.ResultsDiff).subscribe(data => {
      this.resultsDiff = data;
      console.log('Loaded result differences between 2023 and 2025.');
    })
  }

  switchMap(){
    this.showCity = !this.showCity;
  }

  activeMap(){
    if(this.selectedYear === Year.Year2023) {
      return this.selected_2023;
    }
    if(this.selectedYear === Year.Year2025) {
      return this.selected_2025;
    }
    else {
      return this.selected_diff;
    }
  }

  hexcode(){
    return this.parties[this.activeMap() - 1].hexcode;
  }

  opacity(point: number){
    let party = this.parties[this.activeMap() - 1];
    let percentage = this.percentage(point);
    return (percentage - party.min_percentage) / (party.max_percentage - party.min_percentage);
  }

  hexcodeDiff(point: number){
    let percentage = this.percentage(point);

    // Clamp between -50 and +50
    const clamped = Math.max(-50, Math.min(50, percentage));

    // Normalize to 0-1 range (how far from white)
    const intensity = Math.abs(clamped) / 50;

    // Start from white (255, 255, 255) and move toward lighter red or green
    if (clamped < 0) {
      // Negative: white → light red (255, 100, 100)
      const red = 255;
      const green = Math.round(255 - (155 * intensity));
      const blue = Math.round(255 - (155 * intensity));
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      // Positive: white → light green (100, 255, 100)
      const red = Math.round(255 - (155 * intensity));
      const green = 255;
      const blue = Math.round(255 - (155 * intensity));
      return `rgb(${red}, ${green}, ${blue})`;
    }
  }

  opacityDiff(){
    return 0.7;
  }

  percentage(point: number){
    let party = this.parties[this.activeMap() - 1];
    if(this.selectedYear === Year.Year2023) {
      return this.results2023[point-1][party.party_percentage_column];
    }
    if(this.selectedYear === Year.Year2025) {
      return this.results2025[point-1][party.party_percentage_column];
    }
    else {
      return this.resultsDiff[point-1][party.party_percentage_column];
    }
  }

  partyName(id: number){
    return this.parties[id].party;
  }

  partyVotes(id: number){
    let party = this.parties[id];
    if(this.selectedYear === Year.Year2023) {
      return this.results2023[this.selectedPoint][party.party_percentage_column];
    }
    if(this.selectedYear === Year.Year2025) {
      return this.results2025[this.selectedPoint][party.party_percentage_column];
    }
    else {
      return this.resultsDiff[this.selectedPoint][party.party_percentage_column];
    }
  }

  partyPercentage(id: number){
    let party = this.parties[id];
    if(this.selectedYear === Year.Year2023) {
      return this.results2023[this.selectedPoint][party.party_votes_column];
    }
    if(this.selectedYear === Year.Year2025) {
      return this.results2025[this.selectedPoint][party.party_votes_column];
    }
    else {
      return this.resultsDiff[this.selectedPoint][party.party_votes_column];
    }
  }

  click(point: number){
    this.selectedPoint = point;
  }

  __(key: string): string {
    return this.translateService.translate('map.' + key);
  }

  protected readonly Year = Year;
}
