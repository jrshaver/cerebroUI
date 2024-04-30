import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeckImportComponent } from '../deck-import/deck-import.component';
import { DeckService } from '../../services/deck.service';
import { ToastService } from '../../services/toast.service';
import { TokenService } from '../../services/token.service';
import { SetService } from '../../services/set.service';

export interface deck {
  _id?: string,
  authorId: string,
  cards: any[],
  cardCount?: number,
  description: string,
  isPublic: boolean,
  title: string,
  heroSetId: string,
  heroId?: string,
  isOfficial: boolean,
  aspects: string[],
  created?: string,
  updated?: string
}

interface deckAction {
  name: string,
  icon: string,
  functionName: string
}

@Component({
  selector: 'app-decklist',
  templateUrl: './decklist.component.html',
  styleUrls: ['./decklist.component.scss']
})
export class DecklistComponent implements OnInit {

  pageTitle: string = 'Explore Decks';
  decks: deck[] = [];
  dataSource: any;

  displayedColumns: string[] = [
    "title",
    "aspects",
    "updated"
  ];

  loggedInUserId!: string;

  showActions: boolean = false;

  deckActions: deckAction[] = [{
    name: 'Edit',
    icon: 'edit',
    functionName: 'editDeck'
  }, {
    name: 'Copy',
    icon: 'copy',
    functionName: 'copyDeck'
  }, {
    name: 'Delete',
    icon: 'trash',
    functionName: 'deleteDeck'
  }];

  combinedTableColumns = this.displayedColumns.concat(this.deckActions.map((action: any) => action.name));

  constructor(
    private deckService: DeckService,
    private setService: SetService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastService: ToastService,
    private tokenService: TokenService) { };

  ngOnInit(): void {
    this.loggedInUserId = this.tokenService.getToken();
    this.getDecks();
  }

  doAction(action: string, deck: deck): void {
    let actionSearch = this.deckActions.find((deckAction) => deckAction.name == action);
    if (actionSearch) {
      let functionName = actionSearch.functionName;
      switch (functionName) {
        case 'editDeck':
          this.editDeck(deck);
          break;
        case 'copyDeck':
          this.copyDeck(deck);
          break;
        case 'deleteDeck':
          this.deleteDeck(deck);
          break;
      }
    }
  }

  newDeck(): void {
    let maxDecks = 100;
    if (this.decks && this.decks.length >= maxDecks) {
      this.toastService.show('You are only allowed to have ' + maxDecks + ' decks. Please make room if you\'d like to create another one');
      return;
    }
    this.router.navigate(['./view', {
      id: -1
    }], {
      relativeTo: this.route
    });
  }

  editDeck(deck: deck): void {
    this.router.navigate(['./view', {
      id: deck._id
    }], {
      relativeTo: this.route
    })
  }

  copyDeck(deck: deck): void {
    this.deckService.copyDeck(deck).subscribe((response) => {
      if (response && response._id) {
        this.router.navigate(['decks/view', {
          id: response._id
        }])
      } else {
        this.toastService.show('There was an error, please try again later.')
      }
    });
  }

  deleteDeck(deck: deck): void {
    let deckIdToRemove = deck._id;
    if (deckIdToRemove) {
      let deleteConfirmation = confirm("Are you sure you would like to delete " + deck.title + "? This action cannot be undone.");
      if (deleteConfirmation) {
        this.deckService.deleteDeck(deckIdToRemove).subscribe((response) => {
          this.decks = this.decks.filter((aDeck) => aDeck._id != deckIdToRemove);
        });
      }
    }
  }

  openImportModal(): void {
    this.modalService.open(DeckImportComponent);
  }

  getDecks(): void {
    this.route.paramMap.subscribe(paramMap => {
      console.log(paramMap);
      let userId = paramMap.get('userId');
      console.log(userId);
      if (userId) {
        this.pageTitle = 'My Decks (0)';
        this.deckService.getUserDecks(userId).subscribe((decks) => {
          console.log(decks);
          this.setDecks(decks);
          this.pageTitle = 'My Decks (' + decks.length + ')';
        });
      } else {
        this.deckService.getAllDecks().subscribe((decks) => this.setDecks(decks));
      }
    });
  }

  setDecks(decks: deck[]): void {
    this.decks = decks;
    this.decks = decks.map((deck) => {
      console.log(deck);
      //Get Hero ID from heroSetId
      if (deck.heroSetId) {
        this.setService.getSetById(deck.heroSetId).subscribe((set) => {
          console.log(set);
        })
      }
      //Convert epoch time
      if (deck.updated) {
        deck.updated = new Date(Number(deck.updated)).toLocaleDateString();
      }
      //Ensure Aspects array exists
      // deck.aspects = deck.aspects ? deck.aspects : [];
      console.log(deck);
      return deck;
    });
  }

  getDisplayValue(row: any, col: string): string {
    if (col == 'hero') {
      return row[col];
    } else {
      return row[col];
    }
  }

}
