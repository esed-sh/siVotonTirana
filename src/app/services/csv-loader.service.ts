import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';
import Papa from 'papaparse';

export enum LoadOption{
  PartyStructure = 'assets/data/party_structure.csv',
  AdministrativeUnitsMunicipality = 'assets/svg/region/administrative_units.csv',
  AdministrativeUnitsCity = 'assets/svg/city/administrative_units.csv',
  Coordinates = 'assets/data/tirane_qv_coordinates_extended.csv',
  Results2023 = 'assets/data/coordinate_results_2023.csv',
  Results2025 = 'assets/data/coordinate_results_2025.csv',
  ResultsDiff = 'assets/data/coordinate_results_diff_2023_2025.csv'
}

@Injectable({
  providedIn: 'root'
})
export class CsvLoaderService {

  constructor(private http: HttpClient) { }

  loadData(loadOption: LoadOption){
    return this.http.get(loadOption, { responseType: 'text'})
      .pipe(
        map(csvData => {
          const parsed = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true
          });
          return parsed.data;
        })
      )
  }
}
