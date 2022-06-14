import {
  Component,
  Input,
  OnInit,
  Renderer2
} from '@angular/core';

import {
  deck
} from '../decklist/decklist.component';

import {
  card
} from '../../card/card.component';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-deck-editor',
  templateUrl: './deck-editor.component.html',
  styleUrls: ['./deck-editor.component.scss']
})
export class DeckEditorComponent implements OnInit {

  @Input() deck!: deck;

  availableCards!: card[];

  // availableCards: card[] = [{"Deleted":false,"Id":"04045","Official":true,"AuthorId":null,"Acceleration":null,"Artists":["3e3362c5-7df9-4347-ae06-895096452927","991a7854-6767-4466-9da0-2011b40bd897","30fa849b-c2f0-4a63-ae1a-47533b7b21d9"],"Attack":"2 {d}","Boost":null,"Classification":"Justice","Cost":"5","Defense":null,"Flavor":"\"Seriously, what is it with New York? Would it kill you to invade Denver once?\"","GroupId":null,"Hand":null,"Health":"4","Incomplete":false,"Name":"Spider-Man","Printings":[{"ArtificialId":"04045","PackId":"e4ee70f4-cf18-423e-961a-1aff84decc72","PackNumber":"45","SetId":null,"SetNumber":null,"UniqueArt":true}],"Recover":null,"Resource":"{m}","Rules":"Response: After you play Spider-Man from your hand, remove 3{i} threat from a side scheme.","Scheme":null,"Slash":false,"Special":null,"Stage":null,"StartingThreat":null,"Subname":"Peter Parker","TargetThreat":null,"Thwart":"2 {d}","Traits":["Avenger"],"Type":"Ally","Unique":true},{"Deleted":false,"Id":"13019","Official":true,"AuthorId":null,"Acceleration":null,"Artists":null,"Attack":"2 {d}","Boost":null,"Classification":"Basic","Cost":"3","Defense":null,"Flavor":"\"I'm needed. And just like that, none of the rest of it matters.\"","GroupId":null,"Hand":null,"Health":"3","Incomplete":false,"Name":"Spider-Man","Printings":[{"ArtificialId":"13019","PackId":"10fa18e0-58cb-4e83-9b1d-51bb8c087016","PackNumber":"19","SetId":null,"SetNumber":null,"UniqueArt":true}],"Recover":null,"Resource":"{p}","Rules":"Response: After you play Spider-Man from your hand, choose THW or ATK. Spider-Man gets +2 to the chosen power until the end of the phase.","Scheme":null,"Slash":false,"Special":null,"Stage":null,"StartingThreat":null,"Subname":"Miles Morales","TargetThreat":null,"Thwart":"1 {d}","Traits":["Champion"],"Type":"Ally","Unique":true},{"Deleted":false,"Id":"01001A","Official":true,"AuthorId":null,"Acceleration":null,"Artists":null,"Attack":"2","Boost":null,"Classification":"Hero","Cost":null,"Defense":"3","Flavor":"\"Just your friendly neighborhood Spider-Man!\"","GroupId":null,"Hand":"5","Health":"10","Incomplete":false,"Name":"Spider-Man","Printings":[{"ArtificialId":"01001A","PackId":"25ab9c3e-d172-4501-87b6-40e3768cb267","PackNumber":"1A","SetId":"fe0f49aa-d3b4-4604-a43c-eaa18bbe1601","SetNumber":null,"UniqueArt":true}],"Recover":null,"Resource":null,"Rules":"Spider-Sense — Interrupt: When the villain initiates an attack against you, draw 1 card.","Scheme":null,"Slash":false,"Special":null,"Stage":null,"StartingThreat":null,"Subname":"Peter Parker","TargetThreat":null,"Thwart":"1","Traits":["Avenger"],"Type":"Hero","Unique":true},{"Deleted":false,"Id":"01001B","Official":true,"AuthorId":null,"Acceleration":null,"Artists":["56d1c3cc-10a1-4772-a452-f558cde0211c"],"Attack":null,"Boost":null,"Classification":"Hero","Cost":null,"Defense":null,"Flavor":"\"Right now, I'd trade the whole Spider-Man bit for a rocking chair and a good book.\"","GroupId":null,"Hand":"6","Health":"10","Incomplete":false,"Name":"Peter Parker","Printings":[{"ArtificialId":"01001B","PackId":"25ab9c3e-d172-4501-87b6-40e3768cb267","PackNumber":"1B","SetId":"fe0f49aa-d3b4-4604-a43c-eaa18bbe1601","SetNumber":null,"UniqueArt":true}],"Recover":"3","Resource":null,"Rules":"Scientist — Resource: Generate a {m} resource. (Limit once per round.)","Scheme":null,"Slash":false,"Special":null,"Stage":null,"StartingThreat":null,"Subname":"Spider-Man","TargetThreat":null,"Thwart":null,"Traits":["Genius"],"Type":"Alter-Ego","Unique":true}];

  cardSelection: card[] = [];

  hoverCard!: card | null;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}

  //Card functions
  addCard(card: card): void {
    console.log(card);
    // this.availableCards.splice(this.availableCards.indexOf(card), 1);
    this.cardSelection.push(card);
    console.log(this.cardSelection);
  }

  removeCard(card: card): void {
    // this.availableCards.push(card);
    this.cardSelection.splice(this.cardSelection.indexOf(card), 1);
  }

  drop(event: CdkDragDrop<card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  mouseEnter(card: card): void {
    this.hoverCard = card;
  }

  mouseLeave(): void {
    this.hoverCard = null;
  }

  //Deck functions
  cloneDeck(deck: deck): void {

  }

  deleteDeck(deck: deck): void {

  }

}
