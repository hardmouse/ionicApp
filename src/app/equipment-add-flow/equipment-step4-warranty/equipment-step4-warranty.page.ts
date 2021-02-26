import { Component, OnInit, ɵɵgetCurrentView } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute} from '@angular/router';
import { MobileService } from '../../services/mobile.service';
import { FuncsService } from '../../services/funcs/funcs.service';
import { EquipmentAddFlowPage } from '../equipment-add-flow.page'
import { storageVariableNames,InputConReturn } from '../../common/type/common.model';
import { Step4WarrantyData, Step4ValidationData,Step2EquipTypeData,Step2ValidationData,ListItem,Step2EquipmentType,RequestEquiment} from '../../common/type/equipment-steps';
import { Storage } from '@ionic/storage';
import { SubscribableService } from '../../services/subscribable.service'
import { AlertService } from '../../common/service/alert.services';
import { OfflineQueryService } from '../../common/service/offline-query.service';

@Component({
  selector: 'app-equipment-step4-warranty',
  templateUrl: './equipment-step4-warranty.page.html',
  styleUrls: ['./equipment-step4-warranty.page.scss'],
})
export class EquipmentStep4WarrantyPage extends EquipmentAddFlowPage  implements OnInit {

  constructor(public navCtrl:NavController,private funcs: FuncsService, public storage: Storage,
    private mobile:MobileService,
    public route: ActivatedRoute,
    public subs:SubscribableService,
    public offlineQuery : OfflineQueryService,
    public alertService: AlertService) { 
    super(navCtrl,storage,route,subs,alertService);
    this.ConResponsibility = this.initPMResponsibility();
    this.step = 4;
  }

  step4Data:Step4WarrantyData;
  step4Val : Step4ValidationData = new Step4ValidationData();
  step4ValBak : Step4ValidationData = new Step4ValidationData();
  step2Data:Step2EquipmentType;
  step2Val : Step2ValidationData = new Step2ValidationData();
  ConResponsibility : ListItem[]=[];
  listConResponsibilityFiltered:ListItem[]=[];
  listOwnership:ListItem[]=[];
  listOwnershipFilter:ListItem[]=[];
  listAcquisitionStatus:ListItem[]=[];
  listAcquisitionStatusFilter:ListItem[]=[];
  listDispositionStatus:ListItem[]=[];
  listDispositionStatusFilter:ListItem[]=[];
  showStartDateTip:boolean = false;
  showKeyDateTip:boolean = false;
  showMRTip:boolean = false;
  minDate:string="";

  showNoResultOwnerShip:boolean;
  showNoResultAcquisitionStatus:boolean;
  showNoResultDispositionStatus:boolean;

  ionViewWillEnter() {
    this.initStep2Data();
    this.initStep4Data();
    this.subs.tipClosing.subscribe(value => {
      this.initTip(value);
    });
  }

  ngOnDestroy(){
    if (this.subs.tipClosing) {
      //this.subs.tipClosing.unsubscribe();
    }
  }
  
  initStep4Data(){
    this.minDate = this.initDatePicker();
    this.storage.get(storageVariableNames.STEP4DATAWARRENTY).then((data : Step4WarrantyData) => {
      if (data) {
        this.step4Data = data;
        this.MappingData();
      }
      else{
        this.step4Data = new Step4WarrantyData();
        this.step4Val = new Step4ValidationData(); 
        this.step4Val.isMaintenanceResponsibility = true;
        this.step4Val.isPurchasePriceValid = true;
        this.step4Val.StartDate = this.initStartDate();
        this.step4Val.KeyDate = this.initKeyDate();
        this.getStep4Procurement();
      }
    });
  }

  SaveToStorage(){   
    this.step4Data.VALDATA = this.step4Val;
    this.step4Data.DIRTYDATA = this.step4ValBak;
    if(this.step4Data.DIRTYDATA===undefined){
      this.step4Data.DIRTYDATA = new Step4ValidationData();
    }
   
    this.storage.set(storageVariableNames.STEP4DATAWARRENTY, this.step4Data);
  }

