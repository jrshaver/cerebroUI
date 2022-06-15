import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getPrintingsData(card: any, dataSet: any[], printingColumn: string): string[] {
    return dataSet.filter((dataPoint) => {
      return card.Printings.some((printing: any) => printing[printingColumn] == dataPoint.value);
    }).map(printing => printing.name).sort();
  }

}
