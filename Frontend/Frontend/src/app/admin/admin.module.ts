import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";
import { SafePipe } from './data/fileConversion/safe.pipe';

@NgModule({
  declarations: [
    SafePipe
  ],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
