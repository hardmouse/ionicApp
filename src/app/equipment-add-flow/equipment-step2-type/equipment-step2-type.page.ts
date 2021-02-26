import { Component, OnInit,ChangeDetectorRef  } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute} from '@angular/router';
import { MobileService } from '../../services/mobile.service';
import { LoadingController } from '@ionic/angular';
import { FuncsService } from '../../services/funcs/funcs.service';
import { EquipmentAddFlowPage } from '../equipment-add-flow.page'
import { BarcodeScanner, BarcodeScanResult } from '@ionic-native/barcode-scanner/ngx';

import { InputConReturn,storageVariableNames} from '../../common/type/common.model';
import { Step2EquipTypeData,Step2EquipmentType,ListItem,Uniformat,RequestEquimentCode,RequestEquiment,Step2ValidationData,UniformatDescription } from '../../common/type/equipment-steps'
import { Storage } from '@ionic/storage';
import { SubscribableService } from '../../services/subscribable.service';
import { AlertService } from '../../common/service/alert.services';
import { OfflineQueryService } from '../../common/service/offline-query.service';


@Component({
  selector: 'app-equipment-step2-type',
  templateUrl: './equipment-step2-type.page.html',
  styleUrls: ['./equipment-step2-type.page.scss'],
})
export class EquipmentStep2TypePage extends EquipmentAddFlowPage implements OnInit {

  constructor(private funcs: FuncsService,public navCtrl:NavController,
    public route: ActivatedRoute,
    private mobile:MobileService,
    public subs:SubscribableService,
    public barcodeScanner:BarcodeScanner,
    public alertService: AlertService,
    public offlineQuery : OfflineQueryService,
    public loadingController: LoadingController,
    public storage: Storage) {
    super(navCtrl,storage,route,subs,alertService); 
    this.step = 2;
   }

  
  step2Data:Step2EquipmentType = new Step2EquipmentType();
  
  ListUniformats: Uniformat[] = [];
  ListUniformatsFiltered: Uniformat[] = [];
  listParentItems:ListItem[]=[];
  listParentItemsFiltered:ListItem[]=[];
  listSystemTypeItems:ListItem[]=[];
  ListSystemTypeFiltered:ListItem[]=[];
  showNoResultUniformat:boolean;
  showNoResultParent:boolean;
  showNoResultSystemType:boolean;
  IsDFM :string="";
  step2Val : Step2ValidationData = new Step2ValidationData();
  step2ValBak : Step2ValidationData = new Step2ValidationData();
  showFieldItemTip:boolean = false;
  ionViewWillEnter() {
    this.initStep2Data();
  }
  
  onChangeModuleNumberEvent(rv :InputConReturn){
    this.step2Val.ModelNumber  = (rv.value!==undefined)?rv.value.trim():"";
  }

  onChangeManufactureEvent(rv :InputConReturn, m:string){
    if(m=="m1"){
      this.step2Val.Manufacturer = (rv.value!==undefined)?rv.value.trim():"";
    }
    else if(m=="m2"){
      this.step2Val.ModelName = (rv.value!==undefined)?rv.value.trim():"";
    }
    else if(m=="m3"){
      this.step2Val.SerialNumber = (rv.value!==undefined)?rv.value.trim():"";
    }
    
  }
  


  navigateToStep1Client(){
    this.SaveToStorage();
    this.navSubHeaderStatus(1);
    this.navCtrl.navigateForward(storageVariableNames.STEP1NAV,this.navigationExtras);
  }

  navigateToStep3Description(){
     this.SaveToStorage();
     if(this.validateData()){
      this.subHeader.subheaderitems[1].isFinished = true;
      this.SaveSubHeaderToStorage();
      this.navSubHeaderStatus(3);
      this.navCtrl.navigateForward(storageVariableNames.STEP3NAV,this.navigationExtras);
     }
  }

