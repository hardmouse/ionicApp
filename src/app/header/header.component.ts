import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { storageVariableNames} from '../common/type/common.model';
import { EquipmentSubHeader,EquipmentSubHeaderItem } from '../common/type/common.model';
import { SubscribableService } from '../services/subscribable.service'
import { PopupSelectionComponent } from '../profile/popup-selection/popup-selection.component';
import { AlertService } from '../common/service/alert.services';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  subHeader:EquipmentSubHeader = new EquipmentSubHeader();
  @Input() isFrom: any;
  profileToggle:boolean = false;
  // toggleCtrl:boolean = false;
  currentPopover:any;

  constructor(
    private storage: Storage, 
    public navCtrl:NavController,
    public subs:SubscribableService,
    // public alertController: AlertController,
    public alertService: AlertService,
    public popoverController: PopoverController
    ) { }

  ngOnInit() {
    
  }

  async presentPopover(ev: any) {

    const popover = await this.popoverController.create({
      component: PopupSelectionComponent,
      cssClass: 'popup-wrapper',
      event: ev,
      translucent: false
    });
    this.currentPopover = popover;
    return await popover.present();
  }
  dismissPopover() {
    if (this.currentPopover) {
      this.currentPopover.dismiss().then(() => { this.currentPopover = null; });
    }
  }

  ionViewWillEnter(){
  }

  navBackTo(){
      console.log("navBackTo()",this.isFrom);
      switch(this.isFrom){
        case 'home':{
          this.navCtrl.navigateForward(storageVariableNames.HOME);
          break; 
        }
        case 'homeCheck':{
          this.presentAlertConfirm();
          break; 
        }
        case 'step1':{
          this.navCtrl.navigateForward(storageVariableNames.STEP1NAV);
          this.navSubHeaderStatus(1);
          break; 
        }
        case 'step2':{
          this.navCtrl.navigateForward(storageVariableNames.STEP2NAV);
          this.navSubHeaderStatus(2);
          break; 
        }
        case 'step3':{
          this.navCtrl.navigateForward(storageVariableNames.STEP3NAV);
          this.navSubHeaderStatus(3);
          break; 
        }
        case 'step4':{
          this.navCtrl.navigateForward(storageVariableNames.STEP4NAV);
          this.navSubHeaderStatus(4);
          break; 
        }
        case 'step5':{
          this.navCtrl.navigateForward(storageVariableNames.STEP5NAV);
          this.navSubHeaderStatus(5);
          break; 
        }
        default: { 
          //statements; 
          break; 
        } 
      }
  }
  
  navSubHeaderStatus(step:number){
    this.storage.get(storageVariableNames.SUBHEADER).then((data : EquipmentSubHeader) => {
      this.subHeader = data;
      this.subHeader.subheaderitems.forEach(x=>x.isCurrentStep = false);
      this.subHeader.subheaderitems[step-1].isCurrentStep = true;
      this.storage.set(storageVariableNames.SUBHEADER, this.subHeader);
      this.subs.subHeader.next(this.subHeader);
    });
  }
  
  async presentAlertConfirm() {
    let buttons = [{
      text: 'Cancel',
      role: 'cancel',
      cssClass: 'button-1',
      handler: (blah) => {
        console.log('Confirm Cancel: blah');
      }
    }, {
      text: 'Continue',
      cssClass: 'button-2',
      handler: () => {
        this.subs.clearMode();
        this.navCtrl.navigateForward(storageVariableNames.HOME);
      }
    }];
    this.alertService.backAlert(buttons);
  }
}
