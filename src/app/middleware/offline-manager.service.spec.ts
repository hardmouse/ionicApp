import { TestBed } from '@angular/core/testing';

import { OfflineManagerService } from './offline-manager.service';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Platform } from '@ionic/angular';

describe('OfflineManagerService', () => {
  let service: OfflineManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule],
      providers: [
        SQLite,
        SQLitePorter,
        Platform
      ]
    }).compileComponents();
    service = TestBed.inject(OfflineManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});