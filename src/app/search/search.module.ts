import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SharedModule } from '../shared/shared.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { NgbdSortableHeader } from './search-results/search-results.component';

@NgModule({
  declarations: [
    SearchComponent,
    SearchResultsComponent,
    NgbdSortableHeader
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SearchRoutingModule,
    SharedModule,
    NgbModule,
    NgbTypeaheadModule
  ]
})
export class SearchModule { }
