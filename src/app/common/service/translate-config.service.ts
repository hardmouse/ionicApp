import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
    console.log(">>>>>>> setLanguage",setLang,">>>",this.translate.instant('tab1.search'));
  }

  getCurrentLanguage(){
    return this.translate.currentLang;
  }
}

