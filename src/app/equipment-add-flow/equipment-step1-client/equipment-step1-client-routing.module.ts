import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentStep1ClientPage } from './equipment-step1-client.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentStep1ClientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentStep1ClientPageRoutingModule {}
