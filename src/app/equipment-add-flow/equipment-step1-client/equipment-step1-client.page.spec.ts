import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EquipmentStep1ClientPage } from './equipment-step1-client.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileService } from '../../../app/services/mobile.service';
import { IonicStorageModule } from '@ionic/storage';
import { OAuthModule } from 'angular-oauth2-oidc';
describe('EquipmentStep1ClientPage', () => {
  let component: EquipmentStep1ClientPage;
  let fixture: ComponentFixture<EquipmentStep1ClientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentStep1ClientPage ],
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

    fixture = TestBed.createComponent(EquipmentStep1ClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
