import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate
{
  
  constructor(private loginService: LoginService) 
  {
  }

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
    )
  {
    return this.loginService.isAuthorized;
  }
  
}
