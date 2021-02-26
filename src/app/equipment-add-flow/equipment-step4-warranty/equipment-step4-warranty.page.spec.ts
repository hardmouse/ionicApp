import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EquipmentStep4WarrantyPage } from './equipment-step4-warranty.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileService } from '../../../app/services/mobile.service';
import { IonicStorageModule } from '@ionic/storage';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('EquipmentStep4WarrantyPage', () => {
  let component: EquipmentStep4WarrantyPage;
  let fixture: ComponentFixture<EquipmentStep4WarrantyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentStep4WarrantyPage ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        IonicStorageModule.forRoot(),
        IonicModule.forRoot(),
        OAuthModule.forRoot()
      ],
      providers: [
        MobileService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentStep4WarrantyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
