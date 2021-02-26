import { UrlConfig } from './config';
import { WebServiceType } from './webServiceType';



export class WebApi {
    constructor() {
    }

    public static getBaseUrl = ( webServiceType: WebServiceType) : string => 
    {
      let result: string = UrlConfig.baseUrlClientRequest;

      if(webServiceType == WebServiceType.RealClientRequest){
        result = UrlConfig.baseUrlClientRequest;
      }
      else if(webServiceType == WebServiceType.RealHelpWebApi){
        result = UrlConfig.baseUrlRealHelpWebApi;
      }
      else if(webServiceType == WebServiceType.RealSuitePublic){
        result = UrlConfig.baseUrlRealSuitePublic;
      }
      else if(webServiceType == WebServiceType.RealSuite){
        result = UrlConfig.baseUrlRealSuite;
      }
      else if(webServiceType == WebServiceType.RealConditionMobileApi){
        result = UrlConfig.baseUrlRealConditionMobileWebApi;
      }

      return result;
    }
    

  }
