import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DecklistComponent } from './decklist/decklist.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DecklistComponent,
    DeckEditorComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class DecksModule { }