  MappingData(){
    if(this.step4Data !== undefined){
      this.listOwnership = this.step4Data.Ownership.ListOfItems;
      this.listAcquisitionStatus = this.step4Data.AcquisitionStatus.ListOfItems;
      this.listDispositionStatus = this.step4Data.DispositionStatus.ListOfItems;
      if(this.step4Data.VALDATA!==undefined){
        this.step4Val = this.step4Data.VALDATA;
        this.step4ValBak = this.step4Data.DIRTYDATA;
      }
      else{
        this.step4Val = new Step4ValidationData(); 
        this.step4Val.isMaintenanceResponsibility = true;
        this.step4Val.isPurchasePriceValid = true;
        if(this.subs.Mode=="ADD"){
          this.step4Val.StartDate = this.initStartDate();
          this.step4Val.KeyDate = this.initKeyDate();
        }
        
      }
    }
  }

  MappingData2(){
   
    if(this.step2Data.Data.VALDATA!==undefined){
      this.step2Val = this.step2Data.Data.VALDATA;
      this.subHeader.subheaderitems[3].subline = this.step2Val.BuildingItemCode;
    }
    
  }

  initStartDate(){
    let now = new Date();
    let current = new Date();
    if (now.getMonth() == 11) {
      current = new Date(now.getFullYear() + 1, 0, 1);
    } else {
      current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    return current.toString();
  }

  initKeyDate(){
    let t= new Date();
    let st = new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59)
    return (st.toString());
  }

  initStep2Data(){
    this.storage.get(storageVariableNames.STEP2DATAEQIPMENTTYPE).then((data : Step2EquipmentType) => {
      if (data) {
        this.step2Data = data;
        this.MappingData2();
        
      }
      else{
        this.step2Data = new Step2EquipmentType();
      }

    });
  }

  
  navigateToStep3Description(){
    this.SaveToStorage();
    this.navSubHeaderStatus(3);
    this.navCtrl.navigateForward(storageVariableNames.STEP3NAV,this.navigationExtras);
  }

  navigateToStep5Summary(){
    this.SaveToStorage();
    if(this.validateData()){
      this.subHeader.subheaderitems[3].isFinished = true;
      this.subHeader.subheaderitems[4].isFinished = true;
      this.subs.isJumpStep = true;
      this.SaveSubHeaderToStorage();
      this.navSubHeaderStatus(5);
      this.navCtrl.navigateForward(storageVariableNames.STEP5NAV,this.navigationExtras);
      
    }    
  }

