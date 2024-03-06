import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { constants, FilterOption } from '../../config/constants';

@Injectable({
  providedIn: 'root'
})
export class PackService {

  constructor(private http: HttpClient) { }

  packsUrl = constants.API_ENDPOINT + '/packs?';

  getAllPacks(): Observable < FilterOption[] > {
    return this.http.get < FilterOption[] > (this.packsUrl + 'deleted=false').pipe(map(packs => packs.map((pack: any) => ({
      name: pack.Name,
      value: pack.Id
    })).sort((a, b) => a.name.localeCompare(b.name))));
  }
}
