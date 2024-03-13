import { NgModule, Optional, SkipSelf } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RightSidebarService } from "./service/rightsidebar.service";
import { AuthGuard } from "./guard/auth.guard";
import { AuthService } from "./service/auth.service";
import { DynamicScriptLoaderService } from "./service/dynamic-script-loader.service";
import { throwIfAlreadyLoaded } from "./guard/module-import.guard";
import { DirectionService } from "./service/direction.service";
import { MatDialogModule } from "@angular/material/dialog";
import { IdleTimer } from "./service/idletime.service";

@NgModule({
  declarations: [],
  imports: [CommonModule ,MatDialogModule],
  providers: [
    RightSidebarService,
    AuthGuard,
    AuthService,
    DynamicScriptLoaderService,
    DirectionService,
    IdleTimer
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, "CoreModule");
  }
}
