import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { ComponentsModule } from '../shared/components/components.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';
import { UpdateUserProfileComponent } from './pages/update-user-profile/update-user-profile.component';


@NgModule({
  declarations: [
  
    UpdateUserProfileComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    ComponentsModule,
    SharedModule,
    MatTabsModule,
    MatCheckboxModule
  ]
})
export class AccountModule { }
