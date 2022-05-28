import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuiSearchResultsComponent } from './cui-search-results.component';

describe('CuiSearchResultsComponent', () => {
  let component: CuiSearchResultsComponent;
  let fixture: ComponentFixture<CuiSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuiSearchResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuiSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
