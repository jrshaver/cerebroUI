import {
  COMMA,
  ENTER
} from '@angular/cdk/keycodes';
import {
  Component,
  ElementRef,
  ViewChild,
  Input,
  OnInit
} from '@angular/core';
import {
  FormControl
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import {
  MatChipInputEvent
} from '@angular/material/chips';
import {
  Observable
} from 'rxjs';
import {
  map,
  startWith
} from 'rxjs/operators';

@Component({
  selector: 'app-cui-filter',
  templateUrl: './cui-filter.component.html',
  styleUrls: ['./cui-filter.component.scss']
})
export class CuiFilterComponent implements OnInit {

  @Input() searchFilter: any;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterCtrl = new FormControl();
  filteredOptions!: Observable < string[] > ;
  selectedValues: string[] = [];

  ngOnInit(): void {
    this.selectedValues = this.searchFilter.value.length > 0 ? this.searchFilter.value.split(',') : [];
    this.filteredOptions = this.filterCtrl.valueChanges.pipe(
      startWith(null),
      map((option: string | null) => (option ? this._filter(option) : this.searchFilter.options.slice())),
    );

    this.filterCtrl.valueChanges.subscribe((newValue: string) => {
      if (this.searchFilter.options.includes(newValue)) {
        this.searchFilter.value = newValue;
      } else {
        this.searchFilter.value = '';
      }
    })
  }

  @ViewChild('filterInput') filterInput!: ElementRef < HTMLInputElement > ;

  constructor() {}

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedValues.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.filterCtrl.setValue(null);
  }

  remove(option: string): void {
    const index = this.selectedValues.indexOf(option);

    if (index >= 0) {
      this.selectedValues.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedValues.push(event.option.viewValue);
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.searchFilter.options.filter((option: string) => option.toLowerCase().includes(filterValue));
  }

}
