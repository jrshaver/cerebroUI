import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  OperatorFunction,
  Subject,
  switchMap,
} from 'rxjs';

import { deck } from '../decklist/decklist.component';
import { card } from '../../shared/card/card.component';

import {
  NgbModal,
  NgbModalConfig,
  NgbTypeahead,
  NgbTypeaheadSelectItemEvent
} from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { constants } from '../../../config/constants';
import { SearchComponent } from '../../search/search.component';
import { CardService } from '../../services/card.service';
import { DeckService } from '../../services/deck.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-deck-editor',
  templateUrl: './deck-editor.component.html',
  styleUrls: ['./deck-editor.component.scss'],
})
export class DeckEditorComponent implements OnInit {

  MAX_CARD_COUNT: number = 3;

  VIEWS: string[] = ['Text', 'Stacks'];
  viewAs: string = '';

  isLoggedInUsersDeck: boolean = false;

  deck!: deck;
  officialOnly: boolean = true;

  cardTypes = constants.filters.TYPES;

  // heroesWithDifferentDeckBuilding: { heroName: string; heroSetId: string }[] = [
  //   {
  //     heroName: 'Gamora',
  //     heroSetId: 'cdca7254-c447-402a-863a-6fe6ac9d7aa7',
  //   },
  //   {
  //     heroName: 'Spider-Woman',
  //     heroSetId: '36b9663a-6d1f-4e79-9d17-eb02e840ed87',
  //   },
  //   {
  //     heroName: 'Adam Warlock',
  //     heroSetId: '3dd91f75-3cb4-407f-8797-d9fb430cb4ae',
  //   },
  //   {
  //     heroName: 'Cyclops',
  //     heroSetId: '4db68fa1-e222-4d4e-b06c-16dd9b2fefef',
  //   },
  // ];

  deckView: string = 'Text';

  heroSearch!: OperatorFunction<string, readonly object[]>;

  deckForm!: UntypedFormGroup;
  deckId: string = '';

  availableHeroes: card[] = [];
  filteredHeroes!: Observable<card[]>;
  private filteredHeroesSubject = new BehaviorSubject<card[]>([]);

  isLoading: boolean = true;

  showCard: string | null = '';

