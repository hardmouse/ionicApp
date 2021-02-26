
import { AuthConfig } from 'angular-oauth2-oidc';
import { Constants } from 'src/app/modules/core/classes/constants';
import { UrlConfig } from '../../core/classes/config';


// this configuration needs to match the Trusted Server Portal settings
export const authConfig: AuthConfig = {

    loginUrl: UrlConfig.baseUrlRealSuitePublic + Constants.SSO_USER_AUTH_LOGIN_URL_SUFFIX,
    tokenEndpoint: UrlConfig.baseUrlRealSuitePublic + Constants.SSO_USER_AUTH_TOKEN_URL_SUFFIX,
    revocationEndpoint: UrlConfig.baseUrlRealSuitePublic + Constants.SSO_USER_AUTH_REVOKE_URL_SUFFIX,
  
    // SSO needs to be configured for Web apps for DEV environment and deep link for other env
    redirectUri : window.location.origin + Constants.SSO_REDIRECT_URL_SUFFIX,
    
    clientId: Constants.SSO_CLIENT_ID_WEB,
    scope: `${Constants.SSO_SCOPE} offline_access`,
  
    responseType: Constants.SSO_RESPONSE_TYPE, 
    oidc: false,
    
    requireHttps: false,
    requestAccessToken: true,
    dummyClientSecret: Constants.SSO_CLIENT_SECRET,
  
    // try to bypass the issuer validation
    strictDiscoveryDocumentValidation: false,
    skipIssuerCheck: true,

  };

