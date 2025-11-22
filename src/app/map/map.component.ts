import {Component, Input, OnInit} from '@angular/core';
import {CsvLoaderService, LoadOption} from '../services/csv-loader.service';
import {NgClass, NgForOf} from '@angular/common';
import {TranslateService} from '../services/translate.service';
import {Year} from '../main-content/main-content.component';
import {Language} from '../services/language.service';

@Component({
  selector: 'app-map',
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit{

  @Input() selected_2023!: number;
  @Input() selected_2025!: number;
  @Input() selected_diff!: number;
  @Input() selectedYear!: Year.Year2023 | Year.Difference | Year.Year2025;
  protected selectedPoint: number = 0;

  @Input() smallParties!: boolean;

  protected parties: any[] = [];
  protected administrativeUnitsCity: any[] = [];
  protected administrativeUnitsMunicipality: any[] = [];
  protected coordinates: any[] = [];

  protected results2023: any[] = [];
  protected results2025: any[] = [];
  protected resultsDiff: any[] = [];

  protected indices2023 = [0, 1, 2, 3, 4, 5];
  protected indices2025 = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  protected indices2025noSmall = [6, 7, 10, 11, 15, 16];
  protected indicesDiff = [17, 18, 19, 20];

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
      this.coordinates = (data as any[]).map((point: any) => ({
        ...point,
        svg_x_njesia: point.svg_x_njesia * 1000,
        svg_y_njesia: point.svg_y_njesia * 1000,
        svg_x_whole: point.svg_x_whole * 1000,
        svg_y_whole: point.svg_y_whole * 1000
      }));

      this.selectedPoint = 225;
      console.log('Loaded polling places.');
    });
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

  activeIndices(){
    if(this.selectedYear === Year.Year2023) {
      return this.indices2023;
    }
    else if(this.selectedYear === Year.Year2025 && this.smallParties) {
      return this.indices2025
    }
    else if(this.selectedYear === Year.Year2025 && !this.smallParties) {
      return this.indices2025noSmall
    }
    else{
      return this.indicesDiff;
    }
  }

  hexcode(){
    return this.parties[this.activeMap() - 1].hexcode;
  }

  opacity(point: number){
    let party = this.parties[this.activeMap() - 1];
    let percentage = this.percentage(point);
    const linear = (percentage - party.min_percentage) / (party.max_percentage - party.min_percentage);
    return 1.35 * Math.pow(linear, 2)
  }

  hexcodeDiff(point: number){
    let percentage = this.percentage(point);

    const clamped = Math.max(-50, Math.min(50, percentage));

    const intensity = Math.abs(clamped) / 50;

    if (clamped < 0) {
      const red = Math.round(255 - (70 * intensity));
      const green = Math.round(255 - (255 * intensity));
      const blue = Math.round(255 - (255 * intensity));
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      const red = Math.round(255 - (255 * intensity));
      const green = Math.round(255 - (100 * intensity));
      const blue = Math.round(255 - (235 * intensity));
      return `rgb(${red}, ${green}, ${blue})`;
    }
  }

  opacityDiff(){
    return 0.8;
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

  partyPercentage(id: number){
    let party = this.parties[id];
    if(this.selectedYear === Year.Year2023) {
      return this.results2023[this.selectedPoint - 1][party.party_percentage_column];
    }
    if(this.selectedYear === Year.Year2025) {
      return this.results2025[this.selectedPoint - 1][party.party_percentage_column];
    }
    else {
      return this.resultsDiff[this.selectedPoint - 1][party.party_percentage_column];
    }
  }

  partyVotes(id: number){
    let party = this.parties[id];
    if(this.selectedYear === Year.Year2023) {
      return this.results2023[this.selectedPoint - 1][party.party_votes_column];
    }
    if(this.selectedYear === Year.Year2025) {
      return this.results2025[this.selectedPoint - 1][party.party_votes_column];
    }
    else {
      return this.resultsDiff[this.selectedPoint - 1][party.party_votes_column];
    }
  }

  formatVotes(votes: number): string {
    return votes > 0 ? `+${votes}` : `${votes}`;
  }

  click(point: number){
    this.selectedPoint = point;
  }

  __(key: string): string {
    return this.translateService.translate('map.' + key);
  }

  protected readonly Year = Year;
  protected readonly Language = Language;
}
