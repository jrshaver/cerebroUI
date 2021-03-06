import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { constants, FilterOption } from 'src/config/constants';

@Injectable({
  providedIn: 'root'
})
export class SetService {

  constructor(private http: HttpClient) { }

  setsUrl = constants.API_ENDPOINT + '/sets?';

  getAllSets(): Observable < FilterOption[] > {
    return this.http.get < FilterOption[] > (this.setsUrl).pipe(map(sets => sets.map((set: any) => ({
      name: set.Name,
      value: set.Id
    }))));
  }
}
