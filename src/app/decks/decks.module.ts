import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

import { DecksRoutingModule } from './decks-routing.module';
import { DecklistComponent } from './decklist/decklist.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';

@NgModule({
  declarations: [
    DecklistComponent,
    DeckEditorComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    DecksRoutingModule
  ]
})
export class DecksModule { }
