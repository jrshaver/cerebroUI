import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { constants, FilterOption } from 'src/config/constants';

@Injectable({
  providedIn: 'root'
})
export class PackService {

  constructor(private http: HttpClient) { }

  packsUrl = constants.API_ENDPOINT + '/packs?';

  getAllPacks(): Observable < FilterOption[] > {
    return this.http.get < FilterOption[] > (this.packsUrl).pipe(map(packs => packs.map((pack: any) => ({
      name: pack.Name,
      value: pack.Id
    }))));
  }
}
