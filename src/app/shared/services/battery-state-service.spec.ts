import { TestBed } from '@angular/core/testing';

import { BatteryStateService } from './battery-state-service';

describe('BatteryStateService', () => {
  let service: BatteryStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatteryStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
