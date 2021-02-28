import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PickAreaLocationComponent } from './pick-area-location/pick-area-location.component';

import { GoogleMaps } from "@ionic-native/google-maps/ngx";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { from } from 'rxjs';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { OAuthModule, OAuthModuleConfig } from 'angular-oauth2-oidc';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { UrlConfig } from './modules/core/classes/config';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { RCMHttpInterceptor } from './middleware/rcm-httpinterceptor';
import { SecureStorageService } from './modules/storage/services/secure-storage.service';
import { MobileService } from './services/mobile.service';
import { SubscribableService } from './services/subscribable.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

export function translateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
// avoid hardcoded URLs, this factory will retrieve them from the configuration class
export function authConfigFactory(): OAuthModuleConfig {
  return {
    resourceServer: {
      allowedUrls: UrlConfig.allowedUrls,
      sendAccessToken: true
    }
  };
}

@NgModule({
  declarations: [
    AppComponent,
    PickAreaLocationComponent,
    //MobileService
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot({
      animated: false
    }),
    AppRoutingModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    OAuthModule.forRoot(),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (translateLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    MediaCapture,
    BarcodeScanner,
    FileChooser,
    File,
    Media,
    StreamingMedia,
    PhotoViewer,
    Deeplinks,
    GoogleMaps,
    Geolocation,
    SQLite,
    SQLitePorter,
    { provide: HTTP_INTERCEPTORS, useClass: RCMHttpInterceptor, multi: true },
    MobileService,
    SubscribableService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: OAuthModuleConfig,
      useFactory: authConfigFactory
    },
    SecureStorageService,
    SpinnerDialog,
    AppVersion
  ],
  exports: [
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }