import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CuiSearchComponent } from './cui-search/cui-search.component';
import { DeckEditorComponent } from './deck-editor/deck-editor.component';
import { DecklistComponent } from './decklist/decklist.component';
import { DonateComponent } from './donate/donate.component';
import { HelpComponent } from './help/help.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

/*
Routes:
 /           = home+search
 /decks      = logged in user's decklists
 /decks/view = readonly view of a deck
 /decks/edit = editable view of a deck
*/

const routes: Routes = [{
  path: '',
  component: CuiSearchComponent,
},{
  path: 'decks',
  component: DecklistComponent,
  children: [{
    path: 'view',
    component: DeckEditorComponent
  },{
    path: 'edit',
    component: DeckEditorComponent
  }]
}, {
  path: 'about',
  component: AboutComponent
}, {
  path: 'donate',
  component: DonateComponent
}, {
  path: 'help',
  component: HelpComponent
}, {
  path: '**',
  component: PageNotFoundComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
