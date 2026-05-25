import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'items',
    loadChildren: () => import('./modules/item-management/item-management.module').then(m => m.ItemManagementModule)
  },
  {
    path: 'asn',
    loadChildren: () => import('./modules/asn-management/asn-management.module').then(m => m.AsnManagementModule)
  },
  {
    path: 'inventory',
    loadChildren: () => import('./modules/inventory-management/inventory-management.module').then(m => m.InventoryManagementModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./modules/order-management/order-management.module').then(m => m.OrderManagementModule)
  },
  {
    path: 'waves',
    loadChildren: () => import('./modules/wave-management/wave-management.module').then(m => m.WaveManagementModule)
  },
  {
    path: 'picks',
    loadChildren: () => import('./modules/pick-management/pick-management.module').then(m => m.PickManagementModule)
  },
  {
    path: 'packs',
    loadChildren: () => import('./modules/pack-management/pack-management.module').then(m => m.PackManagementModule)
  },
  {
    path: 'shipments',
    loadChildren: () => import('./modules/shipment-management/shipment-management.module').then(m => m.ShipmentManagementModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/item-management/item-management.module').then(m => m.ItemManagementModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
