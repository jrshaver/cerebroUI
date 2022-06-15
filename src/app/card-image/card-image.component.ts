import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  constants
} from '../../config/constants'
import {
  card
} from '../card/card.component';

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss']
})
export class CardImageComponent implements OnChanges {

  @Input() card!: card;

  imgUrl: string = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setImgUrl(this.card);
  }

  setImgUrl(card: card): void {
    let imgUrl = constants.CARD_IMG_ENDPOINT;
    imgUrl += card.Official ? '/official/' : '/unofficial/'; //official or unofficial
    imgUrl += card.Id; //card id
    imgUrl += '.jpg'; //File extension
    this.imgUrl = imgUrl;
  }

}
