import { Injectable } from '@angular/core';
import { LoginOptions, OAuthService, TokenResponse } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/app/modules/core/classes/constants';
import { Observable } from 'rxjs';
import { WebServiceType } from '../../core/classes/webServiceType';
import { WebApi } from '../../core/classes/webApi';
import { ClientForSelectResponseModel, PersistentAuthInfo, UserInfoResponseModel } from '../classes/authModels';
import { AppUtil } from '../../core/classes/appUtil';
import { authConfig } from '../classes/authConfig';
import { PlatformTypeService } from '../../core/services/platform-type.service';
import 'capacitor-secure-storage-plugin';
import { SecureStorageService } from '../../storage/services/secure-storage.service';
import { SubscribableService } from '../../../services/subscribable.service'
import { Router } from '@angular/router';
import { Browser } from '@capacitor/core';
import { SafariViewController } from '@ionic-native/safari-view-controller';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private refreshTokenInterval = null;

  constructor(
    private httpClient: HttpClient,
    private oauthService: OAuthService,
    private platformTypeService: PlatformTypeService,
    private secureStorageService: SecureStorageService,
    private router:Router,
    private subs:SubscribableService,
    ) 
  {
  }

  get isAuthorized() : boolean 
  {
    // Handle both cases: (OIDC + oAuth) or (oAuth only).
    // RealSuite backend partially supports OIDC at this time.
    return authConfig.oidc ?
           this.oauthService.hasValidAccessToken() && this.oauthService.hasValidIdToken() :
           this.oauthService.hasValidAccessToken();
  }

  get accessToken(): string
  {
    return this.oauthService.getAccessToken();
  }



  private configureOAuthService = () => {

    console.log( `configureOAuthService()`);
    authConfig.openUri = this.openUriOverride;
    this.oauthService.configure(authConfig);
    this.oauthService.redirectUri = this.adjustSSORedirectUri();
    this.oauthService.clientId = this.adjustSSOClientId();

    console.log(`configureOAuthService(): ${JSON.stringify(authConfig)}`);
    this.oauthService.setStorage(sessionStorage);

    this.oauthService.openUri = this.openSSOLoginPage;

    this.oauthService.events
      .subscribe(event => {

        switch(event.type) { 
          case Constants.TOKEN_RECEIVED: { 
            this.onTokenReceived();
            break; 
          } 
          case Constants.TOKEN_REFRESHED: { 
            this.onTokenRefreshed();
            break; 
          }
          case Constants.TOKEN_ERROR: { 
            this.onTokenError();
            break; 
          }
          case Constants.TOKEN_REFRESH_ERROR: { 
            this.onTokenRefreshError();
            break; 
          } 
          case Constants.TOKEN_EXPIRES: { 
            this.onTokenExpires();
            break; 
          } 
          default: {
            console.log(`oauthService.events: event=${JSON.stringify(event)}`);
             break; 
          } 
       } 
      });
  }

  openSSOLoginPage = (uri: string) : void => 
  {
    console.log(`openSSOLoginPage(${uri})`);
    Browser.open({ url: uri, windowName: "_self"  });
  }

  public tryLoginCodeFlow = (
    needToConfigure: boolean = true,
    queryString : string = null
    ) : Promise<void> =>
  {
    if( needToConfigure )
    {
      this.configureOAuthService();
    }
    
    let loginOptions = new LoginOptions();
    loginOptions.disableOAuth2StateCheck = true;

      // process the auth information from this queryString
    if( !AppUtil.isNullOrUndefinedOrWhitespace(queryString) )
    {
      loginOptions.customHashFragment = queryString;
    }

    return this.oauthService.tryLoginCodeFlow(loginOptions);  
  }


  public login = () => {
    this.oauthService.initCodeFlow();
  }


  public logout = async () => {
    this.subs.clearMode();
    this.oauthService.logOut();
    clearInterval( this.refreshTokenInterval );
    await this.secureStorageService.clear(Constants.AUTH_INFO);
    this.router.navigateByUrl(Constants.LOGIN_PATH);
  }

  private adjustSSORedirectUri = (): string  => 
  {
    return this.platformTypeService.isHybrid ?
           Constants.SSO_REDIRECT_URL_NATIVE :
           window.location.origin + Constants.SSO_REDIRECT_URL_SUFFIX;
  }
  
  private adjustSSOClientId = (): string  => 
  {
    return this.platformTypeService.isHybrid ?
           Constants.SSO_CLIENT_ID_NATIVE :
           Constants.SSO_CLIENT_ID_WEB;
  }

  public logAuthenticationInfo = () => 
  {
    const idToken: string = this.oauthService.getIdToken(); // this is null unless OIDC is used
    const accessToken: string = this.oauthService.getAccessToken();
    const refreshToken: string = this.oauthService.getRefreshToken();
    console.log( `idToken = ${idToken == null ? 'NULL': idToken}` ) ;
    console.log( `accessToken = ${accessToken == null ? 'NULL': accessToken} isValid=${this.oauthService.hasValidAccessToken()}` ) ;
    console.log( `refreshToken = ${refreshToken == null ? 'NULL': refreshToken}` ) ;  
  }
  
  
  onTokenReceived = () =>
  {
    console.log( `onTokenReceived()` );
    this.logAuthenticationInfo();
    this.setUpTokenRefresh();
  }

  onTokenRefreshed = () =>
  {
    console.log( `onTokenRefreshed()` );
  }

  onTokenError = () =>
  {
    console.error( `onTokenError()` );
  }
  onTokenRefreshError = () =>
  {
    console.error( `onTokenRefreshError()` );
    this.logout();
  }

  onTokenExpires = () =>
  {
    console.log( `onTokenExpires()` );
    // this should never happen with the correct configuration!

    // If it still happens then refresh it.
    this.autoRefreshAccessToken();
  }

  setUpTokenRefresh = () =>
  {
    if( AppUtil.isNullOrUndefined(this.refreshTokenInterval) )
    {
        // refresh the access token at 75% of its lifetime.
        const remainingTime = parseInt(sessionStorage.getItem('expires_at')) - Date.now();
        const refreshFrequency: number = Constants.REFRESH_TOKEN_FACTOR * ((remainingTime > 0) ? remainingTime : -1 * remainingTime);
        this.refreshTokenInterval = setInterval ( this.autoRefreshAccessToken, refreshFrequency);
    }
  }

  autoRefreshAccessToken = () =>
  {
    this.oauthService
    .refreshToken()                
    .then(value => console.log( `autoRefreshAccessToken() has refreshed the token: result=${JSON.stringify(value)}` ) )
    .catch( error => {
      console.log(`autoRefreshAccessToken() could not refresh the token error=${JSON.stringify(error)}`);
      this.logout();
    });
  }

  forceRefreshAccessToken = () : void => 
  {
    this.oauthService.refreshToken();
  }

  storeAuthInfo = async (rememberMe: boolean | null = null) => {

    console.log( `storeAuthInfo()` );

    await this.secureStorageService.clear(Constants.AUTH_INFO);
    
    const persistentAuthInfo: PersistentAuthInfo = {

      remember_me: AppUtil.isNullOrUndefined( rememberMe ) ? true : rememberMe,
      saved_at: new Date(),

      refresh_token: sessionStorage.getItem('refresh_token'),
      nonce: sessionStorage.getItem('nonce'),
      expires_at: parseInt(sessionStorage.getItem('expires_at')),
      access_token_stored_at: parseInt(sessionStorage.getItem('access_token_stored_at')),
      access_token: sessionStorage.getItem('access_token'),
      PKCE_verifier: sessionStorage.getItem('PKCE_verifier'),
      granted_scopes: JSON.parse(sessionStorage.getItem('granted_scopes'))
    };
    

    this.secureStorageService.set(Constants.AUTH_INFO, JSON.stringify(persistentAuthInfo) )
      .catch( error => console.error('set ' + JSON.stringify(error)) );      
  }

  // if there is any auth info in the secure storage, try to log in with it.
  readStoredAuthInfo = () : Promise<void> | null =>
  {
    console.log( `readStoredAuthInfo()` );
    let result = this.secureStorageService.get(Constants.AUTH_INFO);
    
    result.then( (keyValue: any) => {

        if( !AppUtil.isNullOrUndefined( keyValue ) && !AppUtil.isNullOrUndefinedOrWhitespace( keyValue.value ))
        {
          const persistentAuthInfo: PersistentAuthInfo = JSON.parse(keyValue.value);
          if( !AppUtil.isNullOrUndefined( persistentAuthInfo ) && persistentAuthInfo.remember_me )
          {
            this.generateSessionStorageAuthInfo(persistentAuthInfo);
            this.logAuthenticationInfo();

            if( this.isAuthorized)
            {
              result = this.tryLoginCodeFlow(false);
              result.then( () => {
                  console.log('login OK with the authentication token found in the secure storage.');
                  this.storeAuthInfo(true);
                this.setUpTokenRefresh();
              })
              .catch((error) => {
                console.log(`readStoredAuthInfo() could not login after it failed to refresh token. error=${JSON.stringify(error)}`);
                this.logout();
              });
            }
            else
            {
              // refresh the access token
              this.oauthService
                .refreshToken()                
                .then(value => {
                  console.log( `readStoredAuthInfo() has refreshed the token: result=${JSON.stringify(value)}` );

                  this.generateSessionStorageAuthInfo(persistentAuthInfo);
                  result = this.tryLoginCodeFlow(false);
                  result.then( () => {
                    console.log('login OK');
                    this.storeAuthInfo(true);
                  })
                  .catch((error) => console.log(`readStoredAuthInfo() could not login after token refresh. error=${JSON.stringify(error)}`));

                })
                .catch( error => 
                {
                  console.log(`readStoredAuthInfo() could not refresh the token error=${JSON.stringify(error)}`);
                  result = this.tryLoginCodeFlow(false);
                  
                  result.then( () => console.log(`login OK. isAuthorized=${this.isAuthorized}`))
                  .catch((error) => {
                    console.log(`readStoredAuthInfo() could not login after it failed to refresh token. error=${JSON.stringify(error)}`);
                    this.logout();
                  });

                });
            }
          }
        }

      })
      .catch( () => console.log('readStoredAuthInfo() could not read the authentication information from secure storage') );

      return result;
  }

  // write the auth info into the session storage so the oAuthService can see it
  private generateSessionStorageAuthInfo = (persistentAuthInfo: PersistentAuthInfo) => {

    if( !AppUtil.isNullOrUndefined( persistentAuthInfo ))
    {
      sessionStorage.setItem('refresh_token', persistentAuthInfo.refresh_token);
      sessionStorage.setItem('nonce', persistentAuthInfo.nonce);
      sessionStorage.setItem('expires_at', JSON.stringify(persistentAuthInfo.expires_at));
      sessionStorage.setItem('access_token_stored_at', JSON.stringify(persistentAuthInfo.access_token_stored_at));
      sessionStorage.setItem('access_token', persistentAuthInfo.access_token);
      sessionStorage.setItem('PKCE_verifier', persistentAuthInfo.PKCE_verifier);
      sessionStorage.setItem('granted_scopes', JSON.stringify(persistentAuthInfo.granted_scopes));

    }
  }


  // this will be called from UI to set the "remember me" flag
  setRememberMe = (rememberMe: boolean) : void => {
    this.storeAuthInfo( rememberMe );
  }

  // open the SSO page inside of the SafariViewController
  openUriOverride = (uri: string) => {
    console.log(`loginService.openUriOverride(${uri})`);

    if( this.platformTypeService.isHybrid )
    {
          SafariViewController.isAvailable()
          .then((available: boolean) => {
              if (available) {
                SafariViewController.show({
                  url: uri,
                  hidden: false,
                  animated: false,
                  transition: Constants.TRANSITION,
                  enterReaderModeIfAvailable: true,
                  tintColor: Constants.TINT_COLOR
                })
                .subscribe((result: any) => {
                    // debug logging until the app becomes stable
                    if(result.event === Constants.OPENED)
                    {
                       console.log(Constants.OPENED);
                    }
                    else if(result.event ===Constants.LOADED)
                    {
                      console.log(Constants.LOADED);
                    }
                    else if(result.event === Constants.CLOSED)
                    {
                       console.log(Constants.CLOSED);
                    }
                  },
                  (error: any) => console.error(error)
                );

              } else
               {
                // use fallback browser, example InAppBrowser
                Browser.open({ url: uri, windowName: "_self"  });
              }
            }
          );
    }
    else
    {
      // safariViewController doesn't work in browser, fallback to InAppBrowser
      Browser.open({ url: uri, windowName: "_self"  });
    }
  }

  retrieveUserInfo = () : Observable<UserInfoResponseModel> => {
        const url: string = `${WebApi.getBaseUrl(WebServiceType.RealSuite)}user/UserInfo${AppUtil.jsonAsQueryString(Constants.uUSER_INFO_REQUEST)}`;
        return this.httpClient.get<UserInfoResponseModel>(url);
    }

  retrieveAvailableClients = () : Observable<Array<ClientForSelectResponseModel>> => {
        const url: string = `${WebApi.getBaseUrl(WebServiceType.RealSuite)}clientSelection/GetAvailableClients`;
        return this.httpClient.get<Array<ClientForSelectResponseModel>>(url);
    }
  
}
