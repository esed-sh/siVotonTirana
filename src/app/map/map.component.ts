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
  @Input() selected_other!: number;
  @Input() selectedYear!: Year.Year2023 | Year.Difference | Year.Year2025 | Year.Other;
  protected selectedPoint: number = 0;

  @Input() smallParties!: boolean;

  protected parties: any[] = [];
  protected administrativeUnitsCity: any[] = [];
  protected administrativeUnitsMunicipality: any[] = [];
  protected coordinates: any[] = [];

  protected results2023: any[] = [];
  protected results2025: any[] = [];
  protected resultsDiff: any[] = [];
  protected resultsOther: any[] = [];

  protected indices2023 = [0, 1, 2, 3, 4, 5];
  protected indices2025 = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  protected indices2025noSmall = [6, 7, 10, 11, 15, 16];
  protected indicesDiff = [17, 18, 19, 20];
  protected indicesOther22 = [3, 4];
  protected indicesOther23 = [6, 10];
  protected indicesOther24 = [7, 11, 15];

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
    this.csvLoader.loadData(LoadOption.ResultsOther).subscribe(data => {
      this.resultsOther = data;
      console.log('Loaded other results.');
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
    if(this.selectedYear === Year.Difference) {
      return this.selected_diff;
    }
    else{
      return this.selected_other;
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
    else if(this.selectedYear === Year.Difference){
      return this.indicesDiff;
    }
    else{
      switch (this.selected_other){
        case 22: return this.indicesOther22;
        case 23: return this.indicesOther23;
        default: return this.indicesOther24;
      }
    }
  }

  hexcode(){
    return this.parties[this.activeMap() - 1].hexcode;
  }

  opacity(point: number){
    let party = this.parties[this.activeMap() - 1];
    let percentage = this.percentage(point);
    const linear = (percentage - party.min_percentage) / (party.max_percentage - party.min_percentage);
    return Math.pow(linear, 2)
  }

  hexcodeDiff(point: number){
    let percentage = this.percentage(point);

    const clamped = Math.max(-50, Math.min(50, percentage));
    const intensity = Math.abs(clamped) / 50;

    let negativeColor, positiveColor;

    if (this.selectedYear == Year.Difference) {
      negativeColor = { red: 220, green: 0, blue: 0 };
      positiveColor = { red: 0, green: 140, blue: 0 };
    } else {
      negativeColor = { red: 9, green: 83, blue: 156 };
      positiveColor = { red: 255, green: 0, blue: 255 };
    }

    const baseColor = { red: 255, green: 255, blue: 255 };
    const targetColor = clamped < 0 ? negativeColor : positiveColor;

    const red = Math.round(baseColor.red + (targetColor.red - baseColor.red) * intensity);
    const green = Math.round(baseColor.green + (targetColor.green - baseColor.green) * intensity);
    const blue = Math.round(baseColor.blue + (targetColor.blue - baseColor.blue) * intensity);

    return `rgb(${red}, ${green}, ${blue})`;
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
    if(this.selectedYear === Year.Difference){
      return this.resultsDiff[point-1][party.party_percentage_column];
    }
    else{
      return this.resultsOther[point-1][party.party_percentage_column];
    }
  }

  partyName(id: number){
    return this.parties[id].party;
  }

  partyPercentage(id: number){
    let party = this.parties[id];
    if(this.selectedYear === Year.Year2023 || this.selectedYear === Year.Other && this.selected_other === 22) {
      return this.results2023[this.selectedPoint - 1][party.party_percentage_column];
    }
    if(this.selectedYear === Year.Year2025 || this.selectedYear === Year.Other && this.selected_other === 23
      || this.selectedYear === Year.Other && this.selected_other === 24) {
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
