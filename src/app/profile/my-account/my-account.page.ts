import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { storageVariableNames} from '../../common/type/common.model';
import { LoginService } from '../../modules/security/services/login.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  keepSignedIn:boolean;

  constructor(
    public navCtrl:NavController,
    private loginService:LoginService
  ) { }

  ngOnInit() {
  }
  checkInput(_e){
    console.log(_e);
  }
  
  discard(){
    this.navCtrl.navigateForward(storageVariableNames.HOME);
  } 
  save(){
    this.navCtrl.navigateForward(storageVariableNames.HOME);
  }
  signInToggle(){
    this.keepSignedIn =! this.keepSignedIn;
    this.loginService.setRememberMe(this.keepSignedIn);
  }
}
