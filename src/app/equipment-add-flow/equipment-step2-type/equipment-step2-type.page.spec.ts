import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EquipmentStep2TypePage } from './equipment-step2-type.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MobileService } from '../../../app/services/mobile.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { IonicStorageModule } from '@ionic/storage';
describe('EquipmentStep2TypePage', () => {
  let component: EquipmentStep2TypePage;
  let fixture: ComponentFixture<EquipmentStep2TypePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentStep2TypePage ],
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

    fixture = TestBed.createComponent(EquipmentStep2TypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
