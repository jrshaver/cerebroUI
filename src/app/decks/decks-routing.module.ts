import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { DecklistComponent } from './decklist/decklist.component';

const routes: Routes = [{
  path: '',
  component: DecklistComponent
}, {
  path: 'view',
  component: DeckEditorComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DecksRoutingModule { }
