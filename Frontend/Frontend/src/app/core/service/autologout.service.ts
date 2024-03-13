import { DOCUMENT } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { interval, Observable, Subscription } from "rxjs";
import { takeWhile, tap } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class AutoLogoutService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  private readonly INACTIVITY_TIMEOUT = 180000; // 3 minutes in milliseconds
  //private readonly INACTIVITY_TIMEOUT = 60000; // 3 minutes in milliseconds

  private readonly COUNTDOWN_TIMEOUT = 30000; // 30 seconds in milliseconds
  private timerSubscription: Subscription;

  constructor(
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  start() {
    // Check if the user is logged in
    if (!this.isUserLoggedIn()) {
      return;
    }

    // Set up the inactivity timer
    const timer = interval(this.INACTIVITY_TIMEOUT);
    this.timerSubscription = timer.subscribe(() => {
      // Start the countdown and log the user out when the countdown finishes
      this.startCountdown();
    });
  }

  reset() {
    // Reset the inactivity timer and countdown timer
    this.timerSubscription.unsubscribe();
    this.start();
  }

  private isUserLoggedIn(): boolean {
    // Check if the user is logged in by checking if there's a token in secure cookies
    const token = localStorage.getItem("auth-user");
    return !!token;
  }

  signOut(): Observable<any> {
    const SIGNOUT_URL = `${environment.baseUrlAdmin}/soa/auth/logout`;

    // Show a message to the user indicating that the page is reloading
    const snackBarRef = this._snackBar.open(
      "Logging out... Please wait.",
      null,
      {
        horizontalPosition: "end",
        verticalPosition: "top",
        panelClass: ["snackbar-success", "snackbar-success"],
      }
    );

    return this.http
      .post(SIGNOUT_URL, "data", {
        observe: "response",
        headers: this.headers,
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          // clear local storage
          localStorage.clear();

          // clear cookies
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }

          // Hide the snackbar after a delay of 1.5 seconds
          setTimeout(() => {
            snackBarRef.dismiss();
          }, 1500);

          // Reload the current page after a delay of 2 seconds
          setTimeout(() => {
            location.reload();
          }, 2000);
        })
      );
  }

  private startCountdown() {
    // Display the countdown on a snackbar 10% of the time before log out
    const countdownTimer = interval(this.COUNTDOWN_TIMEOUT).pipe(
      takeWhile(() => this.timerSubscription != null)
    );
    countdownTimer.subscribe((count) => {
      const remainingSeconds = Math.ceil(
        (this.INACTIVITY_TIMEOUT - (count + 1) * this.COUNTDOWN_TIMEOUT) / 1000
      );
      const message = `You will be logged out in ${remainingSeconds} seconds due to inactivity.`;
      this.snackBar.open(message, "Dismiss", {
        duration: this.COUNTDOWN_TIMEOUT,
      });
      if (
        count ===
        Math.floor((this.INACTIVITY_TIMEOUT / this.COUNTDOWN_TIMEOUT) * 0.1)
      ) {
        this.signOut().subscribe();
      }
    });
  }
}
