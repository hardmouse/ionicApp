import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute,NavigationExtras } from '@angular/router';
import { EquipmentSubHeader,EquipmentSubHeaderItem } from '../common/type/common.model';
import { RadioListItem,ListItem } from '../common/type/equipment-steps';
import { storageVariableNames} from '../common/type/common.model';
import { Storage } from '@ionic/storage';
import { SubscribableService } from '../services/subscribable.service'
import { AlertService } from '../common/service/alert.services';

@Component({
  selector: 'app-equipment-add-flow',
  templateUrl: './equipment-add-flow.page.html',
  styleUrls: ['./equipment-add-flow.page.scss'],
})
export class EquipmentAddFlowPage implements OnInit {

  subHeader:EquipmentSubHeader = new EquipmentSubHeader();
  BuildingId:string="";
  BuildingItemId:string="";
  Mode:string="ADD";
  navigationExtras: NavigationExtras;
  isJumpStep:boolean;
  step:number=0;
  constructor(public navCtrl2:NavController,public storage: Storage, 
    public route: ActivatedRoute, 
    public subs:SubscribableService,
    public alertService: AlertService) { 
    this.initSubHeaderStatus();
    this.route.queryParams.subscribe(params => {
      if(params.BuildingId !== undefined){
        this.BuildingId = JSON.parse(params.BuildingId);
        if(params.Mode != undefined){
          this.Mode = JSON.parse(params.Mode);
          this.subs.Mode = this.Mode;
        }
        if(this.subs.Mode == "EDIT" && params.BuildingItemId !== undefined){
          this.BuildingItemId = JSON.parse(params.BuildingItemId);
        }
        this.initBuildingIdParam();
      }
    });
    
  }

  ngOnInit() {
    
  }

  navBackTo(_step){
    switch(_step){
      case 1:{
        this.navSubHeaderStatus(1);
        this.navCtrl2.navigateForward(storageVariableNames.STEP1NAV,this.navigationExtras);
        break; 
      }
      case 2:{
        this.navSubHeaderStatus(2);
        this.navCtrl2.navigateForward(storageVariableNames.STEP2NAV,this.navigationExtras);
        break; 
      }
      case 3:{
        this.navSubHeaderStatus(3);
        this.navCtrl2.navigateForward(storageVariableNames.STEP3NAV,this.navigationExtras);
        break; 
      }
      case 4:{
        this.navSubHeaderStatus(4);
        this.navCtrl2.navigateForward(storageVariableNames.STEP4NAV,this.navigationExtras);
        break; 
      }
      case 5:{
        this.navSubHeaderStatus(5);
        this.navCtrl2.navigateForward(storageVariableNames.STEP5NAV,this.navigationExtras);
        break; 
      }
    }
  }

  initSubHeaderStatus(){
    this.storage.get(storageVariableNames.SUBHEADER).then((data : EquipmentSubHeader) => {
      if (data) {
        this.subHeader = data;
        if(this.subHeader.subheaderitems===undefined){
          this.initSubHeader();
        }
      }
      else{
        this.initSubHeader();
      }
      this.subHeader.subheaderitems.forEach(x=>x.isCurrentStep = false);
      this.subHeader.subheaderitems[this.step-1].isCurrentStep = true;
      this.subs.subHeader.next(this.subHeader);
    });
  }

  navSubHeaderStatus(step:number){
    if(this.subs.Mode=="EDIT"){
      this.subs.isEditChanged = true;
    }
    
    this.storage.get(storageVariableNames.SUBHEADER).then((data : EquipmentSubHeader) => {
      if (data) {
        this.subHeader = data;
      }
      else{
        this.initSubHeader();
      }
      this.subHeader.subheaderitems.forEach(x=>x.isCurrentStep = false);
      this.subHeader.subheaderitems[step-1].isCurrentStep = true;
      this.SaveSubHeaderToStorage();
      this.subs.subHeader.next(this.subHeader);
      
    });
  }

  changeSubHeaderLine(step:number,newsubline:string){
    this.storage.get(storageVariableNames.SUBHEADER).then((data : EquipmentSubHeader) => {
      if (data) {
        this.subHeader = data;
      }
      
      this.subHeader.subheaderitems.forEach(x=>x.isCurrentStep = false);
      this.subHeader.subheaderitems[step-1].isCurrentStep = true;
      this.subHeader.subheaderitems[step-1].subline = newsubline;
      this.SaveSubHeaderToStorage();
      this.subs.subHeader.next(this.subHeader);
      if(this.subHeader.subheaderitems.findIndex(x=>x.isFinished == false)<0){
        this.isJumpStep = true;
      }
      else{
        this.isJumpStep = false;
      }
    });
  }

  resetSubHeaderStatus(){
    this.initSubHeader();
    this.subHeader.subheaderitems[0].isCurrentStep = true;
    this.storage.set(storageVariableNames.SUBHEADER,this.subHeader);
  }

  SaveSubHeaderToStorage(){   
    this.storage.set(storageVariableNames.SUBHEADER, this.subHeader);
  }

  initBuildingIdParam(){
    this.navigationExtras = {
      queryParams: {
          BuildingId: JSON.stringify(this.BuildingId)
      }
    };
  }

  initEditModeSubHeader(){
      this.storage.get(storageVariableNames.SUBHEADER).then((data : EquipmentSubHeader) => {
        if (data) {
          this.subHeader = data;
        }
        else{
          this.initSubHeader();
        }
        this.subHeader.subheaderitems.forEach(x=>x.isCurrentStep = false);
        this.subHeader.subheaderitems[5-1].isCurrentStep = true;
        this.subHeader.subheaderitems.forEach(x=>x.isFinished = true);
        this.subHeader.subheaderitems[4].subline = this.subs.BuildingItemCode;
        this.subHeader.subheaderitems[3].subline = this.subs.BuildingItemCode;
        this.subHeader.subheaderitems[2].subline = this.subs.BuildingItemCode;
       
        this.subs.subHeader.next(this.subHeader);
        this.SaveSubHeaderToStorage();
        
      });
   
  }

