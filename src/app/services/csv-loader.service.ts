import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';
import Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class CsvLoaderService {

  constructor(private http: HttpClient) { }

  loadParties(){
    let filePath = 'assets/data/party_structure.csv';

    return this.http.get(filePath, { responseType: 'text'})
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
