import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentStep4WarrantyPage } from './equipment-step4-warranty.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentStep4WarrantyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentStep4WarrantyPageRoutingModule {}
