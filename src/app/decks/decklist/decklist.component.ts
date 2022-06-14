import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatSort } from '@angular/material/sort';

import {
  card
} from '../../card/card.component'

export interface deck {
  id: string,
  owner: string,
    name: string,
    hero: card,
    aspect: string,
    created: Date,
    updated: Date,
    cards: card[]
}

@Component({
  selector: 'app-decklist',
  templateUrl: './decklist.component.html',
  styleUrls: ['./decklist.component.scss']
})
export class DecklistComponent implements OnInit {


  constructor() {};

  ngOnInit(): void {
    // this.decks = this.getDecks();
    // this.deckSort.disableClear = true;
  }

  decks: deck[] = [];

  @ViewChild('deckSort') cardSort = new MatSort();

  displayedColumns: string[] = [
    "Name",
    "Hero",
    "Aspect"
  ];

  deckActions: Object[] = [{
    name: 'Edit',
    icon: 'edit',
    functionName: 'editDeck'
  }, {
    name: 'Copy',
    icon: 'file_copy',
    functionName: 'copyDeck'
  }, {
    name: 'Delete',
    icon: 'delete_forever',
    functionName: 'deleteDeck'
  }
];

editDeck(d: deck): void {

}

copyDeck(d: deck): void {

}

deleteDeck(d: deck): void {

}

  // getDecks(): deck[] {
  //   let decks = [{
  //     id: '1',
  //     owner: 'Joe Shmo',
  //     name: 'That good good',
  //     hero: '',
  //     aspect: '',
  //     created: new Date(),
  //     updated: new Date(),
  //     cards: []
  //   }, {
  //     id: '100',
  //     owner: '',
  //     name: '',
  //     hero: '',
  //     aspect: '',
  //     created: new Date(),
  //     updated: new Date(),
  //     cards: []
  //   }];
  // this.dataSource = new MatTableDataSource(decks);
  //         this.dataSource.sort = this.deckSort;
  //   return decks;
  // }

}
