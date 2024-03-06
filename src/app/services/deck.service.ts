import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Observable
} from 'rxjs/internal/Observable';
import {
  deck
} from '../decks/decklist/decklist.component';
import { constants } from '../../config/constants';
import {
  TokenService
} from './token.service';
import {
  CardService
} from './card.service';
import {
  Router
} from '@angular/router';
import {
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  decksUrl = constants.API_ENDPOINT + '/decks'

  HTTP_HEADERS = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + constants.BEARER_TOKEN
  });

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private cardService: CardService,
    private router: Router) {}

  searchDecks(query: string): Observable < deck[] > {
    console.log(query);
    return this.http.get < deck[] > (this.decksUrl + '?' + query);
  }

  getAllDecks(): Observable < deck[] > {
    return this.http.get < deck[] > (this.decksUrl + '?isPublic=true');
  }

  getUserDecks(user: string): Observable < deck[] > {
    return this.http.get < deck[] > (this.decksUrl + "?authorId=" + user);
  }

  getDeckById(id: string): Observable < deck > {
    return this.http.get < deck > (this.decksUrl + "/" + id);
  }

  createDeck(deck: deck): Observable < deck > {
    return this.http.post < deck > (this.decksUrl, deck, {
      headers: this.HTTP_HEADERS
    });
  }

  updateDeck(deck: deck): Observable < deck > {
    return this.http.post < deck > (this.decksUrl, deck, {
      headers: this.HTTP_HEADERS
    });
  }

  deleteDeck(id: string): Observable < Object > {
    return this.http.delete(this.decksUrl + "/" + id, {
      headers: this.HTTP_HEADERS
    });
  }

  copyDeck(deck: deck): Observable < deck > {
    deck.title = "Copy of " + deck.title;
    deck.authorId = this.tokenService.getToken() || '';
    if (deck._id) {
      delete deck._id;
    }
    return this.createDeck(deck);
  }

  importDeck(cdbId: string, modal: NgbActiveModal) {
    return this.http.get('https://marvelcdb.com/api/public/deck/' + cdbId).subscribe((response: any) => {
      console.log(response);
      //
      this.cardService.getCards('name=Scarlet Witch&type=hero').subscribe((card: any) => {
        let cards: typeof card[] = [];
        let cdbCardsObject = response.slots;
        Object.keys(cdbCardsObject).forEach((cardId) => {
          cards.push({
            id: cardId,
            quantity: cdbCardsObject[cardId]
          })
        });
        console.log(card);
        let cerebroDeckObject: deck = {
          aspects: this.parseAspects(response),
          authorId: this.tokenService.getToken(),
          description: response.description_md,
          heroSetId: card[0].Printings[0].SetId,
          isOfficial: true,
          isPublic: true,
          title: response.name,
          cards: cards
        };
        this.createDeck(cerebroDeckObject).subscribe((deck: deck) => {
          modal.close();
          this.router.navigate(['decks/view', {
            id: deck._id
          }])
        })
      })
    })
  }

  parseAspects(response: any): string[] {
    let aspects: string[] = [];
    let metaObject = JSON.parse(response.meta); //"{\"aspect\":\"aggression\",\"aspect2\":\"leadership\"}"
    Object.keys(metaObject).forEach((key) => {
      if (key.indexOf('aspect') > -1) {
        let aspect = metaObject[key];
        aspects.push(aspect.charAt(0).toUpperCase() + aspect.slice(1))
      }
    })
    return aspects;
  }

}
