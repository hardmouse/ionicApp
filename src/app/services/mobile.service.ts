import { Injectable } from '@angular/core';
import { Observable,timer,throwError,forkJoin  } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { WebApi } from '../modules/core/classes/webApi';
import { WebServiceType } from '../modules/core/classes/webServiceType';
import {
  map,
  catchError,
  tap,
  switchMap,
  mergeMap,
  concatMap,
  exhaustMap
} from 'rxjs/operators';
import { LoginOptions, OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { LoginService } from '../modules/security/services/login.service';
import { Constants } from '../modules/core/classes/constants';
import { SubscribableService } from '../services/subscribable.service';

@Injectable()
export class MobileService {

  _eeer;
  constructor(
    private httpClient: HttpClient,
    private oauthService: OAuthService,
    private loginService: LoginService,
    public subs:SubscribableService
  ) { }

  //clientid:number=0;

  get(url, suppressErrorsOnUI: boolean = false): Observable<any> {
    url = this.getUrl(url);
    return this.httpClient.get(url).pipe(map((response: Response) => {
      
      return response;
    }), catchError(err => {

      const errMsg = 'Error while calling API (get): ' + url + ', error detail: ' + JSON.stringify(err); // add request
      console.log(err);
     
      if (err instanceof HttpErrorResponse) {
        
         
        }
        return throwError(err);
      }));
    
  }

  post(url, body, apiName, times = 1, enforceAuthToken = false): Observable<any> {
    
    this.loginService.logAuthenticationInfo();

    const toMock = this.useMockData(url);
    const originalUrl: string = url;
    url = this.getUrl(url);
    if (toMock) { // get mock data from the folder 'asset/mockData'
      return this.httpClient.get(url).pipe(map((response: Response) => {
        
        return response;
      }), catchError(err => {
        return this.handlePostException(err, apiName, url, originalUrl, body, times);
      }));
    } else {
     
        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        if( enforceAuthToken )
        {
          headers = headers.append('Authorization', 'Bearer ' + this.loginService.accessToken);
        }

        return this.httpClient.post(url, body.toString(), {headers:headers}).pipe(map((response: Response) => {
           
            return response;
        }), catchError((err) => {

        this.loginService.logAuthenticationInfo();
        //return err.error.ExceptionMessage;
        return this.handlePostException(err, apiName, url, originalUrl, body, times);
      }));
    }
  }

  private getUrl(url) {
    
    const lang = "en";
    if (url.toLowerCase().indexOf('http://') >= 0 || url.toLowerCase().indexOf('.json') >= 0 || url.toLowerCase().indexOf('.html') >= 0) {
      return environment.rootFolder + url;
    } else {
      if (this.useMockData(url)) {
        if (url.indexOf('?') > 0) {
          url = url.substring(0, url.indexOf('?'));
        }
        url = environment.rootFolder + 'assets/mockData/' + url.substring(0, url.length - 1) + '.html';
      } else {
        url = WebApi.getBaseUrl(WebServiceType.RealConditionMobileApi) + this.subs.clientSelected + '/api/'  + url;
      }
    }
    return url;
  }

  


  useMockData(url) {
    //let key = url.replace('/', '_');
    let key = url.replace(/\//g, '_').replace(/-/g, '_');
    const pQuestionMark = key.indexOf('?');
    if (pQuestionMark > 0) {
      key = key.substring(0, pQuestionMark);
    }
    let retVaue = false;
   
    if (environment.useMockData.all) {
      retVaue = environment.useMockData.all;
    }
    return retVaue;
  }


 

  handlePostException(err, apiName, url: string , originalUrl: string , payload, times: number) {
    const self = this;
    const errMsg = 'time ' + times.toString() +  ', Error while calling API (post): ' + url + ', error detail: ' + JSON.stringify(err) + '. Request: ' + JSON.stringify(payload);
    
    const MAX_NO_OF_RETRIES: number = 3;
    if (err instanceof HttpErrorResponse) {
      if (err.status === Constants.INTERNAL_SERVER_ERROR) {

        if (times < MAX_NO_OF_RETRIES) {
          return timer(200).pipe(mergeMap(() => {  // wait for 0.2 second then call again.
            return self.post(originalUrl, payload, apiName, times + 1);
          }));
        } else {
          //this.router.navigate(['/exception']); // if get 500 error for 3 times, redirect to login page.
        }
      } 
      else if (err.status === Constants.UNATHORIZED_ERROR) { // if 401 error, force refresh token and set the new one to the header
        this.loginService.forceRefreshAccessToken();
        if( times < MAX_NO_OF_RETRIES )
        {
          return timer(400).pipe(mergeMap(() => {
                return self.post(originalUrl, payload, apiName, times + 1, true);
              }));
        }
      } 
      
    } 

    return throwError(err);
  }


  getDebug(url): Observable<any> {
    
    return this.httpClient.get(url).pipe(map((response: Response) => {
      
      return response;
    }), catchError(err => {

      const errMsg = 'Error while calling API (get): ' + url + ', error detail: ' + JSON.stringify(err); // add request
      return errMsg;
      
      }));
  }

  postDebug(url, payload, ): Observable<any> {
        
      const httpHeaders = new HttpHeaders().set(
        'Content-Type',
        'application/json'
      );
      return this.getdebug(url);
  }

    getdebug(url, suppressErrorsOnUI: boolean = false): Observable<any> {

        url = environment.rootFolder + 'assets/mockData/' + url.substring(0, url.length - 1) + '.html';
        return this.httpClient.get(url).pipe(map((response: Response) => {
            if (environment.writeApiResponseToConsole) {
                console.log('==== API response for ' + url + ' =====');
                console.log(response);
            }
            return response;
        }), catchError(err => {

            const errMsg = 'Error while calling API (get): ' + url + ', error detail: ' + JSON.stringify(err); // add request
            console.log(err);
            return throwError(err);
        }));
    }

    post2(url, body, apiName, times = 1): Observable<any> {

        const toMock = this.useMockData(url);
        
        const originalUrl: string = url;
        url = this.getUrl(url);
        if (toMock) { // get mock data from the folder 'asset/mockData'
            return this.httpClient.get(url).pipe(map((response: Response) => {

                return response;
            }), catchError(err => {
                return this.handlePostException(err, apiName, url, originalUrl, body, times);
            }));
        } else {



            let headers = new HttpHeaders();
            headers = headers.append('Content-Type', 'application/json');
            headers = headers.append('Authorization', 'Bearer {10ed3043-a441-4018-93be-f510a41787f4}');
            url = "http://localhost/RealsuiteApps/RealCondition/"+this.subs.clientSelected+"/api/equipmentchangerequests/requestlist/"
            return this.httpClient.post(url, body.toString(), { headers: headers }).pipe(map((response: Response) => {
                if (environment.writeApiResponseToConsole) {
                    console.log('==== API response for ' + url + ' =====');
                    console.log(response);
                }

                return response;
            }), catchError(err => {
                if (err instanceof HttpErrorResponse) {
                    console.log(err);
                }
                return this.handlePostException(err, apiName, url, originalUrl, body, times);
            }));
        }
    }

    post4(url, body, apiName, times = 1): Observable<any> {

      const toMock = this.useMockData(url);
      
      const originalUrl: string = url;
      url = this.getUrl(url);
      if (toMock) { // get mock data from the folder 'asset/mockData'
          return this.httpClient.get(url).pipe(map((response: Response) => {

              return response;
          }), catchError(err => {
              return this.handlePostException(err, apiName, url, originalUrl, body, times);
          }));
      } else {



          let headers = new HttpHeaders();
          headers = headers.append('Content-Type', 'application/json');
          headers = headers.append('Authorization', 'Bearer {dbaa9a42-c230-4dba-bcca-5c1e67c95b7b}');
          url = "http://localhost/RealsuiteApps/RealCondition/"+this.subs.clientSelected+"/api/equipment/Save/"
          return this.httpClient.post(url, body.toString(), { headers: headers }).pipe(map((response: Response) => {
              

              return response;
          }), catchError(err => {
              if (err instanceof HttpErrorResponse) {
                  console.log(err);
              }
              return this.handlePostException(err, apiName, url, originalUrl, body, times);
          }));
      }
  }
 
}

