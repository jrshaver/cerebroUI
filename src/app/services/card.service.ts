import {
  Injectable
} from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';
import {
  map,
  Observable,
  Subscription
} from 'rxjs';
import {
  stopWords
} from '../../config/stopwords';

import {
  card
} from '../card/card.component';

import {
  constants
} from '../../config/constants'

import Fuse from 'fuse.js'

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) {}

  cardsUrl = constants.API_ENDPOINT + '/cards?';
  // cardsUrl = '/api/card/';

  stopWordsRegex = new RegExp('\\b(' + stopWords + ')\\b', 'gi');
  relatableFields = ['Name', 'Rules', 'Subname', 'Traits'];

  loadingCards: boolean = false;

  getCards(query: string): Observable < card[] > {
    return this.http.get < card[] > (this.cardsUrl + query + '&incomplete=false')
  }

  getAllCards(): Observable < card[] > {
    return this.getCards('');
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
