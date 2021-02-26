import { Component, NgZone, OnDestroy } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CleanupBasePage } from 'src/app/modules/core/classes/cleanupBasePage';
import { LoginService } from 'src/app/modules/security/services/login.service';
import { Router } from '@angular/router';
import { Constants } from 'src/app/modules/core/classes/constants';
import { AppUrlOpen, Plugins } from '@capacitor/core';
import { AppUtil } from 'src/app/modules/core/classes/appUtil';
import { PlatformTypeService } from './modules/core/services/platform-type.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { LoginPage } from './modules/security/pages/login/login.page';
import { NetworkService } from './middleware/network.service';
import { OfflineManagerService } from './middleware/offline-manager.service';
// import { TranslateConfigService } from './common/service/translate-config.service';
import { ClientForSelectResponseModel, UserInfoResponseModel } from '../app/modules/security/classes/authModels';
import { SubscribableService } from '../app/services/subscribable.service';
import { Storage } from '@ionic/storage';
import { storageVariableNames} from './common/type/common.model';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { AppVersion } from '@ionic-native/app-version/ngx';

const { App: IonicApp } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent extends CleanupBasePage  implements OnDestroy {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private loginService: LoginService,
    private router: Router,
    private platformTypeService: PlatformTypeService,
    private deeplinks: Deeplinks,
    private networkService: NetworkService,
    private offlineService: OfflineManagerService,
    // private translateConfigService: TranslateConfigService,
    public subs:SubscribableService,
    private storage: Storage,
    private ngZone: NgZone,
    public appVersion: AppVersion
  ) {
    super();
    this.initializeApp();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  initializeApp() {

    console.log(`initializeApp()`);
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.getVersion();

      this.networkService.Initialize();
      this.cleanEquipmentAddStorage();
      this.initializeAuth();

      if (this.platformTypeService.isHybrid) {
        console.log(`initializeApp() isHybrid`);
        this.registerDeepLinksListners();
      }
      // this.langSetCheck();
      this.contrastModeCheck();
    });
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Android back button clicked!');
      // app is not allowed to kill itself, pls see Apple Store policy navigator['app'].exitApp();
    });
  }
  
  getVersion() {
    Promise.all([this.appVersion.getVersionNumber(), this.appVersion.getVersionCode()])
    .then((results) => {
      console.log(`getVersion() results=${JSON.stringify(results)}`);
 
      this.subs.version = `${results[0]} Build: ${results[1]}`;    
      console.log(this.subs.version);
    })
    .catch((error) => {
      console.log(`getVersion() could not read app version. error=${JSON.stringify(error)}`);
    });

  }

  private initializeAuth = () => {

    this.loginService.tryLoginCodeFlow().then(() => {

      console.log(`appComponent.initializeAuthRealSuite() isAuthorized=${this.loginService.isAuthorized}`);

      let needToGoToTheNextPageNow: boolean = true;
      if (!this.loginService.isAuthorized) {
        const promise = this.loginService.readStoredAuthInfo();
        if (!AppUtil.isNullOrUndefined(promise)) {
          needToGoToTheNextPageNow = false;
          promise.finally(() => this.goToNextPage());
        }
      }

      if (needToGoToTheNextPageNow) {
        this.goToNextPage();
      }
    });

  }

  private goToNextPage = () => {
    
    let destinationPage: string = Constants.LOGIN_PATH;
    if (this.loginService.isAuthorized)
     {
      this.loginService.storeAuthInfo();
      this.offlineService.Initialize();
      destinationPage = Constants.FIRST_PAGE_AFTER_LOGIN_PATH;
    }
    console.log(
      `goToNextPage():
      destinationPage=${destinationPage == null ? 'NULL' : destinationPage}
      isAuthorized=${this.loginService.isAuthorized}
      SafariViewController=${SafariViewController == null ? 'NULL' : 'SafariViewController is not null'}
    `);

    this.dismissSafariViewController();

    this.ngZone.run(() => this.router.navigateByUrl(destinationPage)).then();
  }

  // For capacitor (hybrid) ver of the app, the SSO login passes here the auth code and we need to process it.
  openFromExternalUrl = (queryString: string) => {

    console.log(
      `openFromExternalUrl():
      queryString=${queryString == null ? 'NULL' : queryString}
      isHybrid=${this.platformTypeService.isHybrid}
      isAuthorized=${this.loginService.isAuthorized}
      SafariViewController=${SafariViewController == null ? 'NULL' : 'SafariViewController is not null'}
    `);

    if (this.loginService.isAuthorized) {
      this.goToNextPage();
    }
    else if (this.platformTypeService.isHybrid && !AppUtil.isNullOrUndefined(this.loginService)) {
      this.loginService.tryLoginCodeFlow(false, queryString).then(() => {

        console.log(`appComponent.openFromExternalUrl() isAuthorized=${this.loginService.isAuthorized}`);
        this.goToNextPage();

      });
    }
  }


  registerDeepLinksListners = () => {

    if (this.platformTypeService.isAndroid) {
      this.registerNativeAndroidAppOpenListner();
    }
    else if (this.platformTypeService.isiOS) {
      this.registerNativeIosAppOpenListner();
    }

  }

  registerNativeAndroidAppOpenListner = () => {

    this.deeplinks.route({
      '/bgis.rcmobile': LoginPage,
      '/login': LoginPage
    })
      .subscribe(match => {
        if (!AppUtil.isNullOrUndefined(match) && !AppUtil.isNullOrUndefined(match.$link) && !AppUtil.isNullOrUndefinedOrWhitespace(match.$link.queryString)) {
          this.openFromExternalUrl(`?${match.$link.queryString}`);
        }
        else {
          console.error(`deeplinks.route.subscribe(): the match is incorrect`);
          this.router.navigateByUrl(Constants.LOGIN_PATH);
        }

      },
        nomatch => {
          console.error('Got a deeplink that didn\'t match', nomatch);
          this.router.navigateByUrl(Constants.LOGIN_PATH);
        });

  }

  registerNativeIosAppOpenListner = () => {

    Plugins.App.addListener('appUrlOpen', (urlOpen: AppUrlOpen) => {

      console.log('App URL Open', urlOpen);
      this.openFromExternalUrl(AppUtil.extractQueryStringFromFullUrl(urlOpen.url));

    });

  }


  dismissSafariViewController = () => {
    if( this.platformTypeService.isHybrid )
    {
      SafariViewController.isAvailable()
      .then((available: boolean) => {
          if (available) {
            SafariViewController.hide();
          } 
          else
          { 
            console.log(`SafariViewController is not available`);
          }
        }
      );
    }
  }


  contrastModeCheck(){
    let toggleCtrl:boolean;
    if(localStorage.getItem('contrastDark')!="true" || localStorage.getItem('contrastDark')==null){
      localStorage.setItem('contrastDark', "false");
      toggleCtrl=false;
    }else{
      toggleCtrl=true;
    }
    document.body.classList.toggle('dark',toggleCtrl);
  }
  // langSetCheck(){
  //   if(!localStorage.getItem('langSet')){
  //     localStorage.setItem('langSet', navigator.language);
  //     this.translateConfigService.setLanguage(navigator.language);
  //   }else{
  //     this.translateConfigService.setLanguage(localStorage.getItem('langSet'));
  //   }
  //   // console.log(this.translateConfigService.getCurrentLanguage(),"<service ::: local>",localStorage.getItem('langSet'));
  // }

  getUserInfo(){
    this.loginService.retrieveUserInfo().subscribe((user:UserInfoResponseModel)=>{
      console.log(user);
      this.subs.userInfo = user;
    });

    this.loginService.retrieveAvailableClients().subscribe((clients:Array<ClientForSelectResponseModel>)=>{
      console.log(clients);
      this.subs.accessClients = clients;
    });
  }

  cleanEquipmentAddStorage(){
    this.storage.remove(storageVariableNames.SEARCHEQUIPMENT);
    this.storage.remove(storageVariableNames.STEP1DATACLIENTINFO);
    this.storage.remove(storageVariableNames.STEP2DATAEQIPMENTTYPE);
    this.storage.remove(storageVariableNames.STEP3DESCRIPTION);
    this.storage.remove(storageVariableNames.STEP4DATAWARRENTY);
    this.storage.remove(storageVariableNames.SUBHEADER);
    this.storage.remove(storageVariableNames.EUIIPMENTDETAILGET);
  }
}