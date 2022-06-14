import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import {
  MatDialog
} from '@angular/material/dialog';
import {
  MatSort,
  Sort
} from '@angular/material/sort';
import {
  card,
  CardComponent
} from '../../card/card.component';
import Fuse from 'fuse.js';
import {
  MatTableDataSource
} from '@angular/material/table';
import {
  CardService
} from '../../shared/services/card.service';
import {
  constants
} from 'src/config/constants';
import { UtilService } from 'src/app/shared/services/util.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements AfterViewInit {

  constructor(public dialog: MatDialog, private cardSevice: CardService, private utilService: UtilService) {
    this.getScreenSize();
  }

  @ViewChild('cardSort') cardSort = new MatSort();

  ngAfterViewInit(): void {
    this.cardSort.disableClear = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setCards(this.cards);
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 768) {
      this.removeDisplayColumn('Cost');
    }
  }

  @Input() cards!: card[] | Fuse.FuseResult < card > [];
  @Input() packs!: any[];
  @Input() sets!: any[];
  @Output() parentEventHandler: EventEmitter < {
    event: string,
    data: any
  } > = new EventEmitter();
  dataSource: any;

  screenHeight: number = 0;
  screenWidth: number = 0;

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

  public getDisplayValue(row: any, col: string) {
    let returnValue;
    if (col == 'Resource') {
      let translated = this.translateResources(row[col]); //['Mental', 'Wild'] -> ['resource-Mental', 'resource-Wild']
      returnValue = translated ? translated.map((resource: string) => ('resource-' + resource.toLowerCase())) : [];
      return returnValue;
    } else {
      returnValue = row[col];
    }
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
    let sortedCards = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
    const dialogRef = this.dialog.open(CardComponent, {
      data: {
        cards: sortedCards,
        currentCardIndex: currentCardIndex,
      },
      panelClass: 'card-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cards = this.dataSource = [];
        if (result.length == 0) {
          // this.error = 'No related cards found';
          this.parentEventHandler.emit({
            event: 'error',
            data: 'No related cards found'
          });
        } else {
          this.getRelatedCards(result);
        }
      }
    });
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
      const rankSort: Sort = {
        active: 'Rank',
        direction: 'asc'
      };
      this.cardSort.active = rankSort.active;
      this.cardSort.direction = rankSort.direction;
      this.cardSort.sortChange.emit(rankSort);
    });
  }

  setCards(cards: any): void {
    this.removeDisplayColumn('Rank');
    this.cards = cards;
    this.dataSource = new MatTableDataSource(cards);
    this.dataSource.sort = this.cardSort;
  }

  removeDisplayColumn(columnName: string): void {
    const index = this.displayedColumns.indexOf(columnName, 0);
    if (index > -1) {
      this.displayedColumns.splice(index, 1);
    }
  }

}
