import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
// import { TranslateConfigService } from '../common/service/translate-config.service';
import { OfflineManagerService } from '../middleware/offline-manager.service';
import { SubscribableService } from '../services/subscribable.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
  toggleCtrl: boolean = false;
  langToggle: boolean = false;
  constructor(
    public subs: SubscribableService,
    private cd: ChangeDetectorRef,
    // private translateConfigService: TranslateConfigService,
    private offlineManager: OfflineManagerService
  ) {
  }
  ngOnInit(): void {
    this.offlineManager.downloadProgress.subscribe(progress => {
      this.progress = progress;
      if (this.progress === 1) this.download = false;
    });
  }

  toggleClick() {
    this.toggleCtrl = !this.toggleCtrl;
    document.body.classList.toggle('dark', this.toggleCtrl);
  }
  ionViewWillEnter() {
    // console.log("getCurrentLanguage in service config:", this.translateConfigService.getCurrentLanguage());
    // this.translateConfigService.setLanguage(this.translateConfigService.getCurrentLanguage());
    // this.cd.detectChanges();
  }
  // tg() {
  //   this.langToggle = !this.langToggle;
  //   if (this.langToggle) {
  //     this.translateConfigService.setLanguage('en');
  //   } else {
  //     this.translateConfigService.setLanguage('fr');
  //   }
  // }
  // nav(tab:string){
  //   this.subs.Tabs = tab;
  // }

  download = false;
  progress: number = 0;
  onDownLoad() {
    this.download = true;
    this.offlineManager.downloadDataOnUserAction().catch(() => {
      console.log('Tabs : error');
      this.offlineManager.downloadFail();
    });
  }
}