  navigateJumpStep5(isSave:boolean){
    this.subHeader.subheaderitems.forEach(x=>x.isFinished = true);
    if(isSave){
      this.validateDataChanged();
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
        this.SaveSubHeaderToStorage();
        this.navBackTo($event);
      }
    }
    
  }

  validateData(){
    this.resetAllInputs();
    this.step2Val.isUfmInputValid = !(this.step2Val.UniformatSearchValue =="")?true:false;
    if(this.step2Val.UniformatSearchValue ==""){
      this.step2Val.isUfmInputValid = false;
    }
    else{
      let _isV =false;
      let _f = this.ListUniformats.forEach(u=>{
        let _iv = (u.Code + ' - ' + u.UDescription).toUpperCase();
        if(_iv== this.step2Val.UniformatSearchValue.toUpperCase()){
          _isV = true;
          return;
        }
      });
      if(_isV){
        this.step2Val.isUfmInputValid = true;
      }
      else{
        this.step2Val.isUfmInputValid = false;
      }
    }

    this.step2Val.isSystemTypeValid = !(this.step2Val.SystemTypeValue =="")?true:false;
    this.step2Val.isDescValid = !(this.step2Val.DescriptionValue =="")?true:false;
    let isudfoption :boolean = true;
    if (this.step2Val.ParentItemSearchKey == "") this.step2Val.ParentItemSearchValue = "";
    
    if(this.step2Val.UniformatSelected.UDescList != null){
      this.step2Val.UniformatSelected.UDescList.forEach(u=>{
        if(u.IsRequired==true){
          if(u.UDFOptionSearchValue=="" || u.UDFOptionSearchValue === undefined){
              u.isSearchValueValid = false;
              isudfoption = false;
          }
        }
      })
    }
    if(this.step2Val.FieldItemNumber!="" && this.step2Val.FieldItemNumber.length!=9){
      this.funcs.delay('vBit3');
      this.step2Val.isFieldItemNumberValid=false;
      return false;
    }
    else{
      this.step2Val.isFieldItemNumberValid=true;
    }

    if(this.subs.isDFM=='N'){
      if(!this.step2Val.isUfmInputValid || !this.step2Val.isSystemTypeValid || !this.step2Val.isDescValid || !isudfoption ){
        if(!this.step2Val.isUfmInputValid  || !this.step2Val.isDescValid)
        this.funcs.delay('vBit');
        else if(!isudfoption)
        this.funcs.delay('vBit2');
        return false;
      }
      
    }
    else{
      if(!this.step2Val.isUfmInputValid || !this.step2Val.isDescValid || !isudfoption ){
        this.funcs.delay('vBit');
        return false;
      }
    }
    return true;
  
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
    if(this.step2Val.UniformatSearchValue != this.step2ValBak.UniformatSearchValue || this.step2Val.SystemTypeValue != this.step2ValBak.SystemTypeValue || this.step2Val.ManufacturerDate != this.step2ValBak.ManufacturerDate){
      isEditChanged = true;
    }

    if(this.step2Val.DescriptionValue != this.step2ValBak.DescriptionValue || this.step2Val.DescriptionFrValue != this.step2ValBak.DescriptionFrValue || this.step2Val.ParentItemSearchValue != this.step2ValBak.ParentItemSearchValue){
      isEditChanged = true;
    }

    if(this.step2Val.FieldItemNumber != this.step2ValBak.FieldItemNumber || this.step2Val.ModelNumber != this.step2ValBak.ModelNumber || this.step2Val.Manufacturer != this.step2ValBak.Manufacturer || this.step2Val.ModelName != this.step2ValBak.ModelName || this.step2Val.SerialNumber != this.step2ValBak.SerialNumber){
      isEditChanged = true;
    }
    if(this.step2Val.UniformatSelected.UDescList !==undefined && this.step2Val.UniformatSelected.UDescList !=null ){
      let nudf = this.step2Val.UniformatSelected.UDescList.map(x=>x.UDFOptionSearchValue);
      let oudf = this.step2ValBak.UniformatSelected.UDescList.map(x=>x.UDFOptionSearchValue);
      if (JSON.stringify(nudf) != JSON.stringify(oudf)) {
        isEditChanged = true;
      }
    }

    if(isEditChanged){
      return true;
    }
    else{
      return false;
    }
    
  }
  
  getStep2EquipmentTypeData(){
    if(this.subs.isOffline){
      this.offlineQuery.getStep2EquipmentTypetData(this.BuildingId).then((sc : Step2EquipTypeData)=>{
        this.step2Data.Data = sc;
        this.offlineQuery.getParentItemList(this.BuildingId).then((pa : ListItem[])=>{
          this.step2Data.Data.ParentItem.ListOfItems = pa;
          this.MappingData();
          this.SaveToStorage();
        });
      });
    }
    else{
      const url = 'equipment/eqiupmenttype/';
      let body : RequestEquiment = new RequestEquiment();
      body.BuildingId =  this.BuildingId;
      //add floor id; not 0 value
      const request = JSON.stringify(body);
      this.presentLoading();
      this.mobile.post(url,request,"").subscribe( (sc : Step2EquipTypeData)  =>{
        this.loading.dismiss();
        console.log(sc);
        this.step2Data.Data = sc;
        this.MappingData();
        this.SaveToStorage();
      });
    }
    
  }

  loading:any;
  async presentLoading() {
     this.loading = await this.loadingController.create({
      message: '',
    });
    await this.loading.present();
  }
  generateEquipmentCode(){
    let _eqnumber = "";
    if(this.subs.isOffline){
      let _systemTypeCode ="";
      if(this.step2Val.SystemTypeValue && this.step2Val.SystemTypeValue!=""){
        const _scode = this.step2Val.SystemTypeValue.split("-");
        if(_scode.length>0){
          _systemTypeCode =  _scode[0].trim();
        }
      }
      if(_systemTypeCode!=""){
        _eqnumber = this.BuildingId + "-" + this.step2Val.UniformatSelected.Code + "-" + _systemTypeCode + "-" + "000001";
      }
      else{
        if(this.step2Val.IsDFM == "Y"){
          _eqnumber = "EQ"+ "-" + this.BuildingId + "-" + this.step2Val.UniformatSelected.Code + "-" + "000001" ;
        }
        
      }
      this.step2Val.BuildingItemCode = _eqnumber;
      this.changeSubHeaderLine(2,this.step2Val.BuildingItemCode);
      
    }
    else{
      const url = 'equipment/makeequipmentnumber/';
      let body : RequestEquimentCode = new RequestEquimentCode();
      body.BuildingItemTypeCode = this.step2Val.UniformatSelected.Code;
      if(this.step2Val.SystemTypeValue && this.step2Val.SystemTypeValue!=""){
        const _scode = this.step2Val.SystemTypeValue.split("-");
        if(_scode.length>0){
          body.SystemTypeCode =  _scode[0].trim();
        }
      }
      
      body.UnitCode = "";
      body.BuildingId = this.BuildingId;
      const request = JSON.stringify(body);
      this.mobile.post(url, request,"").subscribe( (rs)  =>{
          console.log(rs);
          this.step2Val.BuildingItemCode = rs;
          this.changeSubHeaderLine(2,this.step2Val.BuildingItemCode);
        }
      );
    }
    
  }


  getInputSystemTypeValue(rv :InputConReturn){
    this.step2Val.SystemTypeValue = (rv.value!==undefined)?rv.value.trim():"";
    this.step2Val.showSystemTypeSearchList = !rv.isBlur;
    this.ListSystemTypeFiltered=[];
    this.listSystemTypeItems.forEach(u=>{
      let _v = u.Value.toLowerCase();
      if(_v.indexOf(this.step2Val.SystemTypeValue.toLocaleLowerCase())>=0){
        this.ListSystemTypeFiltered.push(u);
      }
    });
    if(this.ListSystemTypeFiltered.length==0){
      //this.step2Val.showSystemTypeSearchList = false;
      this.showNoResultSystemType = true;
    }
    else{
      this.showNoResultSystemType = false;
    }
    this.step2Val.showUniformatSearchList = false;
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList && this.step2Val.UniformatSelected.UDescList.length>0){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{x.showOptions = false;});
    }
  }

  selectSystemTypeItem(index:number){
    let _v = this.ListSystemTypeFiltered[index];
    this.step2Val.SystemTypeValue = _v.Value;
    this.step2Val.SystemTypeKey = _v.Key;
    this.step2Val.showSystemTypeSearchList = false;
    this.step2Val.isSystemTypeValid = true;
    this.generateEquipmentCode();
  }

  getInputDescConValue(rv :InputConReturn, lan:string){
    if(lan=='e'){
      this.step2Val.DescriptionValue = (rv.value!==undefined)?rv.value.trim():"";
      if(this.step2Val.DescriptionValue==""){
        this.step2Val.isDescValid = false;
      }
      else{
        this.step2Val.isDescValid = true;
      }
    }
    else{
      this.step2Val.DescriptionFrValue = (rv.value!==undefined)?rv.value.trim():"";
    }
  }

  getInputConUniformatValue(rv :InputConReturn){
    
    this.step2Val.UniformatSearchValue = (rv.value!==undefined)?rv.value.trim():"";
    this.step2Val.showUniformatSearchList = !rv.isBlur;
    this.step2Val.UniformatSelected = new Uniformat();
    this.ListUniformatsFiltered = [];
    this.ListUniformats.forEach(u=>{
      let _v = u.Code.toLowerCase() + " - " + u.UDescription.toLowerCase();
      if(_v.indexOf(this.step2Val.UniformatSearchValue.toLocaleLowerCase())>=0){
        this.ListUniformatsFiltered.push(u);
      }
    })
    if(this.ListUniformatsFiltered.length==0){
      this.showNoResultUniformat = true;
    }
    else{
      this.showNoResultUniformat = false;
    }
    this.step2Val.showParentItemSearchList=false;
    this.step2Val.showSystemTypeSearchList = false;
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList && this.step2Val.UniformatSelected.UDescList.length>0){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{x.showOptions = false;});
    }
  }
  resetUniformatInput(){
    this.step2Val.showUniformatSearchList=false;
    this.showNoResultUniformat=false;
    this.step2Val.UniformatSearchValue = "";
    this.step2Val.UniformatSearchKey = undefined;
  }

  resetAllInputs(){
    this.step2Val.showUniformatSearchList=false;
    this.showNoResultUniformat=false;
    if(this.step2Val.UniformatSearchKey==undefined){
      this.step2Val.UniformatSearchValue = "";
    }

    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{
        x.showOptions = false;
        x.showNoResult = false;
        if(x.UDFOptionSearchKey==""){
          x.UDFOptionSearchValue = "";
        };
      })
    }
    
    this.resetSystemInput();
    this.resetParentItemInput();
  }

  resetParentItemInput(){
    this.showNoResultParent=false;
    this.step2Val.showParentItemSearchList=false;
    if(this.step2Val.ParentItemSearchKey==""){
      this.step2Val.ParentItemSearchValue = "";
    }
  }

  resetSystemInput(){
    this.showNoResultSystemType=false;
    this.step2Val.showSystemTypeSearchList=false;
    if(this.step2Val.SystemTypeKey==""){
      this.step2Val.SystemTypeValue = "";
    }
  }
 
  showUnifomatSearchs(){
    if(!this.step2Val.showUniformatSearchList){
      this.step2Val.showUniformatSearchList = true; 
      this.ListUniformatsFiltered = [];
      this.ListUniformats.forEach(u=>{
        let _v = u.Code.toLowerCase() + " - " + u.UDescription.toLowerCase();
        if(_v.indexOf(this.step2Val.UniformatSearchValue.toLocaleLowerCase())>=0){
          this.ListUniformatsFiltered.push(u);
        }
      })
    }    
  }

  selectUniformatItem(index:number){
    let _v = this.ListUniformatsFiltered[index].Code + " - " + this.ListUniformatsFiltered[index].UDescription;
    this.step2Val.UniformatSearchValue = _v;
    
    this.step2Val.UniformatSelected = this.ListUniformatsFiltered[index];
    this.step2Val.UniformatSearchKey = parseInt(this.ListUniformatsFiltered[index].Id);
    
    this.step2Val.isUfmInputValid = true;
    this.step2Val.showUniformatSearchList = false;
    if(this.step2Val.UniformatSelected.UDescList){
      if( this.step2Val.UniformatSelected.UDescList.length>0){
        this.step2Val.UniformatSelected.UDescList.map(x=>{
          x.isSearchValueValid = true;
          x.ErrorDescription = 'Please enter a valid value.';
        });
         
        this.step2Val.showUDFSearchList = true; 
      }
    }
    
    this.step2Val.DescriptionValue = this.step2Val.UniformatSelected.UDescription;
    //this.step2Val.DescriptionFrValue = this.step2Val.UniformatSelected.UDescription;
    this.step2Val.isDescValid = true;
    this.generateEquipmentCode();
  }

  hideUfmSearchs(){
    this.step2Val.showUniformatSearchList = false;
    this.step2Val.showSystemTypeSearchList = false;
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList && this.step2Val.UniformatSelected.UDescList.length>0){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{x.showOptions = false;});
    }
  }

  hidSystemTypeSearchs(){
    this.step2Val.showSystemTypeSearchList = false;
    this.step2Val.showUniformatSearchList = false;
    this.step2Val.showParentItemSearchList = false;
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList && this.step2Val.UniformatSelected.UDescList.length>0){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{x.showOptions = false;});
    }
  }

  showUDFListOptionSearchs(index:number){
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList !==undefined){
      this.step2Val.UniformatSelected.UDescList[index].showOptions = true;
      this.step2Val.UniformatSelected.UDescList[index].FilterOptions = [];
      this.step2Val.UniformatSelected.UDescList[index].ListOfItems.forEach(u=>{
        let _v = u.Value.toLowerCase();
        if(this.step2Val.UniformatSelected.UDescList[index].UDFOptionSearchValue===undefined){this.step2Val.UniformatSelected.UDescList[index].UDFOptionSearchValue = "";}
        if(_v.indexOf(this.step2Val.UniformatSelected.UDescList[index].UDFOptionSearchValue.toLowerCase())>=0){
          this.step2Val.UniformatSelected.UDescList[index].FilterOptions.push(u);
        }
      })
    }
    
  }

  getInputConUDFListOptionValue(rv :InputConReturn,index:number){
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList !==undefined){
      this.step2Val.UniformatSelected.UDescList[index].UDFOptionSearchValue = (rv.value!==undefined)?rv.value.trim():"";
      this.step2Val.UniformatSelected.UDescList[index].showOptions = !rv.isBlur;
      let ct = this.step2Val.UniformatSelected.UDescList[index].ControlType;
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{
        x.showNoResult=false;
        x.showOptions=false;
      })
      if(ct == 3){
        this.step2Val.UniformatSelected.UDescList[index].FilterOptions = [];
        this.step2Val.UniformatSelected.UDescList[index].ListOfItems.forEach(u=>{
          let _v = u.Value.toLowerCase();
           if(_v.indexOf(this.step2Val.UniformatSelected.UDescList[index].UDFOptionSearchValue.toLowerCase())>=0){
            this.step2Val.UniformatSelected.UDescList[index].FilterOptions.push(u);
          }
        });
        this.step2Val.UniformatSelected.UDescList[index].showOptions = true;
        if(this.step2Val.UniformatSelected.UDescList[index].FilterOptions.length==0){
          //this.step2Val.UniformatSelected.UDescList[index].showOptions = false;
          this.step2Val.UniformatSelected.UDescList[index].showNoResult = true;
          if(this.step2Val.UniformatSelected.UDescList[index].IsRequired == true){
            this.step2Val.UniformatSelected.UDescList[index].isSearchValueValid = false;
          }
        }
        else{
          this.step2Val.UniformatSelected.UDescList[index].showNoResult = false;
        }
      }
      else{
        this.step2Val.UniformatSelected.UDescList[index].showOptions = false;
        if(ct == 1 && this.step2Val.UniformatSelected.UDescList[index].DataType == "DOUBLE" && rv.value.trim() != ""){
          if(this.funcs.isFloat(rv.value.trim()) ){
            this.step2Val.UniformatSelected.UDescList[index].isSearchValueValid = true;
          }
          else{
            this.step2Val.UniformatSelected.UDescList[index].isSearchValueValid = false;
            this.step2Val.UniformatSelected.UDescList[index].ErrorDescription = "Invalid Money or number";
          }
        }
        else{ 
          if( !this.step2Val.UniformatSelected.UDescList[index].IsRequired && rv.value.trim() == ""){
            this.step2Val.UniformatSelected.UDescList[index].isSearchValueValid = true;
          }
        }
      }
      
    }
    this.step2Val.showSystemTypeSearchList = false;
    this.step2Val.showUniformatSearchList = false;
    this.step2Val.showParentItemSearchList = false;
  }

  resetUDFListOptionInput(index:number){
    this.step2Val.UniformatSelected.UDescList[index].showOptions = false;
    this.step2Val.UniformatSelected.UDescList[index].showNoResult = false;
    this.step2Val.UniformatSelected.UDescList[index].UDFOptionSearchValue = "";
    this.step2Val.UniformatSelected.UDescList[index].UDFOptionSearchKey = "";
  }

  selectUDFListOptionItem(index0:number, index:number){
    this.step2Val.UniformatSelected.UDescList[index0].UDFOptionSearchValue = this.step2Val.UniformatSelected.UDescList[index0].FilterOptions[index].Value;
    this.step2Val.UniformatSelected.UDescList[index0].UDFOptionSearchKey = this.step2Val.UniformatSelected.UDescList[index0].FilterOptions[index].Key;
   
    this.step2Val.UniformatSelected.UDescList[index0].showOptions = false;
    this.step2Val.UniformatSelected.UDescList[index0].isSearchValueValid = true;
  }

  hideUDFListSearchs(index:number){
    if(this.step2Val.UniformatSelected.UDescList[index].IsRequired == true)
    this.step2Val.UniformatSelected.UDescList[index].showOptions = false;
  }

  
 

 
  MappingData(){
    if(this.step2Data.Data.VALDATA!==undefined){
      this.step2Val = this.step2Data.Data.VALDATA;
      this.step2ValBak = this.step2Data.Data.DIRTYDATA;
      if(this.step2ValBak===undefined){
        this.step2ValBak = new Step2ValidationData();
      }
      this.subHeader.subheaderitems[1].subline = this.step2Val.BuildingItemCode;
    }
    else{
      this.step2Val = new Step2ValidationData();
    }
    this.step2Val.IsDFM = this.subs.isDFM.trim();
    this.listParentItems = this.step2Data.Data.ParentItem.ListOfItems;
    this.ListUniformats = this.step2Data.Data.BuildingItemTypeCodes;
    this.listSystemTypeItems = this.step2Data.Data.SystemType.ListOfItems;
    if(this.subs.Mode == "EDIT"){
      let u = this.ListUniformats.find(x=>x.Id == this.step2Val.UniformatSearchKey.toString());
     
      if(u!==null && u.UDescList !==null && u.UDescList.length>0){
        this.step2Val.UniformatSelected = u;
        this.step2Val.showUDFSearchList = true; 
        this.step2Val.UniformatSelected.UDescList.forEach(x=>{
          x.isSearchValueValid = true;
        })
      }
      
    }
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList){
      this.step2Val.UniformatSelected.UDescList.sort((one, two)=>(one.Name < two.Name ? -1:1));
    }
    
  }

  getPIInputConValue(rv :InputConReturn){
    this.step2Val.ParentItemSearchValue = (rv.value!==undefined)?rv.value.trim():"";
    this.listParentItemsFiltered = [];
    this.step2Val.ParentItemSearchKey = "";
    this.listParentItems.forEach(_v=>{
      if(_v.Value.toLocaleLowerCase().indexOf(this.step2Val.ParentItemSearchValue.toLocaleLowerCase())>=0){
        this.listParentItemsFiltered.push(_v);
      }
    });
    if(this.listParentItemsFiltered.length>0){
      this.step2Val.showParentItemSearchList = true;
    }
    else{
      this.step2Val.showParentItemSearchList = true;
      if(this.listParentItemsFiltered.length==0){
        this.showNoResultParent = true;
      }
      else{
        this.showNoResultParent = false;
      }
    }
    //this.hideUDFListSearchs(0);    
    this.hideUfmSearchs();
  }

  selectPIItem(index:number){
    let _v = this.listParentItemsFiltered[index];
    this.step2Val.ParentItemSearchValue = _v.Value;
    this.step2Val.ParentItemSearchKey = _v.Key;
    this.step2Val.showParentItemSearchList = false;
  }

  hidePISearchs(){
    this.step2Val.showParentItemSearchList = false;
    this.step2Val.showUniformatSearchList = false;
    this.step2Val.showSystemTypeSearchList = false;
  }

  initStep2Data(){
    this.storage.get(storageVariableNames.STEP2DATAEQIPMENTTYPE).then((data : Step2EquipmentType) => {
      if (data) {
        this.step2Data = data;
        this.MappingData();
        
      }
      else{
        this.step2Data = new Step2EquipmentType();
        this.getStep2EquipmentTypeData();
      }

    });
  }

  SaveToStorage(){
    this.step2Data.Data.UniformatSelectedKey = this.step2Val.UniformatSelected.Code;
    this.step2Data.Data.ParentItemSelectedKey = this.step2Val.ParentItemSearchValue;
    this.step2Data.Data.VALDATA = this.step2Val;
    this.step2Data.Data.DIRTYDATA = this.step2ValBak;
    this.storage.set(storageVariableNames.STEP2DATAEQIPMENTTYPE, this.step2Data);
  }

  scanBarCode(){
    //this.isJumpStep = !this.isJumpStep;
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.step2Val.FieldItemNumber = barcodeData.text;
      if(this.step2Val.FieldItemNumber.length!=9){
        this.step2Val.isFieldItemNumberValid=false;
      }
      else{
        this.step2Val.isFieldItemNumberValid=true;
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }

  showTipFieldItem(){
    this.subs.tipClosing.next("showFieldItemTip");
    this.subs.publicTipShow = this.showFieldItemTip = !this.showFieldItemTip;
  }

  closeDropdown(){
    if(this.step2Val.showUniformatSearchList){
      this.step2Val.showUniformatSearchList = false;
    }

    if(this.step2Val.showSystemTypeSearchList){
      this.step2Val.showSystemTypeSearchList = false;
    }
    if(this.step2Val.showParentItemSearchList){
      this.step2Val.showParentItemSearchList = false;
    }

    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList && this.step2Val.UniformatSelected.UDescList.length>0){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{x.showOptions = false;});
    }
  }
}
