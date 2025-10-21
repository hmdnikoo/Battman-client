import { TestBed } from '@angular/core/testing';

import { RecordSessionService } from './record-session-service';

describe('RecordSessionService', () => {
  let service: RecordSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
