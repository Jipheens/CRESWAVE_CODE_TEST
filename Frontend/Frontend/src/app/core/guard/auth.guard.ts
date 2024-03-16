import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import { AuthService } from "../service/auth.service";
import { TokenCookieService } from "../service/token-storage-cookies.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenCookieService: TokenCookieService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.tokenCookieService.getUser();

    if (currentUser) {
      return true;
    }

    // If user is not authenticated, redirect to the login page with the return URL
    this.router.navigate(["/authentication/signin"]);
    return false;
  }
}
