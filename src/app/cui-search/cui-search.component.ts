import {
  Component,
  AfterViewInit,
  ViewChild
} from '@angular/core';

import {
  MatSort,
  Sort
} from '@angular/material/sort';

import {
  MatTableDataSource
} from '@angular/material/table';

import {
  MatDialog
} from '@angular/material/dialog';

import {
  CardService
} from '../services/card.service';

import {
  card,
  CardComponent
} from '../card/card.component';

import {
  filter,
  map
} from 'rxjs/operators';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import Fuse from 'fuse.js'
import {
  constants
} from 'src/config/constants';

@Component({
  selector: 'app-cui-search',
  templateUrl: './cui-search.component.html',
  providers: [CardService],
  styleUrls: ['./cui-search.component.scss']
})
export class CuiSearchComponent implements AfterViewInit {

  constructor(private cardSevice: CardService, public dialog: MatDialog, private route: ActivatedRoute) {}

  @ViewChild('cardSort') cardSort = new MatSort();

  ngAfterViewInit(): void {
    this.cardSort.disableClear = true;
  }

  cardName: string = '';
  cardText: string = '';
  allCards: card[] = [];
  cards: card[] | Fuse.FuseResult < card > [] = [];
  packNames: string[] = [];
  dataSource: any;
  error: string = '';
  isLoading: boolean = false;
  highestCost = 6;
  FILTERS = [{
    name: 'Card Text',
    type: 'text',
    allowMultiple: false,
    searchable: false,
    options: [''],
    value: ''
  }, {
    name: 'Classification',
    type: 'select',
    allowMultiple: false,
    searchable: true,
    options: ['Aggression', 'Basic', 'Determination', 'Encounter', 'Hero', 'Justice', 'Leadership', 'Protection'].sort(),
    value: ''
  }, {
    name: 'Cost',
    type: 'select',
    allowMultiple: false,
    searchable: false,
    options: Array.from({
      length: this.highestCost
    }, (v, k) => (k).toString()),
    value: ''
  }, {
    name: 'Resource',
    type: 'select',
    allowMultiple: false,
    searchable: false,
    options: ['Energy', 'Mental', 'Physical', 'Wild'].sort(),
    value: ''
  }, {
    name: 'Traits',
    type: 'select',
    allowMultiple: false,
    searchable: true,
    options: ["Accuser Corps", "Aerial", "Android", "Ants", "Armor", "Arrow", "Artifact", "Asgard", "Assassin", "Attack", "Attorney", "Avenger", "Badoon", "Bird", "Black Order", "Black Panther", "Bounty Hunter", "Brotherhood of Mutants", "Brute", "Businessman", "Captive", "Champion", "Civilian", "Condition", "Cosmic Entity", "Creature", "Criminal", "Crossfire's Crew", "Cyborg", "Damaged", "Defender", "Defense", "Dragon", "Drone", "Elder", "Elite", "Enhanced", "Experimental", "Expert Mode Only", "Gamma", "Genius", "Ghost", "Giant", "Goblin", "Guardian", "Hero For Hire", "Hero for Hire", "Hydra", "Ice", "Illusion", "Infinity Stone", "Inhuman", "Invocation", "Item", "King", "Kree", "Leviatron", "Location", "Masters of Evil", "Mercenary", "Metal", "Milano Mod", "Mutate", "Mystic", "Nova Corps", "Olympus", "Outlaw", "Persona", "Preparation", "Quiet", "Ringing", "Robot", "S.H.I.E.L.D", "Scientist", "Scoundrel", "Setting", "Skill", "Soldier", "Space Knight", "Spell", "Spy", "Standard Mode Only", "Stone", "Superpower", "Symbiote", "Tactic", "Team", "Tech", "Technique", "Temporal", "Thwart", "Tiny", "Titan", "Title", "Traitor", "Undead", "Vampire", "Vehicle", "Wakanda", "Weapon", "Web-Warrior", "Wood", "Wounded", "Wrecking Crew", "X-Factor"].sort(),
    value: ''
  }, {
    name: 'Type',
    type: 'select',
    allowMultiple: false,
    searchable: true,
    options: ["Ally", "Alter-Ego", "Attachment", "Environment", "Event", "Hero", "Main Scheme", "Minion", "Obligation", "Resource", "Side Scheme", "Support", "Treachery", "Upgrade", "Villain"].sort(),
    value: ''
  }, {
    name: 'Pack',
    type: 'select',
    allowMultiple: false,
    searchable: true,
    options: ["Core Set", "The Green Goblin", "Captain America", "Ms. Marvel", "The Wrecking Crew", "Thor", "Black Widow", "Doctor Strange", "Ronan Modular Set", "Hulk", "The Rise of Red Skull", "The Once and Future Kang", "Ant-man", "Wasp", "Quicksilver", "Scarlet Witch", "Galaxy's Most Wanted", "Star-Lord", "Gamora", "Drax", "Venom", "The Mad Titan's Shadow", "Nebula", "War Machine", "The Hood", "Valkyrie", "Vision", "Sinister Motives"].sort(),
    value: '',
  }, {
    name: 'Origin',
    type: 'select',
    allowMultiple: false,
    searchable: false,
    options: ["Official", "Unofficial"].sort(),
    value: ''
  }];

