import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecklistComponent } from './decklist/decklist.component';

const routes: Routes = [{ path: '', component: DecklistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
