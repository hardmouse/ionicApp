import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Constants } from '../classes/constants';

@Injectable({
  providedIn: 'root'
})
export class PlatformTypeService {

  constructor(private platform: Platform) { }

  private getPlatformTypes = () : Array<string> => 
  {
    let result: Array<string> = [];
    if( this.platform.is("android"))
    {
      console.log(Constants.ANDROID);
      result.push(Constants.ANDROID);
    }
    if( this.platform.is("ios"))
    {
      console.log(Constants.IOS);
      result.push(Constants.IOS);
    }
    if( this.platform.is("pwa"))
    {
      console.log(Constants.PWA);
      result.push(Constants.PWA);
    }
    if( this.platform.is("mobile"))
    {
      console.log(Constants.MOBILE);
      result.push(Constants.MOBILE);
    }
    if( this.platform.is("mobileweb"))
    {
      console.log(Constants.MOBILEWEB);
      result.push(Constants.MOBILEWEB);
    }
    if( this.platform.is("desktop"))
    {
      console.log(Constants.DESKTOP);
      result.push(Constants.DESKTOP);
    }
    if( this.platform.is("hybrid"))
    {
      console.log(Constants.HYBRID);
      result.push(Constants.HYBRID);
    }

    return result;
  }

  get isHybrid() : boolean 
  {
    return this.getPlatformTypes().includes(Constants.HYBRID);
  }
  get isDesktop() : boolean 
  {
    return this.getPlatformTypes().includes(Constants.DESKTOP);
  }
  get isMobile() : boolean 
  {
    return this.getPlatformTypes().includes(Constants.MOBILE);
  }
  get isAndroid() : boolean 
  {
    return this.getPlatformTypes().includes(Constants.ANDROID );
  }  
  get isiOS() : boolean 
  {
    return this.getPlatformTypes().includes(Constants.IOS );
  }
  
}