  displayedColumns: string[] = [
    "Name",
    "Classification",
    "Cost",
    "Resource",
    "Traits",
    "Type"
  ];

  fuseOptions = {
    includeScore: true,
    threshold: 0.8,
    fieldNormWeight: 2,
    minMatchCharLength: 2,
    findAllMatches: true,
    keys: ['Name', 'Subname', {
      name: 'Classification',
      weight: 2
    }, {
      name: 'Type',
      weight: 2
    }, {
      name: 'Traits',
      weight: 2
    }, {
      name: 'Rules',
      weight: 2
    }]
  }

  search(): void {
    this.error = '';
    this.isLoading = true;
    let query = this.formatQuery(this);
    if (!query) {
      this.error = 'Please include at least one search parameter';
      this.isLoading = false;
      return;
    }
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

  formatQuery(vm: any): string {
    let queryArray = [];
    this.FILTERS.forEach((filter) => {
      if (filter.value) {
        if (filter.name == 'Resource') {
          queryArray.push(filter.name.toLowerCase() + '=' + this.translateResources(filter.value));
        } else if (filter.name == 'Card Text') {
          queryArray.push('text=' + filter.value);
        } else {
          queryArray.push(filter.name.toLowerCase() + '=' + filter.value);
        }
      }
    });
    if (vm.cardName) {
      queryArray.push('name=' + vm.cardName);
    }
    return queryArray.join('&');
  }

  getDisplayValue(row: any, col: string): String {
    let returnValue;
    switch (col) {
      case 'Aspect': {
        returnValue = row['Classification'];
        break;
      }
      case 'Resource': {
        returnValue = this.translateResources(row[col]);
        break;
      }
      default: {
        returnValue = row[col];
        break;
      }
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

  translateResources(resource: string) {
    const resources: Object = {
      Energy: '{e}',
      Mental: '{m}',
      Physical: '{p}',
      Wild: '{w}'
    };
    if (resources.hasOwnProperty(resource)) {
      return resources[resource as keyof Object];
    } else {
      let keyFound = '';
      Object.entries(resources).find(([key, value]) => {
        if (value === resource) {
          keyFound = key;
          return keyFound;
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
          this.error = 'No related cards found';
        } else {
          this.getRelatedCards(result);
        }
      }
    });
  }

  getRelatedCards(card: card): void {
    this.isLoading = true;
    this.cardSevice.getAllCards().subscribe(cards => {
      const fuse = new Fuse(cards, constants.FUSE_OPTIONS);
      const keywords = this.cardSevice.getKeywords(card);
      const results = fuse.search({
        $or: keywords
      });
      this.setCards(results.slice(0, 20).map(result => result.item))
      this.isLoading = false;
    });
  }

  setCards(cards: card[]): void {
    this.cards = cards;
    this.dataSource = new MatTableDataSource(cards);
    this.dataSource.sort = this.cardSort;
  }

}

export interface filter {
  name: string,
    type: string,
    options: string[],
    allowMultiple: boolean,
    searchable: boolean,
    value: string
}
