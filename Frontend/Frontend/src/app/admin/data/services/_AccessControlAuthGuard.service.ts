import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AccessControlService } from "./_AccessControlService.service";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";

@Injectable({
  providedIn: "root",
})
export class RoutePrivilegeGuard implements CanActivate {
  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  constructor(
    private authService: AccessControlService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private tokenCookieService: TokenCookieService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.tokenCookieService.getUser();

    if (!currentUser) {
      // User is not authenticated, redirect to the login page
      this.router.navigate(["/authentication/signin"], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    const requiredPrivilege = route.data.requiredPrivilege;
    const clientName = route.data.clientName; // Get the client name from the route data

    if (this.authService.hasPrivilege(clientName, requiredPrivilege)) {
      return true;
    }

    this._snackBar.open(
      "You do not have the necessary permissions to access this resource!",
      "X",
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 20000,
        panelClass: ["snackbar-danger"],
      }
    );

    return false;
  }
}
