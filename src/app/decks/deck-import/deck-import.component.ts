import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeckService } from '../../services/deck.service';

@Component({
  selector: 'app-deck-import',
  templateUrl: './deck-import.component.html',
  styleUrls: ['./deck-import.component.scss']
})
export class DeckImportComponent {

  importError: string = '';
  id: string = '';

	constructor(public activeModal: NgbActiveModal, private deckService: DeckService) {}

  importDeck(): void {
    console.log(this.id)
    if (!this.id) {
      this.importError = 'Please enter a deck ID';
    } else {
      this.deckService.importDeck(this.id, this.activeModal);
    }
  }

}
