import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DecksRoutingModule } from './decks-routing.module';
import { DecklistComponent } from './decklist/decklist.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { SharedModule } from '../shared/shared.module';
import { DeckImportComponent } from './deck-import/deck-import.component';

@NgModule({
  declarations: [
    DecklistComponent,
    DeckEditorComponent,
    DeckImportComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    DecksRoutingModule,
    SharedModule
  ]
})
export class DecksModule { }
