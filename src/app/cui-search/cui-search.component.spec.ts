import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuiSearchComponent } from './cui-search.component';

describe('CuiSearchComponent', () => {
  let component: CuiSearchComponent;
  let fixture: ComponentFixture<CuiSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuiSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuiSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
