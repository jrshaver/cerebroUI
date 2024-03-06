import { TestBed } from '@angular/core/testing';

import { LoggedInUserGuard } from './logged-in-user.guard';

describe('LoggedInUserGuard', () => {
  let guard: LoggedInUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LoggedInUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
