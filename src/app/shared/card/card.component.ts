import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface card {
  quantity?: number,
  Queries: any;
  checked?: boolean,
  Deleted: boolean,
    Id: string,
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
    Name: string,
    Packs: string[] | null,
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
    Sets: string[] | null,
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

  @Input() cards: Array<card> = [];
  @Input() currentCardIndex: number = 0;

  card!: card;
  isLoading: boolean = false;
  enablePreviousButton: boolean = false;
  enableNextButton: boolean = false;
  enableRelatedCards: boolean = true;

  // @Output() findRelatedCardsEvent: EventEmitter<any> = new EventEmitter();

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    console.log(this.cards);
    console.log(this.currentCardIndex);
    this.card = this.cards[this.currentCardIndex];
    this.onCardChange(this.card);
  }

  onCardChange(newCard: card): void {
    this.enablePreviousButton = this.currentCardIndex > 0;
    this.enableNextButton = this.currentCardIndex < this.cards.length - 1;
  }

  goToCard(distance: number): void {
    let newIndex = this.currentCardIndex + distance;
    if (newIndex > -1 && newIndex < this.cards.length) {
      this.currentCardIndex = newIndex;
      this.card = this.cards[newIndex];
      this.onCardChange(this.card);
    }
  }

  findRelatedCards(card: card): void {
    // this.findRelatedCardsEvent.emit(card);
    this.activeModal.close(card);
  }

}
