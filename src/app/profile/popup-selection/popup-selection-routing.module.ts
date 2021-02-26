import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PopupSelectionComponent } from './popup-selection.component';

const routes: Routes = [
  {
    path: '',
    component: PopupSelectionComponent
  }
  // ,
  // {
  //   path: 'login',
  //   loadChildren: () => import('../../modules/security/pages/login/login.module').then( m => m.LoginPageModule)
  // }
  // ,
  // {
  //   path: 'my-account',
  //   loadChildren: () => import('../my-account/my-account.module').then( m => m.MyAccountPageModule)
  // },
  // {
  //   path: 'preferences',
  //   loadChildren: () => import('../preferences/preferences.module').then( m => m.PreferencesPageModule)
  // },
  // {
  //   path: 'notifications',
  //   loadChildren: () => import('../notifications/notifications.module').then( m => m.NotificationsPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopupSelectionComponentRoutingModule {}
