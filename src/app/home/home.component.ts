import {
  Component,
  OnInit
} from '@angular/core';

import {
  CardService
} from '../services/card.service';
import {
  Observable,
  catchError,
  combineLatest,
  concat,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  of ,
  switchMap,
  tap
} from 'rxjs';
import {
  card
} from '../shared/card/card.component';
import {
  DeckService
} from '../services/deck.service';
import {
  deck
} from '../decks/decklist/decklist.component';

export interface article {
  title: string,
    body: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  model: any;
  searching = false;
  searchFailed = false;

  homeContainerTitle: string = 'Announcements';
  announcements: article[] = [];

  randomCard!: card;
  topCards: card[] = [];

  constructor(private cardService: CardService, private deckService: DeckService) {}

  ngOnInit(): void {
    this.getTopCards();
    this.getRandomHero();
    // const remoteConfig = getRemoteConfig();
    // remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

    // fetchAndActivate(remoteConfig).then(() => {
    //     const announcementConfig: any = getValue(remoteConfig, "announcements");
    //     const announcementObject = JSON.parse(announcementConfig._value)
    //     this.homeContainerTitle = announcementObject.label;
    //     this.announcements = announcementObject.articles;
    //   })
    //   .catch((e) => {
    //     console.log('Remote Config error: ' + e);
    //   });
  }

  // homeSearch = (text$: Observable < string > ) =>
  // text$.pipe(
  //   debounceTime(300),
  //   distinctUntilChanged(),
  //   tap(() => (this.searching = true)),
  //   switchMap((term) =>
  //     this.deckService.searchDecks("title=" + term).pipe(
  //       tap(() => (this.searchFailed = false)),
  //       catchError(() => {
  //         this.searchFailed = true;
  //         return of([]);
  //       }),
  //     )
  //   ),
  //   switchMap((term) =>
  //     this.cardService.getCards("name=" + term).pipe(
  //       tap(() => (this.searchFailed = false)),
  //       catchError(() => {
  //         this.searchFailed = true;
  //         return of([]);
  //       }),
  //     ),
  //   ),
  //   tap(() => (this.searching = false)),
  // );

  homeSearch = (text$: Observable < string > ) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => (this.searching = true)),
    switchMap((term) =>
      // this.searchCardsAndDecks(term)
      // // concat([
      //   // this.deckService.searchDecks("title=" + term),
        this.cardService.getCards("name=" + term)
      //   this.get
      // // ])
    ))

  // searchCardsAndDecks: Observable < any[] | any[] > = (term: string) => {
  //   return concat(
  //     this.cardService.getCards("name=" + term),
  //     this.deckService.searchDecks("title=" + term)
  //   )
  // }

  getRandomHero(): void {
    this.cardService.getCards('classification=Player')
      .subscribe((playerCards: card[]) => {
        this.randomCard = playerCards[Math.floor(Math.random() * playerCards.length)];
      })
  };

  getTopCards(): void {
    this.cardService.getAllCards().subscribe((cards) => {
      console.log(cards);
      this.topCards = (cards.sort((a, b) => b.Queries - a.Queries)).slice(0, 10);
      console.log(this.topCards);
    })
  }

  formatter = (x: {
    Name: string
  }) => x.Name;
}
