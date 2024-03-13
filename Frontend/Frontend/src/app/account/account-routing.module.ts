import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UpdateUserProfileComponent } from "./pages/update-user-profile/update-user-profile.component";

const routes: Routes = [
  {
    path: "update-profile",
    component: UpdateUserProfileComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
