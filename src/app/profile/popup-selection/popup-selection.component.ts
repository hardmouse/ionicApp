import { Component, OnInit } from '@angular/core';

import { PopoverController, NavController } from '@ionic/angular';
import { AlertService } from '../../common/service/alert.services';
import { storageVariableNames} from '../../common/type/common.model';
import { LoginService } from '../../modules/security/services/login.service';
import { SubscribableService } from '../../services/subscribable.service';
@Component({
  selector: 'app-popup-selection',
  templateUrl: './popup-selection.component.html',
  styleUrls: ['./popup-selection.component.scss'],
})
export class PopupSelectionComponent implements OnInit {
  version:string;
  optionLinks = [
    {
      "name":"My Account",
      "url":"MYACCOUNT",
      "icon":"icon-profile"
    },{
      "name":"Preferences",
      "url":"PREFERENCES",
      "icon":"icon-preferences"
    },{
      "name":"Notifications",
      "url":"NOTIFICATIONS",
      "icon":"icon-notification"
    },{
      "name":"Logout",
      "url":"LOGOUT",
      "icon":"icon-logout"
    }
  ];
  constructor(
    public navCtrl:NavController,
    private popoverCtrl: PopoverController,
    public subs:SubscribableService,
    public alertService: AlertService,
    private loginService:LoginService
    ) {
      
    }

  ngOnInit() {
  }

  async presentAlertConfirm(_i) {
    if(this.subs.Mode){
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
          this.navigateTo(_i);
        }
      }];
      this.alertService.backAlert(buttons);
    }else{
      this.navigateTo(_i);
    }
  }

  navigateTo(_i){
    this.popoverCtrl.dismiss();
    switch(_i){
      case 0:
        this.navCtrl.navigateForward(storageVariableNames.MYACCOUNT);
        break;
      case 1:
        this.navCtrl.navigateForward(storageVariableNames.PREFERENCES);
        break;
      case 2:
        this.navCtrl.navigateForward(storageVariableNames.NOTIFICATIONS);
        break;
      case 3:
        this.loginService.logout();
        // setTimeout(()=>{
        //   console.log('Logged out!');
        //   this.navCtrl.navigateForward(storageVariableNames.LOGOUT);
        // }, 3000);
        break;
      default:
        this.navCtrl.navigateForward(storageVariableNames.LOGOUT);
        break;
    }
  }
}