  navigateJumpStep5(isSave:boolean){
    this.subHeader.subheaderitems.forEach(x=>x.isFinished = true);
    this.subs.isJumpStep = true;
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

  getStep4Procurement(){
    if(this.subs.isOffline){
      this.offlineQuery.getStep4EquipmentProcurementtData(this.BuildingId).then((sc : Step4WarrantyData)=>{
        this.step4Data = sc;
        this.MappingData();
        this.SaveToStorage();
      });
    }
    else{
      const url = 'equipment/equipmentprocurement/';
      let body : RequestEquiment = new RequestEquiment();
      body.BuildingId =  this.BuildingId;
      const request = JSON.stringify(body);
      this.mobile.post(url,request,"").subscribe( (sc : Step4WarrantyData)  =>{
        console.log(sc);
        this.step4Data = sc;
        this.MappingData();
        this.SaveToStorage();
      });
    }
    
  }

  validateData(){
    this.step4Val.DispositionStatus = (this.step4Val.DispositionStatusKey == "")? "":this.step4Val.DispositionStatus;
    this.step4Val.AcquisitionStatusValue = (this.step4Val.AcquisitionStatusKey == "")? "":this.step4Val.AcquisitionStatusValue;
    this.step4Val.ResponsibilityValue = (this.step4Val.ResponsibilityKey == "")? "":this.step4Val.ResponsibilityValue;
    this.step4Val.OwnershipValue = (this.step4Val.OwnershipKey == "")? "":this.step4Val.OwnershipValue;
    
    if(this.step4Val.isMaintenanceResponsibility==false){
      let _valcom : boolean = (this.step4Val.PMResponsibilityComment === undefined || this.step4Val.PMResponsibilityComment == "" )?false:true;
      let _valres : boolean = (this.step4Val.ResponsibilityValue === undefined || this.step4Val.ResponsibilityValue == "" )?false:true;
      
      if( !_valcom || !_valres ) {
        if(!_valcom) this.step4Val.isPMResponsibilityCommentValid = false;
        if(!_valres) this.step4Val.isResponsibilityValueValid = false;
        this.funcs.delay('vM');
        return false;
      }
    }
    if(!this.step4Val.isPurchasePriceValid){
      this.funcs.delay('vM2');
      return false;
    }
    return true;
  }

  navBackToJump($event){
    if(!this.validateDataChanged()){
      this.navSubHeaderStatus($event);
      this.navBackTo($event);
    }
    else{
      
      if(this.subs.isJumpStep){
        this.presentAlertSave($event);
      }
      else{
        this.SaveToStorage();
        this.SaveSubHeaderToStorage();
        this.navBackTo($event);
      }
    }
    
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
        this.SaveToStorage();
        this.SaveSubHeaderToStorage();
        this.navBackTo(_step);
      }
    }];
    this.alertService.backAlert(buttons);
  }
  
  validateDataChanged(){
    let isEditChanged = false;
    if(this.step4Val.WarrantyVenderName != this.step4ValBak.WarrantyVenderName || this.step4Val.StartDate != this.step4ValBak.StartDate || this.step4Val.KeyDate != this.step4ValBak.KeyDate || this.step4Val.DispositionStatus != this.step4ValBak.DispositionStatus){
      isEditChanged = true;
    }

    if(this.step4Val.InstallationDate != this.step4ValBak.InstallationDate || this.step4Val.PartsWarrantyDate != this.step4ValBak.PartsWarrantyDate || this.step4Val.LabourWarrantyDate != this.step4ValBak.LabourWarrantyDate || this.step4Val.PurchaseDate != this.step4ValBak.PurchaseDate){
      isEditChanged = true;
    }

    if(this.step4Val.isMaintenanceResponsibility != this.step4ValBak.isMaintenanceResponsibility || this.step4Val.ResponsibilityValue != this.step4ValBak.ResponsibilityValue || this.step4Val.PMResponsibilityComment != this.step4ValBak.PMResponsibilityComment){
      isEditChanged = true;
    }

    if(this.step4Val.PurchasePrice != this.step4ValBak.PurchasePrice || this.step4Val.OwnershipValue != this.step4ValBak.OwnershipValue || this.step4Val.AcquisitionStatusValue != this.step4ValBak.AcquisitionStatusValue){
      isEditChanged = true;
    }

    if(isEditChanged){
      return true;
    }
    else{
      return false;
    }
    
  }

  maintenanceResponsibility(isresponse:number){
    this.step4Val.isMaintenanceResponsibility = (isresponse==1)?true:false;
    this.step4Val.isResponsibilityValueValid = true;
    this.step4Val.isPMResponsibilityCommentValid = true;
  }

  

  getInputResponsibilityValue(rv :InputConReturn){
    this.step4Val.ResponsibilityValue = (rv.value!==undefined)?rv.value.trim():"";
    this.listConResponsibilityFiltered = [];
    this.step4Val.ResponsibilityKey = "";
    this.ConResponsibility.forEach(_v=>{
      if(_v.Value.toLocaleLowerCase().indexOf(this.step4Val.ResponsibilityValue.toLocaleLowerCase())>=0){
        this.listConResponsibilityFiltered.push(_v);
      }
    });
    if(this.listConResponsibilityFiltered.length>0){
      this.step4Val.showConResponsibilityList = true;
    }
  }

  hideResponSearchs(){
    this.step4Val.showConResponsibilityList = false;
  }

  selectResponItem(index:number){
    let _v = this.ConResponsibility[index];
    this.step4Val.ResponsibilityValue = _v.Value;
    this.step4Val.ResponsibilityKey = _v.Key;
    this.step4Val.showConResponsibilityList = false;
    this.step4Val.isResponsibilityValueValid = true;
  }

  getInputPMComment(rv :InputConReturn){
    this.step4Val.PMResponsibilityComment = (rv.value!==undefined)?rv.value.trim():"";
    this.step4Val.isPMResponsibilityCommentValid = (this.step4Val.PMResponsibilityComment == "")?false:true;
  }

  getInputWarrentVenderName(rv :InputConReturn){
    this.step4Val.WarrantyVenderName = (rv.value!==undefined)?rv.value.trim():"";
  }

  getInputOwnershipValue(rv :InputConReturn){
    // if(this.step4Val.showOwnershipValue == true){
    //   this.step4Val.showOwnershipValue = false;
    //   return;
    // }

    this.step4Val.OwnershipValue = (rv.value!==undefined)?rv.value.trim():"";
    this.listOwnershipFilter = [];
    this.step4Val.OwnershipKey = "";
    this.listOwnership.forEach(_v=>{
      if(_v.Value.toLocaleLowerCase().indexOf(this.step4Val.OwnershipValue.toLocaleLowerCase())>=0){
        this.listOwnershipFilter.push(_v);
      }
    });
    if(this.listOwnershipFilter.length>0){
      this.step4Val.showOwnershipValue = true;
    }
    else{
      this.step4Val.showOwnershipValue = true;
      if(this.listOwnershipFilter.length==0){
        this.showNoResultOwnerShip = true;
      }
      else{
        this.showNoResultOwnerShip = false;
      }
    }
  }

  getPurchasePriceValue(rv :InputConReturn){
    this.step4Val.PurchasePrice = (rv.value!==undefined)?rv.value.trim():"";
    if(this.funcs.isFloat(rv.value.trim()) ){
      this.step4Val.isPurchasePriceValid = true;
    }
    else{
      if(rv.value.trim() != ""){
        this.step4Val.isPurchasePriceValid = false;
      }
      else{
        this.step4Val.isPurchasePriceValid = true;
      }
      
    }
  }

  hideOwnershipSearchs(){
    this.step4Val.showOwnershipValue = false;
  }

  selectOwnershipItem(index:number){
    let _v = this.listOwnership[index];
    this.step4Val.OwnershipValue = _v.Value;
    this.step4Val.OwnershipKey = _v.Key;
    this.step4Val.showOwnershipValue = false;
  }

  getInputAcquisitionStatusValue(rv :InputConReturn){

    if(this.step4Val.showAcquisitionStatusValue == true){
      this.step4Val.showAcquisitionStatusValue = false;
      return;
    }
    this.step4Val.AcquisitionStatusValue = (rv.value!==undefined)?rv.value.trim():"";
    this.listAcquisitionStatusFilter = [];
    this.step4Val.AcquisitionStatusKey= "";
    this.listAcquisitionStatus.forEach(_v=>{
      if(_v.Value.toLocaleLowerCase().indexOf(this.step4Val.AcquisitionStatusValue.toLocaleLowerCase())>=0){
        this.listAcquisitionStatusFilter.push(_v);
      }
    });
    if(this.listAcquisitionStatusFilter.length>0){
      this.step4Val.showAcquisitionStatusValue = true;
    }
    else{
      this.step4Val.showAcquisitionStatusValue = true;
      if(this.listAcquisitionStatusFilter.length==0){
        this.showNoResultAcquisitionStatus = true;
      }
      else{
        this.showNoResultAcquisitionStatus = false;
      }
    }
  }

  hideAcquisitionStatusSearchs(){
    this.step4Val.showAcquisitionStatusValue = false;
  }

  selectAcquisitionStatus(index:number){
    let _v = this.listAcquisitionStatus[index];
    this.step4Val.AcquisitionStatusValue = _v.Value;
    this.step4Val.AcquisitionStatusKey = _v.Key;
    this.step4Val.showAcquisitionStatusValue = false;
  }

  getInputDispositionStatusValue(rv :InputConReturn){

    if(this.step4Val.showDispositionStatus == true){
      this.step4Val.showDispositionStatus = false;
      return;
    }

    this.step4Val.DispositionStatus = (rv.value!==undefined)?rv.value.trim():"";
    this.listDispositionStatusFilter = [];
    this.step4Val.DispositionStatusKey = "";
    this.listDispositionStatus.forEach(_v=>{
      if(_v.Value.toLocaleLowerCase().indexOf(this.step4Val.DispositionStatus.toLocaleLowerCase())>=0){
        this.listDispositionStatusFilter.push(_v);
      }
    });
    if(this.listDispositionStatusFilter.length>0){
      this.step4Val.showDispositionStatus = true;
    }
    else{
      this.step4Val.showDispositionStatus = true;
      if(this.listDispositionStatusFilter.length==0){
        this.showNoResultDispositionStatus = true;
      }
      else{
        this.showNoResultDispositionStatus = false;
      }
    }
  }

  hideDispositionStatusSearchs(){
    this.step4Val.showDispositionStatus = false;
  }

  selectDispositionStatus(index:number){
    let _v = this.listDispositionStatus[index];
    this.step4Val.DispositionStatus = _v.Value;
    this.step4Val.DispositionStatusKey = _v.Key;
    this.step4Val.showDispositionStatus = false;
  }

  showTip(tipName:string){
    this.subs.tipClosing.next(tipName);
  }

  initTip(tipName){
    if(tipName == "StartDate"){
      this.showStartDateTip = !this.showStartDateTip;;
    }
    else{
      this.showStartDateTip = false;
    }

    if(tipName == "MR"){
      this.showMRTip = !this.showMRTip;;
    }
    else{
      this.showMRTip = false;
    }

    if(tipName == "KeyDate"){
      this.showKeyDateTip = !this.showKeyDateTip;;
    }
    else{
      this.showKeyDateTip = false;
    }
  }

  initDatePicker(){
    let today = new Date();
    let _m = today.getMonth()+1;
    let _sm= _m.toString();
    if(_m<10){
      _sm = "0"+_m.toString();
    }
    let _d = today.getDate();
    let _sd = _d.toString();
    if(_d<10){
      _sd = "0"+_m.toString();
    }
    let st = today.getFullYear()+'-'+_sm+'-'+_sd;
    return st;
  }


  resetDispositionStatusInput(){
    this.showNoResultDispositionStatus=false;
    this.step4Val.showDispositionStatus=false;
    if(this.step4Val.DispositionStatusKey==""){
      this.step4Val.DispositionStatus = "";
    }
  }

  resetAcquisitionStatusInput(){
    this.showNoResultAcquisitionStatus=false;
    this.step4Val.showAcquisitionStatusValue=false;
    if(this.step4Val.AcquisitionStatusKey==""){
      this.step4Val.AcquisitionStatusValue = "";
    }
  }

  resetOwnerShipInput(){
    this.showNoResultOwnerShip=false;
    this.step4Val.showOwnershipValue=false;
    if(this.step4Val.OwnershipKey==""){
      this.step4Val.OwnershipValue = "";
    }
  }

  closeDropdown(){
    if(this.step4Val.showOwnershipValue){
      this.step4Val.showOwnershipValue = false;
    }

    if(this.step4Val.showAcquisitionStatusValue){
      this.step4Val.showAcquisitionStatusValue = false;
    }

    if(this.step4Val.showDispositionStatus){
      this.step4Val.showDispositionStatus=false;
    }
    
  }     

}
