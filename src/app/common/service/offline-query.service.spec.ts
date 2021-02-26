import { TestBed } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { OfflineQueryService } from './offline-query.service';

describe('OfflineQueryService', () => {
  let service: OfflineQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Platform
      ]
    });
    service = TestBed.inject(OfflineQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
