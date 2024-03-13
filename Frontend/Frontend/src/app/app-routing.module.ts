import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/guard/auth.guard";
import { Role } from "./core/models/role";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
import { Page404Component } from "./authentication/page404/page404.component";
import { MainDashboardComponent } from "./layout/app-layout/main-dashboard/main-dashboard.component";
const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "/authentication/signin",
        pathMatch: "full",
      },
      {
        path: "admin",
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "erp-admin-module",
        loadChildren: () =>
          import("./erp-admin-module/erp-admin-module.module").then(
            (m) => m.ErpAdminModuleModule
          ),
      },

    ],
  },
  {
    path: "account",
    component: MainDashboardComponent,
    loadChildren: () =>
      import("./account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: "erp-dashboard",
    component: MainDashboardComponent,
    loadChildren: () =>
      import("./erp-dashboard/erp-dashboard.module").then(
        (m) => m.ErpDashboardModule
      ),
  },


  { path: "**", component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
