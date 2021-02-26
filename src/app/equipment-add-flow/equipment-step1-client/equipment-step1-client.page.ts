import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { InputConReturn,storageVariableNames, } from '../../common/type/common.model';
import { EquipmentAddFlowPage } from '../equipment-add-flow.page'
import { MobileService } from '../../services/mobile.service';
import { FuncsService } from '../../services/funcs/funcs.service';
import { Step1Client,Step1ClientData, Step1ValidationData,ListItem,StepValidationData,RadioListItem,RequestEquiment } from '../../common/type/equipment-steps'
import { Storage } from '@ionic/storage';
import { SubscribableService } from '../../services/subscribable.service';
import { TooltipPopComponent } from '../../common/tooltip-pop/tooltip-pop.component';
import { AlertService } from '../../common/service/alert.services';
import { OfflineQueryService } from '../../common/service/offline-query.service';

@Component({
  selector: 'app-equipment-step1-client',
  templateUrl: './equipment-step1-client.page.html',
  styleUrls: ['./equipment-step1-client.page.scss'],
})
export class EquipmentStep1ClientPage extends EquipmentAddFlowPage implements OnInit {
  constructor(public navCtrl:NavController,public route: ActivatedRoute, 
    private mobile:MobileService,
    private funcs: FuncsService,
    public subs:SubscribableService,
    public alertService: AlertService,
    public storage: Storage,
    public offlineQuery : OfflineQueryService,
    public popoverController: PopoverController
    ) {
    super(navCtrl,storage,route,subs,alertService); 
    this.step = 1;
    this.Criticality = this.initCapacity();
    
   }

  step1Data : Step1Client = new Step1Client();
  listFloors:ListItem[]=[];
  listFloorsFilter:ListItem[]=[];
  listAreas:ListItem[]=[];
  listAreasFilter:ListItem[]=[];
  showNoResultFloor:boolean = false;
  showNoResultArea:boolean = false;
  
  Criticality : RadioListItem[]=[];
  stepVal : StepValidationData = new StepValidationData();
  step1Val : Step1ValidationData = new Step1ValidationData();
  step1ValBak: Step1ValidationData = new Step1ValidationData();
  showCriticalityTip:boolean=false;
  isEditChanged:boolean;
  currentPopover:any;
  
  ionViewWillEnter() {
    this.isEditChanged = false;
    this.initStep1Data();
    this.funcs.delay('vFloor');
    // this.subs.tipClosing.subscribe(value => {
    //   console.log("----------------------------",value," should be criticalityTip");
    //   if(value !== "criticalityTip"){
        this.showCriticalityTip = false;
    //   }else{
    //     this.showCriticalityTip = !this.showCriticalityTip;
    //   }
    // });
  }

  ngOnDestroy(){
    if (this.subs.tipClosing) {
      //this.subs.tipClosing.unsubscribe();
    }
  }
  navigateToSearchEdit(){
    this.subHeader.subheaderitems.forEach(x=>x.isFinished = false);
    this.SaveSubHeaderToStorage();
    this.navCtrl.navigateForward(storageVariableNames.HOME);
  }

  navigateToType(){
    this.SaveToStorage();
    if(this.validateData()){
      this.subHeader.subheaderitems[0].isFinished = true;
      this.SaveSubHeaderToStorage();
      this.navSubHeaderStatus(2);
      this.navCtrl.navigateForward(storageVariableNames.STEP2NAV,this.navigationExtras);
    }
  }

  navigateJumpStep5(isSave:boolean){
    this.subHeader.subheaderitems.forEach(x=>x.isFinished = true);
    if(isSave){
      this.SaveToStorage();
      if(this.validateData()){
        this.SaveSubHeaderToStorage();
        this.navSubHeaderStatus(5);
        this.navCtrl.navigateForward(storageVariableNames.STEP5NAV,this.navigationExtras);    
      }  
    }   
    else{
      this.navSubHeaderStatus(5);
      this.navCtrl.navigateForward(storageVariableNames.STEP5NAV,this.navigationExtras);    
    } 
  }

