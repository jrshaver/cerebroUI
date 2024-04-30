import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  Observable
} from 'rxjs';
import {
  stopWords
} from '../../config/stopwords';
import {
  constants
} from '../../config/constants'
import { card } from '../shared/card/card.component';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) {}

  cardsUrl = constants.API_ENDPOINT + '/cards?';
  queryUrl = constants.API_ENDPOINT + '/query?';

  stopWordsRegex = new RegExp('\\b(' + stopWords + ')\\b', 'gi');
  relatableFields = ['Name', 'Rules', 'Subname', 'Traits'];

  globalDefaultQuery = '&-classification:"encounter"&official:"true"&incomplete:"false"';

  getCards(query: string): Observable < card[] > {
    return this.http.get < card[] > (this.cardsUrl + query + this.globalDefaultQuery);
  }

  queryWithInput(query: string): Observable < card[] > {
    return this.http.get < card[] > (this.queryUrl + 'input=' + encodeURIComponent(query + this.globalDefaultQuery));
  }

  getAllCards(): Observable < card[] > {
    return this.getCards('');
  }

  getCardsByIds(cardIds: string[]): Observable < card[] > {
    let query = 'id:"' + cardIds.join('"|id:"') + '"';
    return this.queryWithInput(query);
  }

  getCardsFromSetId(setId: string): Observable < card[] > {
    return this.http.get < card[] > (this.cardsUrl + 'set=' + setId);
  }

  getKeywords(card: any): Object[] {
    let keywords = [];
    for (let field of this.relatableFields) {
      if (card[field]) {
        keywords.push({
          [field]: this.sanitizeKeywords(card[field].toString())
        });
      }
    }
    return keywords;
  }

  sanitizeKeywords(cardValue: string): string {
    cardValue = cardValue.replace(this.stopWordsRegex, '');
    console.log(cardValue);
    return cardValue;
  }

}
