import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentAddFlowPage } from './equipment-add-flow.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentAddFlowPage
  },
  {
    path: 'equipment-step1-client',
    loadChildren: () => import('./equipment-step1-client/equipment-step1-client.module').then( m => m.EquipmentStep1ClientPageModule)
  },
  {
    path: 'equipment-step2-type',
    loadChildren: () => import('./equipment-step2-type/equipment-step2-type.module').then( m => m.EquipmentStep2TypePageModule)
  },
  {
    path: 'equipment-step3-description',
    loadChildren: () => import('./equipment-step3-description/equipment-step3-description.module').then( m => m.EquipmentStep3DescriptionPageModule)
  },
  {
    path: 'equipment-step4-warranty',
    loadChildren: () => import('./equipment-step4-warranty/equipment-step4-warranty.module').then( m => m.EquipmentStep4WarrantyPageModule)
  },
  {
    path: 'equipment-step5-summary',
    loadChildren: () => import('./equipment-step5-summary/equipment-step5-summary.module').then( m => m.EquipmentStep5SummaryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentAddFlowPageRoutingModule {}
