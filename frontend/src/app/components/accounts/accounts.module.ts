import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsListPageComponent } from './accounts-list-page/accounts-list-page.component';
import { AccountDetailsPageComponent } from './account-details-page/account-details-page.component';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule  } from '@angular/material/card';

@NgModule({
  declarations: [
    AccountsListPageComponent,
    AccountDetailsPageComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class AccountsModule { }
