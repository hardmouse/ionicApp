import { TestBed } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
import { PlatformTypeService } from './platform-type.service';

describe('PlatformTypeService', () => {
  let service: PlatformTypeService;
  let platformReadySpy;
  let platformSpy;

  beforeEach(() => {
    platformReadySpy = Promise.resolve();
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    TestBed.configureTestingModule({
      providers: [
        PlatformTypeService,
        { provide: Platform, useValue: platformSpy },
      ]
    });
    service = TestBed.inject(PlatformTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
