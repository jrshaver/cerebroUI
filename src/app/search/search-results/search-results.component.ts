import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  Directive,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  card,
  CardComponent
} from '../../shared/card/card.component';
import Fuse from 'fuse.js';
import {
  CardService
} from '../../services/card.service';
import {
  NgbModal, NgbModalConfig
} from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../services/util.service';
import { constants } from '../../../config/constants';

export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: any, v2: any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
  column: string;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '[class.sortable]': 'true',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  constructor(
    private cardSevice: CardService,
    private utilService: UtilService,
    private config: NgbModalConfig,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
    config.size = 'md';
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (changes['cards'] && changes['cards'].previousValue && changes['cards'].previousValue.length == 0) {
      this.initialCardList = JSON.parse(JSON.stringify(this.cards));
    }
    this.setCards(this.cards);
  }

  // @Input() cards!: card[] | Fuse.FuseResult < card > [];
  @Input() inModal: boolean = false;
  @Input() cards!: card[];
  @Input() packs!: any[];
  @Input() sets!: any[];
  @Output() parentEventHandler: EventEmitter < {
    event: string,
    data: any
  } > = new EventEmitter();

  displayedColumns: string[] = [
    "Name",
    "Classification",
    "Cost",
    "Resource",
    "Traits",
    "Type",
    "Packs",
    "Sets"
  ];

  allChecked: boolean = false;
  sortedByColumn: string = '';
  initialCardList: card[] = [];

  public getDisplayValue(row: any, col: string) {
    let returnValue;
    if (col == 'Resource') {
      let translated = this.translateResources(row[col]); //['Mental', 'Wild'] -> ['resource-Mental', 'resource-Wild']
      returnValue = translated ? translated.map((resource: string) => (resource.toLowerCase())) : [];
      return returnValue;
    } else {
      returnValue = row[col];
    }
    returnValue = row[col];
    if (returnValue) {
      if (typeof returnValue === 'string') {
        returnValue = returnValue.replace(/,/g, ', ');
      }
      if (typeof returnValue === 'object') {
        returnValue = returnValue.join(', ');
      }
    }
    return returnValue;
  }

  translateResources(resource: string): any {
    const resources: Object = {
      Energy: '{e}',
      Mental: '{m}',
      Physical: '{p}',
      Wild: '{w}'
    };
    if (resources.hasOwnProperty(resource)) {
      return resources[resource as keyof Object];
    } else {
      let keyFound: any[] = [];
      Object.entries(resources).find(([key, value]) => {
        if (resource && resource.indexOf(value) > -1) {
          keyFound.push(key);
        }
        return '';
      });
      return keyFound;
    }
  }

  openDialog(currentCardIndex: number) {
    console.log(this.inModal);
    const modalRef = this.modalService.open(CardComponent);
    console.log(this.cards);
    console.log(currentCardIndex);
    modalRef.componentInstance.cards = this.cards;
    modalRef.componentInstance.currentCardIndex = currentCardIndex;
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
        this.cards = [];
        if (result.length == 0) {
          this.parentEventHandler.emit({
            event: 'error',
            data: 'No related cards found'
          });
        } else {
          this.getRelatedCards(result);
        }
      }
    }, () => {});
  }

  compare(v1: any, v2: any) {
    if (!v1) {
      v1 = -1;
    }
    if (!v2) {
      v2 = -1;
    }
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  getRelatedCards(card: card): void {
    this.parentEventHandler.emit({
      event: 'isLoading',
      data: true
    });
    this.cardSevice.getAllCards().subscribe(cards => {
      const fuse = new Fuse(cards, constants.FUSE_OPTIONS);
      const keywords = this.cardSevice.getKeywords(card);
      const results = fuse.search({
        $or: keywords
      });
      results.shift();
      this.setCards(results.map((result, index) => ({
        ...result.item,
        Rank: index + 1,
        Packs: this.utilService.getPrintingsData(result.item, this.packs, 'PackId'),
        Sets: this.utilService.getPrintingsData(result.item, this.sets, 'SetId')
      })));
      this.parentEventHandler.emit({
        event: 'isLoading',
        data: false
      });
      this.displayedColumns.unshift('Rank');
    });
  }

  setCards(cards: any): void {
    this.removeDisplayColumn('Rank');
    this.cards = cards;
  }

  removeDisplayColumn(columnName: string): void {
    const index = this.displayedColumns.indexOf(columnName, 0);
    if (index > -1) {
      this.displayedColumns.splice(index, 1);
    }
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  onSort({column, direction}: SortEvent) {

    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      console.log("IN");
      console.log(this.initialCardList);
      this.cards = this.initialCardList;
    } else {
      this.cards = this.cards.sort((a, b) => {
        const res = compare(a[column as keyof card], b[column as keyof card]);
        return direction === 'asc' ? res : -res;
      });
      this.sortedByColumn = column;
    }
  }

  checkAll(): void {
    this.cards.forEach(card => card.checked = !this.allChecked)
    this.allChecked = !this.allChecked;
  }

}
