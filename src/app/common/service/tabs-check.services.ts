import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AlertService } from '../../common/service/alert.services';
import { SubscribableService } from '../../services/subscribable.service';

@Injectable({
  providedIn: 'root'
})
export class TabsCheckService implements CanActivate {

  constructor(
    public alertService: AlertService,
    public subs:SubscribableService,
    public navCtrl:NavController
  ) { }
  targetUrl:string="";
  
  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
    ){
      // console.log("route:",route);
      // console.log("state:",state);
    this.targetUrl = state.url;

    if(route.routeConfig.path=="equipmentaddtab"){
      this.subs.Tabs = "ADD";
    }else if(route.routeConfig.path=="tab1"){
      this.subs.Tabs = "EDIT";
    }else if(route.routeConfig.path=="tab2"){
      this.subs.Tabs = "REQUEST";
    }

    if(this.subs.Mode==""){
      return true;
    }else{
      this.presentAlertConfirm();
      return false;
    }
    
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
        this.navCtrl.navigateForward(this.targetUrl);
      }
    }];
    this.alertService.backAlert(buttons);
  }
  
}
