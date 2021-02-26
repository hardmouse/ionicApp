import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1Page } from './tab1.page';

import { Platform } from '@ionic/angular';
import { MobileService } from '../../app/services/mobile.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthModule, OAuthService,UrlHelperService,OAuthLogger } from 'angular-oauth2-oidc';

import { HeaderComponentModule } from '../header/header.module';
import { IonicStorageModule } from '@ionic/storage';

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tab1Page],
      imports: [
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        ExploreContainerComponentModule,
        HttpClientTestingModule,
        OAuthModule,
        HeaderComponentModule,
        RouterTestingModule],
      providers: [
        MobileService,
        UrlHelperService,
        OAuthService,
        Platform,
        OAuthLogger
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
