import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";
import { ManageUsersComponent } from "./components/user-management/manage-users/manage-users.component";
import { SharedModule } from "src/app/shared/shared.module";
import { MaterialModule } from "src/app/shared/material.module";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AllUsersComponent } from "./components/user-management/all-users/all-users.component";
import { DashboardModule } from "../dashboard/dashboard.module";
import { AllRolesComponent } from './components/role-management/all-roles/all-roles.component';
import { ManageRolesComponent } from './components/role-management/manage-roles/manage-roles.component';
import { RolesLookupComponent } from './components/role-management/roles-lookup/roles-lookup.component';
import { VerifyUserComponent } from './components/user-management/verify-user/verify-user.component';
import { ValidationDialogComponent } from './components/user-management/validation-dialog/validation-dialog.component';
import { LoginSessionsComponent } from './components/login-sessions/login-sessions.component';

@NgModule({
  declarations: [ManageUsersComponent, AllUsersComponent, AllRolesComponent, ManageRolesComponent, RolesLookupComponent, VerifyUserComponent, ValidationDialogComponent, LoginSessionsComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    MaterialModule,
    ComponentsModule,
    DashboardModule,
  ],
})
export class AdminModule { }
