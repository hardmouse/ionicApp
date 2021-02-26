import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SubscribableService } from '../../../../services/subscribable.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public subs:SubscribableService,
    private loginService: LoginService
    )
  { }

  ngOnInit() {
  }

  onLogin = () =>
  {
    console.log(`onLogin()`);
    this.loginService.login();
  }

}
