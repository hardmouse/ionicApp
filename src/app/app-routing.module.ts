import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from './modules/security/services/o-auth-guard.service';
import { PickAreaLocationComponent } from './pick-area-location/pick-area-location.component';

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthorizationGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tab1',
    // canActivate: [AuthorizationGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path:'pa',component:PickAreaLocationComponent},
  {
    path: 'equipment-add-flow',
    // canActivate: [AuthorizationGuard],
    loadChildren: () => import('./equipment-add-flow/equipment-add-flow.module').then( m => m.EquipmentAddFlowPageModule)
  },
  {
    path: 'login',
    // loadChildren: () => import('./modules/security/pages/login/login.module').then( m => m.LoginPageModule)
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'search',
    // canActivate: [AuthorizationGuard],
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  }
 
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
