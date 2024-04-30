import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  constants
} from '../../../config/constants'

@Component({
  selector: 'app-card-image',
  templateUrl: './card-image.component.html',
  styleUrls: ['./card-image.component.scss']
})
export class CardImageComponent implements OnChanges {

  @Input() official: boolean = true;
  @Input() cardId: string = '';
  @Input() height: number = 400;

  imgUrl: string = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setImgUrl();
  }

  setImgUrl(): void {
    let imgUrl = constants.CARD_IMG_ENDPOINT;
    imgUrl += this.official ? '/official/' : '/unofficial/'; //official or unofficial
    imgUrl += this.cardId; //card id
    imgUrl += '.jpg'; //File extension
    this.imgUrl = imgUrl;
  }

}
