import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ManageUsersComponent } from "./components/user-management/manage-users/manage-users.component";
import { RoutePrivilegeGuard } from "src/app/admin/data/services/_AccessControlAuthGuard.service";
import { AllUsersComponent } from "./components/user-management/all-users/all-users.component";
import { AllRolesComponent } from "./components/role-management/all-roles/all-roles.component";
import { ManageRolesComponent } from "./components/role-management/manage-roles/manage-roles.component";
import { VerifyUserComponent } from "./components/user-management/verify-user/verify-user.component";
import { LoginSessionsComponent } from "./components/login-sessions/login-sessions.component";

const routes: Routes = [
  {
    path: "all-users",
    component: AllUsersComponent,
    // canActivate: [RoutePrivilegeGuard],
    // data: {
    //   clientName: "AdminModule",
    //   requiredPrivilege: ["All Users", "Dashboard"],
    // },
  },
  {
    path: "manage-users",
    component: ManageUsersComponent,
    // canActivate: [RoutePrivilegeGuard],
    // data: {
    //   clientName: "AdminModule",
    //   requiredPrivilege: ["Manage Users", "Dashboard"],
    // },
  },
  {
    path: "verify-user",
    component: VerifyUserComponent,
    // canActivate: [RoutePrivilegeGuard],
    // data: {
    //   clientName: "AdminModule",
    //   requiredPrivilege: ["Manage Users", "Dashboard"],
    // },
  },
  {
    path: "all-roles",
    component: AllRolesComponent,
  },
  {
    path: "manage-roles",
    component: ManageRolesComponent,
  },
  {
    path: "login-sessions",
    component: LoginSessionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
