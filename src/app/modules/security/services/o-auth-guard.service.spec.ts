import { TestBed } from '@angular/core/testing';

import { AuthorizationGuard } from './o-auth-guard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('AuthorizationGuard', () => {
  let service: AuthorizationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        OAuthModule.forRoot()
      ],
    });
    service = TestBed.inject(AuthorizationGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