  navBackToJump($event){
    if(!this.validateDataChanged()){
      this.navSubHeaderStatus($event);
      this.navBackTo($event);
    }
    else{
      if(this.validateData() && this.subs.isJumpStep){
        this.presentAlertSave($event);
      }
      else{
        this.SaveToStorage();
        this.navSubHeaderStatus($event);
        this.navBackTo($event);
      }  
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
        this.navigateToSearchEdit();
      }
    }];
    this.alertService.backAlert(buttons);
  }

  async presentAlertSave(_step) {
    let buttons = [{
      text: 'Discard Changes',
      role: 'cancel',
      cssClass: 'button-1',
      handler: (blah) => {
        console.log('Confirm Cancel: blah');
        this.navSubHeaderStatus(_step);
        this.navBackTo(_step);  
      }
    }, {
      text: 'Save Changes',
      cssClass: 'button-2',
      handler: () => {
        this.subs.clearMode();
        this.SaveToStorage();
        this.SaveSubHeaderToStorage();
        this.navBackTo(_step);
      }
    }];
    this.alertService.backAlert(buttons);
  }

  getStep1ClientData(){

    if(this.subs.isOffline){
      this.offlineQuery.getStep1ClientData(this.BuildingId).then((sc : Step1ClientData)=>{
        this.step1Data.Data = sc;
        this.step1Data.Data.BuildingId = this.BuildingId;
        this.MappingData();
        this.SaveToStorage();
      });
    }
    else{
      const url = 'equipment/equipmentclient/';
      let body : RequestEquiment = new RequestEquiment();
      body.BuildingId =  this.BuildingId;
      const request = JSON.stringify(body);
      this.mobile.post(url,request,"").subscribe( (sc : Step1ClientData)  =>{
          console.log(sc);
          this.step1Data.Data = sc;
          this.MappingData();
          this.SaveToStorage();
        });
    }
  }

  MappingData(){
    if(this.step1Data.Data!== undefined && this.step1Data.Data.VALDATA !== undefined){
      this.step1Val = this.step1Data.Data.VALDATA;

      this.step1ValBak = this.step1Data.Data.DIRTYDATA;
      if(this.step1ValBak===undefined){
        this.step1ValBak = new Step1ValidationData();
      }
      this.validateDataChanged();
    }
    else{
      this.step1Val = new Step1ValidationData();
    }
    this.listFloors = (this.step1Data.Data.Floor)?this.step1Data.Data.Floor.ListOfItems:[];
    this.listAreas = (this.step1Data.Data.Area)?this.step1Data.Data.Area.ListOfItems:[];
    this.step1Val.RegionDesc = this.step1Data.Data.RegionDescription;
    this.step1Val.FMZDesc = this.step1Data.Data.FmzDescription;
    this.step1Val.BuildingDesc = this.step1Data.Data.BuildingDescription;
    //this.mappingBakFields();
  }

  validateData(){
    this.resetAllInputs();
    if(this.step1Val.floorSearchKey != ""){
      this.step1Val.isFloorInputValid = true;
      if(this.listAreasFilter.length >0 && this.step1Val.areaSearchValue != ""){
        if(this.listAreasFilter.findIndex(a=>a.Value==this.step1Val.areaSearchValue)>=0)
        {
          this.step1Val.isAreaInputValid = true;
        }
        else{
          this.step1Val.isAreaInputValid = false;
         
        }
        
      }
      else{
        this.step1Val.isAreaInputValid = true;
      }
    }
    else{
      if(this.step1Val.isInsideBuilding==1) {this.step1Val.isFloorInputValid = false;}
      else{  this.step1Val.isFloorInputValid = true;};
      this.step1Val.isAreaInputValid = true;
      this.step1Val.showAreaSearchList = false;
      this.step1Val.floorSearchValue = "";
      this.funcs.delay('vFloor');
    }
    
    if(this.step1Val.CriticalityValue ==""){
      this.step1Val.isCriticalityValid = false;
    }
    
    return this.step1Val.isAreaInputValid && this.step1Val.isFloorInputValid && this.step1Val.isCriticalityValid;
  }

  validateDataChanged(){
    this.isEditChanged = false;
    if(this.step1Val.CriticalityValue != this.step1ValBak.CriticalityValue || this.step1Val.floorSearchKey != this.step1ValBak.floorSearchKey){
      this.isEditChanged = true;
    }

    if(this.step1Val.areaSearchValue != this.step1ValBak.areaSearchValue || this.step1Val.isInHerigageArea != this.step1ValBak.isInHerigageArea){
      this.isEditChanged = true;
    }

    if(this.step1Val.ClientCode != this.step1ValBak.ClientCode || this.step1Val.ClientLocation != this.step1ValBak.ClientLocation || this.step1Val.SpecificLocation != this.step1ValBak.SpecificLocation){
      this.isEditChanged = true;
    }
    if(this.isEditChanged){
      return true;
    }
    else{
      return false;
    }
    
  }

  switchEquipment(isInside:number){
    this.step1Val.isInsideBuilding = isInside;
    this.step1Val.showFloorRow = (this.step1Val.isInsideBuilding == 1)?true:false;
  }

  switchHeritage(index:number){
    this.step1Val.isInHerigageArea = (index == 0)?false:true;
  }

  closeDropdown(){
    if(this.step1Val.showFloorSearchList){
      this.step1Val.showFloorSearchList = false;
    }
  }
  
  selectFloorItem(index:number){
    let _v = this.listFloorsFilter[index];
    this.step1Val.floorSearchValue = _v.Value;
    this.step1Val.floorSearchKey = _v.Key;
    this.step1Val.showFloorSearchList = false;
    this.listAreasFilter = [];
    this.step1Val.areaSearchValue ="";
    this.step1Val.isFloorInputValid = true;
    this.step1Val.isAreaInputValid = true;
    this.listAreasFilter = this.listAreas.filter(x=>x.ParentId == _v.Key);
    if(this.listAreasFilter.length>0){
      this.step1Val.showAreaRow = true;
    }
    else{
      this.step1Val.showAreaRow = false;
    }
    
  }

  getFloorInputConValue(rv :InputConReturn){
    this.step1Val.floorSearchValue = (rv.value!==undefined)?rv.value.trim():"";
    this.step1Val.floorSearchKey = "";
    this.listFloorsFilter = [];
    this.listFloors.forEach(u=>{
      let _v = u;
      if(_v.Value.toLocaleLowerCase().indexOf(this.step1Val.floorSearchValue.toLocaleLowerCase())>=0){
        this.listFloorsFilter.push(u);
      }
    })
    if(this.listFloorsFilter.length >0){
      this.step1Val.showFloorSearchList = true;
      this.showNoResultFloor = false;
    }
    else{
      this.step1Val.showFloorSearchList = true;
      if(this.listFloorsFilter.length==0){
        this.showNoResultFloor = true;
      }
      else{
        this.showNoResultFloor = false;
      }
    }

    
    this.listAreasFilter = [];
    this.step1Val.areaSearchValue ="";
    this.step1Val.isAreaInputValid = true;  
    this.step1Val.showAreaSearchList = false;
  }

  resetFloorInput(){
    this.showNoResultFloor=false;
    this.step1Val.showFloorSearchList=false;
    this.step1Val.floorSearchKey = "";
    this.step1Val.floorSearchValue = "";
  }

  resetAreaInput(){
    this.showNoResultArea=false;
    this.step1Val.showAreaSearchList=false;
    this.step1Val.areaSearchKey = "";
    this.step1Val.areaSearchValue = "";
  }

  resetAllInputs(){
    this.showNoResultFloor=false;
    this.step1Val.showFloorSearchList=false;
    if(this.step1Val.floorSearchKey==""){
      this.step1Val.floorSearchValue = "";
    }

    this.showNoResultArea=false;
    this.step1Val.showAreaSearchList=false;
    if(this.step1Val.areaSearchKey==""){
      this.step1Val.areaSearchValue = "";
    }
  }

  showFloorSearchs(){
    if(!this.step1Val.showFloorSearchList){
      this.step1Val.showFloorSearchList = true; 
      this.listFloorsFilter = [];
      this.listFloors.forEach(u=>{
        let _v = u;
        if(_v.Value.toLocaleLowerCase().indexOf(this.step1Val.floorSearchValue.toLocaleLowerCase())>=0){
          this.listFloorsFilter.push(u);
        }
      })    
    }
  }

  hideSearchs(){
    this.step1Val.showFloorSearchList = false;
  }
  hideFloorSearchs2(){
    this.step1Val.showAreaSearchList = false;
    if(this.listAreasFilter.length == 0){
      this.step1Val.showAreaRow = false;
    }
    this.step1Val.showFloorSearchList = false;
    
  }
  /////////////////////////////////////////
  selectAreaItem(index:number){
    let _v = this.listAreasFilter[index];
    this.step1Val.areaSearchValue = _v.Value;
    this.step1Val.areaSearchKey = _v.Key;
    this.step1Val.showAreaSearchList = false;
    this.step1Val.isAreaInputValid = true;
  }

  getAreaInputConValue(rv :InputConReturn){
    this.step1Val.areaSearchValue = (rv.value!==undefined)?rv.value.trim():"";
    this.listAreasFilter = [];
    if(this.step1Val.floorSearchKey!=""){
      this.listAreas.filter(a=>a.ParentId == this.step1Val.floorSearchKey).forEach(u=>{
        let _v = u;
        if(_v.Value.toLocaleLowerCase().indexOf(this.step1Val.areaSearchValue.toLocaleLowerCase())>=0){
          this.listAreasFilter.push(u);
        }
      });
      if(this.listAreasFilter.length==0){
        this.step1Val.showAreaSearchList = false;
      }
      else{
        this.step1Val.showAreaSearchList = true;
      }
    }
    else{
      this.listAreasFilter = [];
      this.step1Val.showAreaSearchList = false;
    }
    
    this.hideSearchs();    
  }

 
  hideAreaSearchs(){
    this.step1Val.showAreaSearchList = false; 
  }

  getClientInfo(rv :InputConReturn,vt :string){
    if(vt=="clientcode"){
      this.step1Val.ClientCode = (rv.value!==undefined)?rv.value.trim():"";
    }
    else if(vt=="location"){
      this.step1Val.ClientLocation = (rv.value!==undefined)?rv.value.trim():"";
    }
    else if(vt=="specificlocation"){
      this.step1Val.SpecificLocation = (rv.value!==undefined)?rv.value.trim():"";
    }
  }

  showTipCriticality(){
    this.subs.tipClosing.next("criticalityTip");
    this.subs.publicTipShow = this.showCriticalityTip = !this.showCriticalityTip;
  }

  initStep1Data(){
    this.storage.get(storageVariableNames.STEP1DATACLIENTINFO).then((data : Step1Client)=> {
      if (data) {
        this.step1Data = data;
        this.MappingData();
      }
      else{
        this.step1Data = new Step1Client();
        this.navSubHeaderStatus(1);
        this.getStep1ClientData();
      }

    });
  }



  SaveToStorage(){
    if(this.step1Data.Data !==undefined) {
      this.step1Data.Data.VALDATA = this.step1Val;
      this.step1Data.Data.DIRTYDATA = this.step1ValBak;
      this.storage.set(storageVariableNames.STEP1DATACLIENTINFO, this.step1Data);
    }
  }


  async tooltip(title:any, msg: any) {
    console.log(msg);
    const popover = await this.popoverController.create({
      component: TooltipPopComponent,
      componentProps: {
        'title': title,
        "msg": msg
      },
      cssClass: 'tooltip-pop',
      // event: $event,
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
 
}
