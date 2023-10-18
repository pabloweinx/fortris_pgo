// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'accounts', 
    pathMatch: 'full'
  },
  {
    path: 'accounts',
    loadChildren: () => import('./components/accounts/accounts.module').then(m => m.AccountsModule)
  },
  {
    path: '**', // Esta es la ruta de comodín que captura cualquier URL no manejada
    redirectTo: 'accounts'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}