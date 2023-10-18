import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsListPageComponent } from './accounts-list-page/accounts-list-page.component';
import { AccountDetailsPageComponent } from './account-details-page/account-details-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AccountsListPageComponent,
    AccountDetailsPageComponent
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule
  ]
})
export class AccountsModule { }