  @ViewChild('autoResize') autoResize!: ElementRef;
  @ViewChild('instance') instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  groupedCards: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private deckService: DeckService,
    private cardService: CardService,
    private tokenService: TokenService,
    private formBuilder: UntypedFormBuilder,
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
  ) {
    config.keyboard = false;
    config.size = 'lg';
  }

  ngOnInit(): void {
    this.viewAs = 'Stacks';
    this.deckId = this.route.snapshot.queryParams['id'] || this.route.snapshot.params['id'] || '';
    if (this.deckId && this.deckId != '-1') {
      this.getDeckData(this.deckId);
    } else {
      this.deck = {
        authorId: this.tokenService.getToken(),
        isOfficial: true,
        isPublic: false,
        title: '',
        description: '',
        heroSetId: '',
        aspects: [],
        cards: [],
      };
      this.isLoggedInUsersDeck = true;
      this.isLoading = false;
    }

    this.deckForm = this.formBuilder.group({
      title: ['', Validators.required],
      hero: ['', Validators.required],
      cardCount: '',
      aspects: [[], Validators.required],
      description: '',
      isPublic: false
    });

    this.deckForm.valueChanges.subscribe((changes) => {
      if (this.isLoggedInUsersDeck) {
        console.log(changes);
        this.saveDeck(this.deck);
      }
    });

    setTimeout(() => this.resizeDescription(), 500);
  }

  cardSelected(selectedCard: card): void {
    this.addCard(selectedCard);
    this.groupCards();
    this.saveDeck(this.deck);
  }

  addCard(addedCard: card): void {
    let cardInDeck = this.deck.cards.find(aCard => aCard.Id == addedCard.Id);
    if (cardInDeck) {
      cardInDeck.quantity++;
    } else {
      addedCard.quantity = 1;
      this.deck.cards.push(addedCard);
    }
  }

  removeCard(removedCard: card): void {
    console.log(this.deck);
    this.deck.cards.find((aCard, index) => {
      if (aCard.Id == removedCard.Id) {
        aCard.quantity--;
        if (aCard.quantity == 0) {
          console.log(index);
          this.deck.cards.splice(index, 1);
        }
        console.log(this.deck);
        this.groupCards();
        this.saveDeck(this.deck);
      }
    });
  }

  calculateCardCount(): void {
    let count = 0;
    var cardsLength = this.deck.cards.length;
    for (let i = 0; i < cardsLength; i++) {
      count += this.deck.cards[i].cardCount;
    }

    this.deckForm.get('cardCount')?.patchValue(count, {
      onlySelf: true,
    });
    this.saveDeck(this.deck);
  }

  getDeckData(deckId: string): void {
    //Lookup deck, fetch all cards
    this.deckService.getDeckById(deckId).subscribe((deck) => {
      if (deck.authorId == this.tokenService.getToken()) {
        this.isLoggedInUsersDeck = true;
      } else {
        this.deckForm.disable();
      }
      this.deck = deck;
      this.deckForm.get('title')?.patchValue(deck.title, {
        onlySelf: true,
      });
      this.deckForm.get('description')?.patchValue(deck.description, {
        onlySelf: true,
      });
      this.deckForm.get('isPublic')?.patchValue(deck.isPublic, {
        onlySelf: true,
      });
      // if (deck.heroSetId) {
      //   this.cardService.getCardsFromSetId(deck.heroSetId).subscribe((response) => {
      //     console.log(response);
      //     let hero = response.filter((card) => {
      //       return card.Type == 'Hero';
      //     })[0];
      //     this.deckForm.get('hero')?.patchValue(hero, {
      //       onlySelf: true,
      //     });
      //   });
      // }
      console.log(this.deck);
      console.log(deck);
      if (!deck.cards) {
        deck.cards = [];
        this.isLoading = false;
        return;
      }
      let cardIds = deck.cards.map(({ id }) => id);
      this.cardService.getCardsByIds(cardIds).subscribe((response) => {
        console.log(response);
        console.log(deck.cards);
        this.deck.cards = response.map((cardDetailed) => (
          this.addCard(cardDetailed),
          {...deck.cards.find(
            (cardSimple) => cardSimple.Id == cardDetailed.Id && cardSimple
          ),
          ...cardDetailed,
        }));
        this.groupCards();
        console.log(this.deck.cards);
        this.isLoading = false;
      });
    });
  }

  //Deck functions
  copyDeck(deck: deck): void {
    this.deckService.copyDeck(deck);
  }

  deleteDeck(deck: deck): void {
    if (deck._id) {
      let deleteConfirmation = confirm(
        'Are you sure you would like to delete ' +
        deck.title +
        '? This action cannot be undone.'
      );
      if (deleteConfirmation) {
        this.deckService.deleteDeck(deck._id).subscribe((response) => {
          console.log(response);
          this.router.navigate(['/decks']);
        });
      }
    }
  }

  saveDeck(deck: Readonly<deck>): void {
    if (deck.authorId !== this.tokenService.getToken()) {
      console.log('Nice try, imposter!');
      return;
    }
    console.log(deck);
    let deckCopy = JSON.parse(JSON.stringify(deck));

    deckCopy.cards = deck.cards.flatMap((card) => {
      console.log(card);
      console.log(card.quantity);
      if (card.Id && card.quantity) {
        return {
          id: card.Id,
          quantity: card.quantity,
        };
      } else {
        return [];
      }
    });
    deckCopy.aspects = deckCopy.aspects.length == 0 ? ['none'] : deckCopy.aspects;
    console.log(this.deckId);
    if (this.deckId == '-1') {
      //Create new Deck
      this.deckService.createDeck(deckCopy).subscribe((response) => {
        console.log(response);
        const urlTree = this.router.createUrlTree(['/view'], {
          relativeTo: this.route,
          queryParams: { id: response._id },
          queryParamsHandling: "merge",
          preserveFragment: true
        });
        this.location.go(urlTree.toString());
      });
    } else {
      //Update existing Deck
      this.deckService.updateDeck(deckCopy).subscribe();
    }
  }

  openSearchModal(): void {
    const modalRef = this.modalService.open(SearchComponent);
    modalRef.componentInstance.inModal = true;
    modalRef.componentInstance.cardsToAdd.subscribe((cardsToAdd: any) => {
      cardsToAdd.forEach((card:card) => this.cardSelected(card));
    })
  }

  // setShowCard(cardId?: string): void {
  //   this.showCard = cardId || '';
  // }

  filterHeroes(value: string) {
    const filterValue = value.toLowerCase();
    return this.availableHeroes.filter((option) => {
      let nameMatch = option.Name.toLowerCase().includes(filterValue);
      let subNameMatch = false;
      if (option.Subname) {
        subNameMatch = option.Subname.toLowerCase().includes(filterValue);
      }
      return nameMatch || subNameMatch;
    });
  }

  cardDisplayFn(card: card): string {
    let displayValue = '';
    if (card) {
      if (card.Name) {
        displayValue += card.Name;
      }
      if (card.Subname) {
        displayValue += ' - ' + card.Subname;
      }
      if (card.Classification) {
        displayValue += ', ' + card.Classification;
      }
      if (card.Type) {
        displayValue += ' ' + card.Type;
      }
    }
    return displayValue;
  }

  resizeDescription(): void {
    if (this.autoResize) {
      this.autoResize.nativeElement.style.height = 'auto';
      this.autoResize.nativeElement.style.height = `${this.autoResize.nativeElement.scrollHeight + 4
        }px`;
    }
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(0),
      distinctUntilChanged(),
      switchMap((term) =>
        term.length < 3 ? of([]) : this.cardService.queryWithInput('name:"' + term + '"').pipe(
          catchError(() => {
            return of([]);
          })
        )
      )
    );
  };

  // getAvailableCardsQuery(): string {
  //   let aspects = this.deck.aspects || [
  //     'Aggression',
  //     'Justice',
  //     'Leadership',
  //     'Protection',
  //   ];
  //   let aspectsQuery = '(cl:"Basic"|cl:"' + aspects.join('"|cl:"') + '")';
  //   console.log(aspectsQuery);
  //   console.log(this.deck.cards);
  //   let cardsNamesInDeck = this.deck.cards.map((card) => card.Name);
  //   let cardNameQuery =
  //     '-(name:"Basic"|name:"' + cardsNamesInDeck.join('"|name:"') + '")';
  //   return cardNameQuery + '^' + aspectsQuery + '&';
  // }

  selectedItem($event: NgbTypeaheadSelectItemEvent, input: HTMLInputElement) {
    console.log(arguments)
    $event.preventDefault();
    console.log($event);
    this.cardSelected($event.item);
    input.value = '';
    console.log(this.deck);
  }

  groupCards(): void {
    console.log(this.deck.cards);
    this.deck.aspects = this.deck.cards.map(card => card.Classification)
      .flat()
      .filter((value, index, array) => array.indexOf(value) === index);
    console.log(this.deck.aspects);
    if (!this.deck.cards.length) {
      this.groupedCards = {};
      return;
    }

    let groupedCards: any = _.chain(this.deck.cards)
      .groupBy('Type')
      .forEach((group: any) => {
        group.numberOfCards = group.reduce((total: number, item: card) => total + (item.quantity || 0), 0);
      })
      .value();

    this.groupedCards = Object.assign(groupedCards);
  }

  removeCards(cardColumn: string, excudeValue: string): void {
    this.deck.cards = this.deck.cards.filter(
      (card: any) => card[cardColumn] != excudeValue
    );
  }

  typeaheadFormatter = (x: any) => x.Name || x;
}
