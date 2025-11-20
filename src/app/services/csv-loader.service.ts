import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';
import Papa from 'papaparse';

export enum LoadOption{
  PartyStructure = 'assets/data/party_structure.csv',
  AdministrativeUnitsMunicipality = 'assets/svg/region/administrative_units.csv',
  AdministrativeUnitsCity = 'assets/svg/city/administrative_units.csv'

}

@Injectable({
  providedIn: 'root'
})
export class CsvLoaderService {

  constructor(private http: HttpClient) { }

  loadParties(loadOption: LoadOption){
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
