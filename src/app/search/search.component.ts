import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import {
  CardService
} from '../services/card.service';

import {
  card
} from '../shared/card/card.component';

import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith
} from 'rxjs/operators';

import {
  BehaviorSubject,
  merge,
  Observable,
  OperatorFunction,
  Subject
} from 'rxjs';

import {
  PackService
} from '../services/pack.service';
import {
  SetService
} from '../services/set.service';

import {
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import {
  constants,
  FilterOption
} from '../../config/constants';
import {
  UtilService
} from '../services/util.service';
import {
  NgbActiveModal,
  NgbTypeahead
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  providers: [CardService, PackService, SetService, UtilService, NgbActiveModal],
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() inModal: boolean = false;
  @Output() cardsToAdd: EventEmitter<any> = new EventEmitter();

  cards: card[] = [];
  error: string = '';
  isLoading: boolean = false;
  public form: UntypedFormGroup = new UntypedFormGroup({});
  initialValues!: any;

  //Typeaheads
  @ViewChild('instance') instance!: NgbTypeahead;
  focus$ = [0, 1, 2, 3, 4].map(_ => new Subject < string > ());
  click$ = [0, 1, 2, 3, 4].map(_ => new Subject < string > ());
  model: any[] = [];
  text$: any;
  resourcePlaceholder: string = 'Resource';
  traitPlaceholder: string = 'Trait';
  typePlaceholder: string = 'Type';
  packPlaceholder: string = 'Pack';
  setPlaceholder: string = 'Set';

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
  // CLASSIFICATIONS: string[] = constants.filters.CLASSIFICATIONS.sort();
  ASPECTS: string[] = constants.filters.ASPECTS.sort();
  COSTS: string[] = constants.filters.COSTS;
  RESOURCES: object[] = constants.filters.RESOURCES;
  TRAITS: string[] = constants.filters.TRAITS.sort();
  TYPES: string[] = constants.filters.TYPES.sort();
  ORIGINS: string[] = constants.filters.ORIGINS;

  constructor(private formBuilder: UntypedFormBuilder,
    private cardSevice: CardService,
    private packService: PackService,
    private setService: SetService,
    private utilService: UtilService,
    public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.filteredPacks = this.filteredPackOptionsSubject.asObservable();
    this.filteredSets = this.filteredSetOptionsSubject.asObservable();
    this.form = this.formBuilder.group({
      name: [],
      text: [],
      classification: '',
      cost: '',
      resource: '',
      traits: [],
      type: [],
      pack: [],
      set: [],
      origin: ''
    });
    this.initialValues = this.form.value;
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
    this.cards = [];
    let entries = Object.entries(this.form.value);
    if (!entries.some((entry) => entry[1])) {
      this.error = 'Please include at least one search parameter';
      this.isLoading = false;
      return;
    }
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
      Packs: this.utilService.getPrintingsData(card, this.packOptions, 'PackId'),
      Sets: this.utilService.getPrintingsData(card, this.setOptions, 'SetId')
    }))
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

  clearForm(): void {
    this.form.reset(this.initialValues);
  }

  searchResources: OperatorFunction < string, readonly object[] > = (text$: Observable < string > ) => {
    const debouncedText$ = text$.pipe(debounceTime(0), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$[0].pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$[0];

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.RESOURCES :
        this.RESOURCES.filter((v: any) => v.name.toLowerCase().indexOf(term.toString().toLowerCase()) > -1)), ));
  };

  searchTraits: OperatorFunction < string, readonly string[] > = (text$: Observable < string > ) => {
    const debouncedText$ = text$.pipe(debounceTime(0), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$[1].pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$[1];

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.TRAITS :
        this.TRAITS.filter(v => v.toLowerCase().indexOf(term.toString().toLowerCase()) > -1)), ));
  };

  searchTypes: OperatorFunction < string, readonly string[] > = (text$: Observable < string > ) => {
    const debouncedText$ = text$.pipe(debounceTime(0), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$[2].pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$[2];

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.TYPES :
        this.TYPES.filter(v => v.toLowerCase().indexOf(term.toString().toLowerCase()) > -1)), ));
  };

  searchPacks: OperatorFunction < string, readonly object[] > = (text$: Observable < string > ) => {
    const debouncedText$ = text$.pipe(debounceTime(0), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$[3].pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$[3];

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.packOptions :
        this.packOptions.filter((v: any) => v.name.toLowerCase().indexOf(term.toString().toLowerCase()) > -1)), ));
  };

  searchSets: OperatorFunction < string, readonly object[] > = (text$: Observable < string > ) => {
    const debouncedText$ = text$.pipe(debounceTime(0), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$[4].pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$[4];

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.setOptions :
        this.setOptions.filter((v: any) => v.name.toLowerCase().indexOf(term.toString().toLowerCase()) > -1)), ));
  };

  addSelectedCards = (cards: card[]) => {
    let selected = cards.filter((card) => { return card.checked });
    console.log(selected);
    this.cardsToAdd.emit(cards);
  }

  typeaheadFormatter = (x: any) => x.name || x;

}
