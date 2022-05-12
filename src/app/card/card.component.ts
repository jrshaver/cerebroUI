import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output
} from '@angular/core';

import {
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

import {
  CardService
} from '../services/card.service';

import {
  constants
} from '../../config/constants'

import Fuse from 'fuse.js'
import { Router } from '@angular/router';

export interface card {
  Deleted: boolean,
    Id: string | null,
    Official: boolean,
    AuthorId: string | null,
    Acceleration: string | null,
    Artists: string[] | null,
    Attack: string | null,
    Boost: string | null,
    Classification: string | null,
    Cost: string | null,
    Defense: string | null,
    Flavor: string | null,
    GroupId: string | null,
    Hand: string | null,
    Health: string | null,
    Incomplete: boolean,
    Name: string | null,
    Printings: [{
      ArtificialId: string | null,
      PackId: string | null,
      PackNumber: string | null,
      SetId: string | null,
      SetNumber: string | null,
      UniqueArt: boolean
    }],
    Recover: string | null,
    Resource: string | null,
    Rules: string | null,
    Scheme: string | null,
    Slash: boolean,
    Special: string | null,
    Stage: string | null,
    StartingThreat: string | null,
    Subname: string | null,
    TargetThreat: string | null,
    Thwart: string | null,
    Traits: string[] | null,
    Type: string | null,
    Unique: boolean
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Output() showRelatedCards = new EventEmitter<Fuse.FuseResult<card>[]>();

  constructor(private cardSevice: CardService, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
    this.cards = this.data.cards;
    this.currentCardIndex = this.data.currentCardIndex;
    this.card = this.cards[this.data.currentCardIndex];
    this.onCardChange(this.card);
  }

  ngOnInit(): void {}

  onCardChange(newCard: card): void {
    this.enablePreviousButton = this.currentCardIndex > 0;
    this.enableNextButton = this.currentCardIndex < this.cards.length - 1;
  }

  isLoading: boolean = false;
  currentCardIndex: number = 0;
  card: card;
  cards: card[];
  imgUrl: string = '';
  enablePreviousButton: boolean = false;
  enableNextButton: boolean = false;
  enableRelatedCards: boolean = true;

  goToCard(distance: number): void {
    let newIndex = this.currentCardIndex + distance;
    if (newIndex > -1 && newIndex < this.cards.length) {
      this.currentCardIndex = newIndex;
      this.card = this.cards[newIndex];
      this.onCardChange(this.card);
    }
  }

  getRelatedCards(card: card): void {
    this.isLoading = true;
    this.cardSevice.getAllCards().subscribe(cards => {
      console.log(cards);
      const fuse = new Fuse(cards, constants.FUSE_OPTIONS);
      const keywords = this.cardSevice.getKeywords(card);
      const result = fuse.search({ $or: keywords });
      console.log("Fuse Results:");
      console.log(result);
      this.isLoading = false;
      this.loadResults(result);
    });
  }

  loadResults(result: Fuse.FuseResult<card>[]): void {
    this.showRelatedCards.emit(result);
  }

}
