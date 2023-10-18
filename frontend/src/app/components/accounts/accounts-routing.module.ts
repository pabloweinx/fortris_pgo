// accounts-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsListPageComponent } from './accounts-list-page/accounts-list-page.component';
import { AccountDetailsPageComponent } from './account-details-page/account-details-page.component';

const routes: Routes = [
    {
        path: '',
        component: AccountsListPageComponent
    },
    {
        path: ':id',
        component: AccountDetailsPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountsRoutingModule { }
