import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslateConfigService {

  constructor(
    private translate: TranslateService
  ) { }

  // getDefaultLanguage(){
  //   let language = navigator.language;
  //   this.translate.setDefaultLang(language);
  //   return language;
  // }
  checkTranslation(_v){
    return this.translate.instant(_v);
  }
  setLanguage(setLang) {
    this.translate.setDefaultLang(setLang);
    this.translate.use(setLang);
    console.log(">>>>>>> setLanguage",setLang,">>>",this.translate.stream('tab1.search'));
    // this.translate.get('tab1.search').subscribe((translated: string) => {
    //   console.log("jjjjjjjjjjjjjjjjjjjjjjj>>",translated);
    //   //=> 'Hello world'
  
    //   // You can call instant() here
    //   const translation = this.translate.instant('something.else');
    //   //=> 'Something else'
    // });
  }

  getCurrentLanguage(){
    return this.translate.currentLang;
  }
}

