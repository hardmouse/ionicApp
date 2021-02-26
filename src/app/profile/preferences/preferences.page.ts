import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { storageVariableNames} from '../../common/type/common.model';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.page.html',
  styleUrls: ['./preferences.page.scss'],
})
export class PreferencesPage {
  _isDirty:boolean=false;
  constructor(
    public navCtrl:NavController,
    ) {
  }
  textSet:string = '';
  toggleChecked:boolean;
  saveChanges:boolean=false;

  // ionViewWillEnter(){

  // }

  ionViewDidEnter(){
    this.contrastModeCheck();
  }

  switchTxtSize(_v){
    this.textSet = _v;
  }
  discard(){
    this.saveChanges = false;
    this.navCtrl.navigateForward(storageVariableNames.HOME);
  } 
  save(){
    this.saveChanges = true;
    this.navCtrl.navigateForward(storageVariableNames.HOME);
  }
  contrastToggle(){
    this._isDirty = true;
    this.toggleChecked = !this.toggleChecked;
    localStorage.setItem('contrastDark', this.toggleChecked.toString());
    document.body.classList.toggle('dark',this.toggleChecked);
  }
  contrastModeCheck(){
    let toggleCtrl:boolean = false;
    if(localStorage.getItem('contrastDark')!="false"){
      toggleCtrl=true;
    }
    this.toggleChecked = toggleCtrl;
    document.body.classList.toggle('dark',toggleCtrl);
  }

  ionViewWillLeave(){
    
  }

  ionViewDidLeave(){
    if(!this.saveChanges && this._isDirty){
      this._isDirty = false;
      this.contrastToggle();
    }
    // console.log("ionViewDidLeave");
  }
}
