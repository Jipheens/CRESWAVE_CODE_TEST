import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CommonDashboardComponent } from "./common-dashboard/common-dashboard.component";
import { AuthGuard } from "../core/guard/auth.guard";

const routes: Routes = [
  {
    path: "home",
    component: CommonDashboardComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErpDashboardRoutingModule {}
