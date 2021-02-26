import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FuncsService {
  constructor() { }
  reverseBoolean(_v:boolean) {
    return !_v;
  }

  delay(ev:string){
    let i = 0;
    (function repeat(times){
      if (++i > 1) return;
      setTimeout(function(){
        let el = document.getElementById(ev);
    
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
        repeat();
      }, 50);
    })();
  }

  isInt(n){
    return Number(n) === n && n % 1 === 0;
}

  isFloat(value){
    let v1 = value.toString().replace('.','');
    if(this.isNormalInteger(v1)){
      let sd :string[] = value.split('.');
     
      if(sd.length == 1 || value.toString().indexOf('.') != -1){
        return true;
      }
      
    }
    return false;
  }

  isNormalInteger(str) {
      var n = Math.floor(Number(str));
      return n !== Infinity && String(n) === str && n >= 0;
  }

  formatDate(date) {
    if(date==null){ return '';};
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

}