

// import { Injectable } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
// import { TokenCookieService } from './token-storage-cookies.service';

// @Injectable()
// export class IdleTimer {

//   // Define position variables for snack bar
//   horizontalPosition: MatSnackBarHorizontalPosition = "end";
//   verticalPosition: MatSnackBarVerticalPosition = "top";

//   private timeout: number;
//   private onTimeout: Function;
//   private eventHandler = (event: MouseEvent) => {
//     this.updateExpiredTime();
//   }
//   private interval: any;
//   private timeoutTracker: any;
//   private loggedIn: boolean = false;
//   private timeLeft: number = 0;
//   private timerStarted: boolean = false;

//   constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private tokenCookieService: TokenCookieService) { }

//   // Start the idle timer with a given timeout and onTimeout function
//   start({ timeout, onTimeout }) {
//     let currentUser = this.tokenCookieService.getUser();
//     // let token = this.tokenCookieService.getToken();
//     if(currentUser !== null){
//       this.timeout = timeout;
//       this.onTimeout = onTimeout;
//       this.loggedIn = true;

//       // Bind event handler to current instance of IdleTimer
//       this.eventHandler = this.updateExpiredTime.bind(this);
//       this.tracker(); // Start listening to user events

//       // Only start the interval timer if it hasn't been started already
//       if (!this.interval) {
//         this.startInterval();
//       }
//     }
//   }

//   // start({ timeout, onTimeout }) {
//   //   let currentUser = this.tokenCookieService.getUser();
//   //   // let token = this.tokenCookieService.getToken();
//   //   if(currentUser !== null){
//   //     this.timeout = timeout;
//   //     this.onTimeout = onTimeout;
//   //     this.loggedIn = true;

//   //     // Bind event handler to current instance of IdleTimer
//   //     this.eventHandler = this.updateExpiredTime.bind(this);
//   //     this.tracker(); // Start listening to user events
//   //     this.startInterval(); // Start the interval timer
//   //   }
//   // }

//   // Start the interval timer and check for timeout status
//   startInterval() {
//     this.updateExpiredTime(); // Update the expiration time

//     // Check for timeout every second
//     this.interval = setInterval(() => {
//       if (!this.loggedIn) {
//         // Stop the interval if user is no longer logged in
//         this.clear();
//         return;
//       }

//       const expiredTime = parseInt(localStorage.getItem("_expiredTime"), 10);
//       this.timeLeft = (expiredTime - Date.now()) / 1000;

//       if (expiredTime < Date.now()) {
//         if (this.onTimeout) {
//           // Close any open mat dialog boxes and run the onTimeout function
//           this.dialog.closeAll();
//           this.onTimeout();
//           this.clear(); // Stop listening to user events and clear the interval timer
//         }
//       } else if (this.timeLeft <= this.timeout * 0.1) {
//         if (!this.timerStarted) {
//           this.timerStarted = true;
//           this.startTimer();
//         }
//       }
//     }, 1000);
//   }

//   // Start the countdown timer for the snack bar message
//   startTimer() {
//     const timerInterval = setInterval(() => {
//       this.snackBar.dismiss();
//       this.snackBar.open(
//         "The system will sign you out in the next " + this.timeLeft.toFixed(0) + " seconds!",
//         "X",
//         {
//           horizontalPosition: this.horizontalPosition,
//           verticalPosition: this.verticalPosition,
//           duration: 1000,
//           panelClass: ["snackbar-danger", "login-snackbar"],
//         }
//       );
//       this.timeLeft--;
//       if (this.timeLeft < 0) {
//         clearInterval(timerInterval);
//         this.timerStarted = false;
//       }
//     }, 1000);
//   }

//   // Start the countdown timer for the snack bar message
// // startTimer() {
// //   let previousTimeLeft = this.timeLeft;
// //   const timerInterval = setInterval(() => {
// //     this.snackBar.dismiss();
// //     if (this.timeLeft !== previousTimeLeft) {
// //       this.snackBar.open(
// //         "The system will sign you out in the next " + this.timeLeft.toFixed(0) + " seconds!",
// //         "X",
// //         {
// //           horizontalPosition: this.horizontalPosition,
// //           verticalPosition: this.verticalPosition,
// //           duration: 1500,
// //           panelClass: ["snackbar-danger", "login-snackbar"],
// //         }
// //       );
// //       previousTimeLeft = this.timeLeft;
// //     }
// //     this.timeLeft--;
// //     if (this.timeLeft < 0) {
// //       clearInterval(timerInterval);
// //       this.timerStarted = false;
// //     }
// //   }, 1000);
// // }
//   // Update the expiration time
//   updateExpiredTime() {
//     if (this.timeoutTracker) {
//       clearTimeout(this.timeoutTracker);
//     }
//     this.timeoutTracker = setTimeout(() => {
//       localStorage.setItem("_expiredTime", (Date.now() + this.timeout * 1000).toString());
//     }, 300);
//   }

//   // Listen to user events
//   tracker() {
//     window.addEventListener("mousemove", this.eventHandler);
//     window.addEventListener("scroll", this.eventHandler);
//     window.addEventListener("keydown", this.eventHandler);
//   }

//   // Stop listening to user events and clear the interval timer
//   clear() {
//     clearInterval(this.interval);
//     window.removeEventListener("mousemove", this.eventHandler);
//     window.removeEventListener("scroll", this.eventHandler);
//     window.removeEventListener("keydown", this.eventHandler);
//     localStorage.removeItem("_expiredTime");
//   }
// }

// **********************************************************************************************************************************************************************************

// import { Injectable } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { TokenCookieService } from './token-storage-cookies.service';

