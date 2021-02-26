import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[fieldUDFDateMask]',
})
export class FieldUDFDateDirective {

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }
  

  onInputChange(event, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    }
    else if (newVal.length <= 1) {
        if(newVal!='1' && newVal!='2'){
            newVal = '';
        }
    } 
    else if (newVal.length <= 2) {
        if(newVal!='19' && newVal!='20'){
            newVal = newVal.substring(0, newVal.length - 1);
        }
    } 
    else if (newVal.length <= 4) {
      newVal = newVal.replace(/^(\d{4})/, '$1');
    } 
    else if (newVal.length <= 5) {
        let _fc = newVal.substring(4);
        if(_fc!='0'&& _fc!='1'){
            newVal = newVal.substring(0, newVal.length - 1);
        }
    } 
    else if (newVal.length <= 6) {
        let _fc = newVal.substring(4,5);
        let _sc = newVal.substring(5);
        if(_fc=='0' && _sc=='0'){
            newVal = newVal.substring(0, newVal.length - 1);
        }
        else if(_fc!='0' && (_sc!='0' && _sc!='1' && _sc!='2')){
            newVal = newVal.substring(0, newVal.length - 1);
        }

        newVal = newVal.replace(/^(\d{4})(\d{0,2})/, '$1$2');
    } 
    else if (newVal.length <= 7) {
        let _fc = newVal.substring(6);
        if(_fc!='0'&& _fc!='1'&&_fc!='2'&& _fc!='3'){
            newVal = newVal.substring(0, newVal.length - 1);
        }
    } 
    else if (newVal.length <= 8) {
        let _dc = newVal.replace(/^(\d{4})(\d{0,2})(\d{0,2})/, '$1-$2-$3');
        if(this.isValidDate(_dc)==false){
            newVal = newVal.substring(0, newVal.length - 1);
        }
    } else {
      newVal = newVal.substring(0, 8);
      newVal = newVal.replace(/^(\d{4})(\d{0,2})(\d{0,2})/, '$1$2$3');
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }

  isValidDate(dateString) {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
  }

}
