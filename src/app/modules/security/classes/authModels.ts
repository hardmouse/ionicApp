export interface UserInfoRequestModel {
    scope: string
}

export interface UserInfoResponseModel {
    ClientId: number,
    LoginName: string,
    FirstName: string,
    LastName: string,
    Email: string,
    Phone: string,
    UserId: string,
    Delegator: string
}


export interface ClientForSelectResponseModel
{
    Id: number;
    Name: string,
    isRS7: string,
    Selected: string
}

export interface PersistentAuthInfo
{
    remember_me: boolean;
    saved_at: Date;
    
    refresh_token: string,
    nonce: string,
    expires_at: number,
    access_token_stored_at: number,
    access_token: string,
    PKCE_verifier: string,
    granted_scopes: Array<string>
}