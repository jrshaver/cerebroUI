import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuiFilterComponent } from './cui-filter.component';

describe('CuiFilterComponent', () => {
  let component: CuiFilterComponent;
  let fixture: ComponentFixture<CuiFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuiFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuiFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