  // async presentAlertSave(_step) {
  //   let buttons = [{
  //     text: 'Cancel',
  //     role: 'cancel',
  //     cssClass: 'button-1',
  //     handler: (blah) => {
  //       console.log('Confirm Cancel: blah');
  //     }
  //   }, {
  //     text: 'Continue',
  //     cssClass: 'button-2',
  //     handler: () => {
  //       this.navBackTo(_step);
  //     }
  //   }];
  //   this.alertService.backAlert(buttons);
  // }

  initSubHeader(){
    this.subHeader = new EquipmentSubHeader();
    this.subHeader.total = 5;
    this.subHeader.subheaderitems = [];
    let step1 : EquipmentSubHeaderItem = new EquipmentSubHeaderItem();
    step1.name = "Location";
    step1.description = "1. Location";
    step1.isCurrentStep = false;
    step1.isFinished = false;
    step1.title = "Location";
    step1.subline = "";
    step1.step = 1;
    step1.mode = (this.Mode == "ADD") ? 1 : 2;
    this.subHeader.subheaderitems.push(step1);
    let step2 : EquipmentSubHeaderItem = new EquipmentSubHeaderItem();
    step2.name = "Equipment";
    step2.description = "2. Equipment";
    step2.isCurrentStep = false;
    step2.isFinished = false;
    step2.title = "Equipment";
    step2.subline = "";
    step2.step = 2;
    step2.mode = (this.Mode == "ADD") ? 1 : 2;
    this.subHeader.subheaderitems.push(step2);
    let step3 : EquipmentSubHeaderItem = new EquipmentSubHeaderItem();
    step3.name = "Details";
    step3.description = "3. Equipment Details";
    step3.isCurrentStep = false;
    step3.isFinished = false;
    step3.title = "Equipment Details";
    step3.subline = "";
    step3.step = 3;
    step3.mode = (this.Mode == "ADD") ? 1 : 2;
    this.subHeader.subheaderitems.push(step3);
    let step4 : EquipmentSubHeaderItem = new EquipmentSubHeaderItem();
    step4.name = "Maintenance Dates";
    step4.description = "4. Maintenance Dates";
    step4.isCurrentStep = false;
    step4.isFinished = false;
    step4.title = "Maintenance Dates";
    step4.subline = "";
    step4.step = 4;
    step4.mode = (this.Mode == "ADD") ? 1 : 2;
    this.subHeader.subheaderitems.push(step4);
    let step5 : EquipmentSubHeaderItem = new EquipmentSubHeaderItem();
    step5.name = "Summary";
    step5.description = "5. Summary";
    step5.isCurrentStep = false;
    step5.isFinished = false;
    step5.title = "Summary";
    step5.subline = "";
    step5.step = 5;
    step5.mode = (this.Mode == "ADD") ? 1 : 2;
    this.subHeader.subheaderitems.push(step5);

    
  }

  initCapacity(){
    let Criticality :RadioListItem[] = [];
    let r1 : RadioListItem = new RadioListItem();
    r1.Key = "1";
    r1.Value = "1 - Critical";
    r1.Checked = false;
    Criticality.push(r1);
    let r2 : RadioListItem = new RadioListItem();
    r2.Key = "2";
    r2.Value = "2 - Minimal Impact";
    r2.Checked = false;
    Criticality.push(r2);
    let r3 : RadioListItem = new RadioListItem();
    r3.Key = "3";
    r3.Value = "3 - Non-Critical";
    r3.Checked = false;
    Criticality.push(r3);
    let r4 : RadioListItem = new RadioListItem();
    r4.Key = "4";
    r4.Value = "4 - Critical Environment";
    r4.Checked = false;
    Criticality.push(r4);
    return Criticality;
  }

  initConditionRate(){
    let Rate :RadioListItem[] = [];
    let r1 : RadioListItem = new RadioListItem();
    r1.Key = "1";
    r1.Value = "1 - New";
    r1.Checked = false;
    Rate.push(r1);
    let r2 : RadioListItem = new RadioListItem();
    r2.Key = "2";
    r2.Value = "2 - Good";
    r2.Checked = false;
    Rate.push(r2);
    let r3 : RadioListItem = new RadioListItem();
    r3.Key = "3";
    r3.Value = "3 - Fair";
    r3.Checked = false;
    Rate.push(r3);
    let r4 : RadioListItem = new RadioListItem();
    r4.Key = "4";
    r4.Value = "4 - Poor";
    r4.Checked = false;
    Rate.push(r4);
    let r5 : RadioListItem = new RadioListItem();
    r5.Key = "5";
    r5.Value = "5 - Critical";
    r5.Checked = false;
    Rate.push(r5);
    return Rate;
  }

  initPMResponsibility(){
    let Res :ListItem[] = [];
    let r1 : ListItem = new ListItem();
    r1.Key = "1";
    r1.Value = "Client responsibility";
    Res.push(r1);
    let r2 : ListItem = new ListItem();
    r2.Key = "2";
    r2.Value = "Tenant Responsibility";
    Res.push(r2);
    let r3 : ListItem = new ListItem();
    r3.Key = "3";
    r3.Value = "Landlord Responsibility";
    Res.push(r3);
    return Res;
  }
 
}
