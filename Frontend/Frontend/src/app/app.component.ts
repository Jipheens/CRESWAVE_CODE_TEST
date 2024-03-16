import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import {
  Event,
  Router,
  NavigationStart,
  NavigationEnd,
  ActivatedRoute,
} from "@angular/router";
import { TokenCookieService } from "./core/service/token-storage-cookies.service";
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatSnackBar,
} from "@angular/material/snack-bar";
import { Subscription, interval, switchMap } from "rxjs";
import { AuthService } from "./core/service/auth.service";
import { IdleTimer } from "./core/service/idletime.service";
import { NotificationService } from "./core/service/notification.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [IdleTimer], // Add the service as a provider
})
export class AppComponent implements OnInit, OnDestroy {
  // @HostListener("document:keydown", ["$event"])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
  //     event.preventDefault();
  //   }
  // }

  currentUrl: string;
  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";
  private routerEventsSubscription: Subscription;
  private currentUser: any;
  private tokenRefreshSubscription: Subscription;

  constructor(
    private tokenCookieService: TokenCookieService,
    private snackBar: MatSnackBar,
    private idleTimer: IdleTimer,

    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notificationAPI: NotificationService
  ) {
    this.snackBar.dismiss();
    this.currentUser = this.tokenCookieService.getUser();
    if (this.currentUser !== null && this.currentUser !== undefined) {
      this.idleTimer.start({
        timeout: 60 * 5, // Set the timeout to 5 minutes
        onTimeout: () => {
          // Perform the action to be executed on timeout
          this.logout();
        },
      });
      this.startTokenRefresh(); // Start token refresh
    }
    this.routerEventsSubscription = this.router.events.subscribe(
      (routerEvent: Event) => {
        if (routerEvent instanceof NavigationStart) {
          this.currentUrl = routerEvent.url.substring(
            routerEvent.url.lastIndexOf("/") + 1
          );
        }
      }
    );
  }

  ngOnInit(): void { }

  private startTokenRefresh(): void {
    const REFRESH_INTERVAL = 30 * 60 * 1000; // Refresh token every 30 minutes
    this.tokenRefreshSubscription = interval(REFRESH_INTERVAL)
      .pipe(
        switchMap(() =>
          this.authService.refreshAccessToken(this.currentUser.refreshToken)
        )
      )
      .subscribe(
        (response) => {
          // Token refreshed successfully, update user session details
          this.tokenCookieService.saveUser(response);
        },
        (error) => {
          // Token refresh failed, redirect user to login page
          this.router.navigate(["/authentication/signin"]);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.tokenRefreshSubscription) {
      this.tokenRefreshSubscription.unsubscribe();
    }
    this.routerEventsSubscription.unsubscribe();
  }

  private logout(): void {
    let params = {
      refreshToken: this.tokenCookieService.getUser().refreshToken,
    };
    this.tokenCookieService.signOut(params).subscribe(
      (res) => {
        console.log("res: ", res);
        if (res.statusCode === 200) {
          this.router.navigate(["/authentication/signin"]);
          this.notificationAPI.alertSuccess(res.message);
        } else {
          this.notificationAPI.alertWarning(res.message);
          this.router.navigate(["/authentication/signin"]);
        }
      },
      (err) => {
        console.log(err);
        this.router.navigate(["/authentication/signin"]);
        this.notificationAPI.alertWarning(err.message);
      }
    );
  }
}
