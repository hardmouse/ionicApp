import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { storageVariableNames} from '../../common/type/common.model';
import { SubscribableService } from '../../services/subscribable.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  langPick:boolean = false;
  mockLang=['English','French'];
  langValue = '';
  saveChanges:boolean=false;
  optionList=[
    {
      "text":"When Request is created.",
      "value":false
    },
    {
      "text":"When Request status changes to Request Assigned/On Route.",
      "value":true
    },
    {
      "text":"When Requests status changes to Arrived/Responded.",
      "value":true
    },
    {
      "text":"When Request status changes to In-Progress.",
      "value":false
    },
    {
      "text":"When Request is completed.",
      "value":true
    }
  ]
  constructor(
    public navCtrl:NavController,
    public subs:SubscribableService,
  ) {
    this.langValue = this.mockLang[0];
  }

  ionViewWillEnter(){
    this.saveChanges=false;
  }
  ngOnInit() {
  }
  blur(){
    console.log('blur');
  }
  checkInput(_e){
    this.langPick = !this.langPick;
    console.log(_e);
  }
  setLang(_v){
    this.langValue = this.mockLang[_v];
    this.langPick = false;
  }
  
  discard(){
    this.saveChanges = false;
    this.navCtrl.navigateForward(storageVariableNames.HOME);
  } 
  save(){
    this.saveChanges = true;
    this.navCtrl.navigateForward(storageVariableNames.HOME);
  }
  ionViewDidLeave(){
    if(!this.saveChanges){
      // Check the changes
    }
  }
}
