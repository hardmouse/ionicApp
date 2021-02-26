import { TestBed } from '@angular/core/testing';

import { SetupOfflineDataService } from './setup-offline-data.service';

describe('SetupOfflineDataService', () => {
  let service: SetupOfflineDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetupOfflineDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