// @Injectable()
// export class IdleTimer {
//   private timeout: number;
//   private onTimeout: Function;
//   private interval: any;
//   private timeoutTracker: any;
//   private loggedIn: boolean = false;
//   private timeLeft: number = 0;
//   private timerStarted: boolean = false;

//   constructor(
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private tokenCookieService: TokenCookieService
//   ) {}

//   // Start the idle timer with a given timeout and onTimeout function
//   start({ timeout, onTimeout }) {
//     const currentUser = this.tokenCookieService.getUser();
//     if (currentUser) {
//       this.timeout = timeout;
//       this.onTimeout = onTimeout;
//       this.loggedIn = true;
//       this.startTracker();
//     }
//   }

//   // Start listening to user events
//   startTracker() {
//     window.addEventListener('mousemove', this.updateExpiredTime);
//     window.addEventListener('scroll', this.updateExpiredTime);
//     window.addEventListener('keydown', this.updateExpiredTime);
//     this.startInterval();
//   }

//   // Start the interval timer and check for timeout status
//   startInterval() {
//     this.updateExpiredTime();
//     this.interval = setInterval(() => {
//       if (!this.loggedIn) {
//         this.stopTracker();
//         return;
//       }

//       const expiredTime = parseInt(localStorage.getItem('_expiredTime'), 10);
//       this.timeLeft = (expiredTime - Date.now()) / 1000;

//       if (expiredTime < Date.now()) {
//         if (this.onTimeout) {
//           this.dialog.closeAll();
//           this.onTimeout();
//           this.stopTracker();
//         }
//       } else if (this.timeLeft <= this.timeout * 0.1) {
//         if (!this.timerStarted) {
//           this.timerStarted = true;
//           this.startTimer();
//         }
//       }
//     }, 1000);
//   }

//   // Start the countdown timer for the snack bar message
//   startTimer() {
//     const timerInterval = setInterval(() => {
//       this.snackBar.dismiss();
//       this.snackBar.open(
//         `The system will sign you out in the next ${this.timeLeft.toFixed(0)} seconds!`,
//         'X',
//         {
//           duration: 1000,
//           horizontalPosition: 'end',
//           verticalPosition: 'top',
//           panelClass: ['snackbar-danger', 'login-snackbar'],
//         }
//       );
//       this.timeLeft--;
//       if (this.timeLeft < 0) {
//         clearInterval(timerInterval);
//         this.timerStarted = false;
//       }
//     }, 1000);
//   }

//   // Update the expiration time
//   updateExpiredTime = () => {
//     clearTimeout(this.timeoutTracker);
//     this.timeoutTracker = setTimeout(() => {
//       localStorage.setItem('_expiredTime', (Date.now() + this.timeout * 1000).toString());
//     }, 300);
//   }

//   // Stop listening to user events and clear the interval timer
//   stopTracker() {
//     clearInterval(this.interval);
//     window.removeEventListener('mousemove', this.updateExpiredTime);
//     window.removeEventListener('scroll', this.updateExpiredTime);
//     window.removeEventListener('keydown', this.updateExpiredTime);
//   }
// }


// *************************************************************************************************************************************************************************************************
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TokenCookieService } from './token-storage-cookies.service';

@Injectable({
  providedIn: 'root'
})
export class IdleTimer {

  private timeout: number;
  private onTimeout: Function;
  private eventHandler = () => {
    this.updateExpiredTime();
  };
  private interval: any;
  private timeoutTracker: any;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private tokenCookieService: TokenCookieService
  ) {}

  start({ timeout, onTimeout }) {
    const currentUser = this.tokenCookieService.getUser();
    const token = this.tokenCookieService.getToken();

    if (currentUser) {
      this.timeout = timeout;
      this.onTimeout = onTimeout;
      this.eventHandler = this.updateExpiredTime.bind(this);
      this.tracker();
      this.startInterval();
    }
  }

  startInterval() {
    this.updateExpiredTime();

    this.interval = setInterval(() => {
      const expiredTime = parseInt(localStorage.getItem("_expiredTime"), 10);
      const timeLeft = (expiredTime - Date.now()) / 1000;

      if (timeLeft <= this.timeout * 0.1) {
        this.showSnackBar(`The system will sign you out in the next ${timeLeft.toFixed(0)} seconds!`);
      }

      if (expiredTime < Date.now()) {
        if (this.onTimeout) {
          this.dialog.closeAll();
          this.onTimeout();
          this.clear();
        }
      }
    }, 1000);
  }

  updateExpiredTime() {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker);
    }
    this.timeoutTracker = setTimeout(() => {
      localStorage.setItem("_expiredTime", (Date.now() + this.timeout * 1000).toString());
    }, 300);
  }

  tracker() {
    window.addEventListener("mousemove", this.eventHandler);
    window.addEventListener("scroll", this.eventHandler);
    window.addEventListener("keydown", this.eventHandler);
  }

  clear() {
    clearInterval(this.interval);
    window.removeEventListener("mousemove", this.eventHandler);
    window.removeEventListener("scroll", this.eventHandler);
    window.removeEventListener("keydown", this.eventHandler);
    localStorage.removeItem("_expiredTime");
  }

  showSnackBar(message: string) {
    const horizontalPosition: MatSnackBarHorizontalPosition = "end";
    const verticalPosition: MatSnackBarVerticalPosition = "top";
    const duration = 10000;
    const panelClass = ["snackbar-danger", "login-snackbar"];

    this.snackBar.open(message, "X", {
      horizontalPosition,
      verticalPosition,
      duration,
      panelClass,
    });
  }
}
