import {
  Component,
  OnInit
} from '@angular/core';

import {
  CardService
} from '../services/card.service';

import {
  card
} from '../card/card.component';

import {
  map,
  startWith,
  tap
} from 'rxjs/operators';

import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  PackService
} from '../services/pack.service';
import {
  SetService
} from '../services/set.service';

import Fuse from 'fuse.js';
import {
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {
  constants,
  FilterOption
} from 'src/config/constants';

@Component({
  selector: 'app-cui-search',
  templateUrl: './cui-search.component.html',
  providers: [CardService],
  styleUrls: ['./cui-search.component.scss']
})
export class CuiSearchComponent implements OnInit {

  cards: card[] | Fuse.FuseResult < card > [] = [];
  error: string = '';
  isLoading: boolean = false;
  form!: FormGroup;

  //Observable filters
  setOptions!: FilterOption[];
  filteredSets!: Observable < FilterOption[] > ;
  private filteredSetOptionsSubject = new BehaviorSubject < FilterOption[] > ([]);
  packOptions!: FilterOption[];
  filteredPacks!: Observable < FilterOption[] > ;
  private filteredPackOptionsSubject = new BehaviorSubject < FilterOption[] > ([]);
  filteredTraits!: Observable < string[] > ;
  filteredTypes!: Observable < string[] > ;

  //Static filters
  CLASSIFICATIONS: string[] = constants.filters.CLASSIFICATIONS.sort();
  COSTS: string[] = constants.filters.COSTS;
  TRAITS: string[] = constants.filters.TRAITS.sort();
  TYPES: string[] = constants.filters.TYPES.sort();
  ORIGINS: string[] = constants.filters.ORIGINS;

  constructor(private formBuilder: FormBuilder,
    private cardSevice: CardService,
    private packService: PackService,
    private setService: SetService) {}

  ngOnInit(): void {
    this.filteredPacks = this.filteredPackOptionsSubject.asObservable();
    this.filteredSets = this.filteredSetOptionsSubject.asObservable();
    this.form = this.formBuilder.group({
      name: [],
      text: [],
      classification: [],
      cost: [],
      resource: [],
      traits: [],
      type: [],
      pack: [],
      set: [],
      origin: []
    });
    this.packService.getAllPacks().subscribe(packs => {
      packs = packs.sort((a, b) => (a.name < b.name ? -1 : 1));
      this.packOptions = packs;
      this.filteredPacks = this.form.controls['pack'].valueChanges.pipe(
        startWith(''),
        map(value => value && value.length >= 1 ? this.filterPacks(value) : packs)
      )
    });
    this.setService.getAllSets().subscribe(sets => {
      sets = sets.sort((a, b) => (a.name < b.name ? -1 : 1));
      this.setOptions = sets;
      this.filteredSets = this.form.controls['set'].valueChanges.pipe(
        startWith(''),
        map(value => value && value.length >= 1 ? this.filterSets(value) : sets)
      )
    });

    this.filteredTraits = this._setFilter('traits', this.TRAITS);
    this.filteredTypes = this._setFilter('type', this.TYPES);
  }

  filterPacks(value: string) {
    const filterValue = value.toLowerCase();
    return this.packOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  filterSets(value: string) {
    const filterValue = value.toLowerCase();
    return this.setOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  handleChildEvent(eventObj: any) {
    switch (eventObj.event) {
      case 'isLoading':
        this.isLoading = eventObj.data;
        break;
      case 'error':
        this.error = eventObj.data;
        break;
    }
  }

  search(): void {
    this.error = '';
    this.isLoading = true;
    console.log(this.form.value);
    let entries = Object.entries(this.form.value);
    if (!entries.some((entry) => entry[1])) {
      this.error = 'Please include at least one search parameter';
      this.isLoading = false;
      return;
    }
    // let query = entries.map(field => field.join('=')).join('&');
    let query: string = entries.reduce((querySet: Object[], field: any) => {
      if (field[1]) {
        if (typeof field[1] == 'object') {
          field[1] = field[1].value;
        }
        querySet.push(field.join('='));
      }
      return querySet;
    }, []).join('&');
    console.log(query);
    this.cardSevice.getCards(query)
      .subscribe({
        next: cards => {
          console.log(cards);
          if (cards.length == 0) {
            this.error = 'No cards were found.';
            return;
          }
          this.setCards(cards);
        },
        error: err => {
          console.log(err);
          this.error = 'Unknown system error, please try again later'
          this.isLoading = false;
          throw new Error(err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  setCards(cards: card[]): void {
    this.cards = cards.map((card: any) => ({
      ...card,
      Packs: this.getPrintingsData(card, this.packOptions, 'PackId'),
      Sets: this.getPrintingsData(card, this.setOptions, 'SetId')
    }))
  }

  getPrintingsData(card: card, dataSet: any[], printingColumn: string): string[] {
    return dataSet.filter((dataPoint) => {
      return card.Printings.some((printing: any) => printing[printingColumn] == dataPoint.value);
    }).map(printing => printing.name).sort();
  }

  getPackOptions(): Observable < FilterOption[] > {
    return this.packService.getAllPacks()
      .pipe(map(packs => packs.map((pack: any) => ({
          name: pack.Name,
          value: pack.Id
        }))),
        tap((packs: any) => {
          this.filteredPackOptionsSubject.next(packs);
        }))
  }

  getSetOptions(): Observable < FilterOption[] > {
    return this.setService.getAllSets()
      .pipe(map(sets => sets.map((pack: any) => ({
          name: pack.Name,
          value: pack.Id
        }))),
        tap((sets: any) => console.log(sets)))
  }

  onAutocompleteKeyUp(searchText: string, packOptions: FilterOption[]): void {
    const lowerSearchText = searchText.toLowerCase();
    this.filteredSetOptionsSubject.next(
      !lowerSearchText ?
      packOptions :
      packOptions.filter((r: any) => r.name.toLocaleLowerCase().includes(lowerSearchText)));
  }

  getAutoCompleteDisplayValue(option: FilterOption): string {
    return option ? option.name : '';
  }

  _setFilter(formField: string, values: string[]) {
    return this.form.controls[formField].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value, values)),
    );
  }

  private _filter(value: string, possibleValues: string[]): string[] {
    if (!value) return possibleValues;
    const filterValue = value.toLowerCase();

    return possibleValues.filter(option => option.toLowerCase().includes(filterValue));
  }
}
