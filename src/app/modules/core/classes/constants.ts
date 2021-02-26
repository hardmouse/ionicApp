import { UserInfoRequestModel } from '../../security/classes/authModels';

export class Constants {
    constructor() {
    }

    public static get DEEP_LINK_ROOT(): string { return 'com.bgis.rcmobile'; }


    // SSO Application scope
    public static get SSO_REDIRECT_URL_NATIVE(): string  { return 'com.bgis.rcmobile://bgis.rcmobile'; }
    public static get SSO_REDIRECT_URL_SUFFIX(): string  { return '/tabs/tab1'; }
    
    public static get SSO_USER_AUTH_LOGIN_URL_SUFFIX(): string  { return 'userAuth/Login'; }    
    public static get SSO_USER_AUTH_TOKEN_URL_SUFFIX(): string  { return 'userAuth/Token'; }    
    public static get SSO_USER_AUTH_REVOKE_URL_SUFFIX(): string  { return 'userAuth/Revoke'; }
    
    public static get SSO_CLIENT_ID_WEB(): string  { return '{DFA75CBD-C45D-4D55-8951-987E18C19715}'; }
    public static get SSO_CLIENT_ID_NATIVE(): string  { return '{186B1ACD-248A-4CE3-8B06-FEAB96E4C678}'; }
    public static get SSO_SCOPE(): string  { return 'BGIS.REALCONDITION'; }
    public static get SSO_RESPONSE_TYPE(): string  { return 'code'; }
    public static get SSO_CLIENT_SECRET(): string  { return 'Welcome1'; }
    public static get REFRESH_TOKEN_FACTOR(): number  { return 0.75; }
    public static get uUSER_INFO_REQUEST(): UserInfoRequestModel
    {
        return <UserInfoRequestModel>
        {
            scope: Constants.SSO_SCOPE
        };
    }

    public static get HTTP_HEADER_X_REQUESTED_WITH(): string { return 'X-Requested-With'; }
    public static get HTTP_HEADER_ACCEPT(): string { return 'Accept'; }
    public static get HTTP_HEADER_CONTENT_TYPE(): string { return 'Content-Type'; }
    public static get HTTP_HEADER_ACCEPT_LANGUAGE(): string { return 'Accept-Language'; }
    public static get HTTP_HEADER_AUTHORIZATION(): string { return 'Authorization'; }

    // SSO events
    public static get TOKEN_RECEIVED(): string { return 'token_received'; }
    public static get TOKEN_ERROR(): string { return 'token_error'; }
    public static get CODE_ERROR(): string { return 'code_error'; }
    public static get TOKEN_REFRESH_ERROR(): string { return 'token_refresh_error'; }
    public static get TOKEN_EXPIRES(): string { return 'token_expires'; }
    public static get TOKEN_REVOKE_ERROR(): string { return 'token_revoke_error'; }
    public static get TOKEN_REFRESHED(): string { return 'token_refreshed'; }
    public static get INVALID_NONCE_IN_STATE(): string { return 'invalid_nonce_in_state'; }

    // SSO secure storage key
    public static get AUTH_INFO(): string { return 'AuthInfo'; }
    

    // Environments
    public static get PROD(): string { return 'RS'; }
    public static get RSTS(): string { return 'RSTS'; }
    public static get LOCAL(): string { return 'LOCAL'; }
    public static get UNKNOWN(): string { return 'UNKNOWN'; }

    // PATHs    
    public static get LOGIN_PATH(): string { return '/login'; }
    public static get FIRST_PAGE_AFTER_LOGIN_PATH(): string { return 'tabs/tab1'; }

    // PLATFORM info
    public static get ANDROID(): string { return 'android'; }
    public static get IOS(): string { return 'ios'; }
    public static get PWA(): string { return 'pwa'; }
    public static get MOBILE(): string { return 'mobile'; }
    public static get MOBILEWEB(): string { return 'mobileweb'; }
    public static get DESKTOP(): string { return 'desktop'; }
    public static get HYBRID(): string { return 'hybrid'; }

    // HTTP ERROR CODES
    public static get INTERNAL_SERVER_ERROR(): number { return 500; }
    public static get UNATHORIZED_ERROR(): number { return 401; }

    // SafariViewController 
    public static get TRANSITION(): string { return 'curl'; }
    public static get TINT_COLOR(): string { return '#ff0000'; }
    public static get OPENED(): string { return 'opened'; }
    public static get LOADED(): string { return 'loaded'; }
    public static get CLOSED(): string { return 'closed'; }
}