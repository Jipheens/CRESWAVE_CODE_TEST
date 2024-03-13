import { Component, HostListener, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { interval, Subscription } from "rxjs";
import { ResetPasswordComponent } from "src/app/authentication/reset-password/reset-password.component";
import { AuthService } from "src/app/core/service/auth.service";
import { NotificationService } from "src/app/core/service/notification.service";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: "app-common-dashboard",
  templateUrl: "./common-dashboard.component.html",
  styleUrls: ["./common-dashboard.component.scss"],
})
export class CommonDashboardComponent implements OnInit {
  currentUser: any;
  currentYear: any;
  greetingMessage: string; // Add this line
  profilePictureUrl: string = 'assets/images/user/profile_img.png';
  checkInTime: Date;
  checkOutTime: Date;
  checkInIntervalSubscription: Subscription;
  elapsedTime: number = 0; // in seconds

  private reloadExecuted: boolean;
  private tokenRefreshSubscription: Subscription;

  passwordFlag = "N";
  elapsedTimeDisplay: string;

  constructor(
    private router: Router,
    private notificationAPI: NotificationService,
    private tokenCookieService: TokenCookieService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    // this.passwordFlag = this.tokenCookieService.getUser().isSystemGenPassword;
    this.currentUser = this.tokenCookieService.getUser();
    console.log("currentUser Main dashboard: ", this.currentUser);
    // if (this.currentUser !== null && this.currentUser !== undefined) {
    //   this.performTokenRefresh();
    // }
    // console.log("passwordFlag: ", this.passwordFlag);
    // if (this.passwordFlag === "Y") {
    //   this.resetPassword();
    // } else if (!this.passwordFlag) {
    // }
    this.setGreeting(); // Call the method to set the greeting
     // Restore the timer state if available
     const savedCheckInTime = localStorage.getItem('checkInTime');
     if (savedCheckInTime) {
       this.checkInTime = new Date(savedCheckInTime);
       this.startCheckInTimer();
     }
 }

 setGreeting(): void { // Implement the method to set the greeting
    const currentHour = new Date().getHours();
    if (currentHour >= 4 && currentHour < 12) {
      this.greetingMessage = 'Good Morning SuperAdmin!';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greetingMessage = 'Good Afternoon SuperAdmin!';
    } else {
      this.greetingMessage = 'Good Evening SuperAdmin!';
    }
  }
  
  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePictureUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
 }

  //isSystemGenPassword

  resetPassword() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.data = {
      test: "username",
    };

    const dialogRef = this.dialog.open(ResetPasswordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => { });
  }

  checkIn() {
    this.checkInTime = new Date();
    localStorage.setItem('checkInTime', this.checkInTime.toString()); // Save the start time
    this.startCheckInTimer();
 }

 checkOut() {
  if (this.checkInTime) {
    this.checkOutTime = new Date();
    this.elapsedTime = Math.floor((this.checkOutTime.getTime() - this.checkInTime.getTime()) / 1000);
    this.checkInIntervalSubscription.unsubscribe(); // Ensure to unsubscribe to prevent memory leaks
  }
}

 startCheckInTimer() {
    this.checkInIntervalSubscription = interval(1000).subscribe(() => {
      this.elapsedTime = Math.floor((new Date().getTime() - this.checkInTime.getTime()) / 1000);
      // / Convert elapsedTime to hours and minutes for display
    const hours = Math.floor(this.elapsedTime / 3600);
    const minutes = Math.floor((this.elapsedTime % 3600) / 60);
    const seconds = this.elapsedTime % 60;
    this.elapsedTimeDisplay = `${hours}h ${minutes}m ${seconds}s`; // Example format
    });
 }

  ngOnDestroy() {
    if (this.tokenRefreshSubscription) {
      this.tokenRefreshSubscription.unsubscribe();
    }
    if (this.checkInIntervalSubscription) {
      this.checkInIntervalSubscription.unsubscribe();
    }
  }
  handleMouseEnter(event: MouseEvent) {
    // Show the additional information when the cursor enters the module
    const target = event.target as HTMLElement;
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling) {
        nextSibling.style.display = "block";
    }
}

  handleMouseLeave(event: MouseEvent) {
    // Hide the additional information when the cursor leaves the module
    const target = event.target as HTMLElement;
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling) {
        nextSibling.style.display = "none";
    }
}
// Other methods and event handlers here
  private performTokenRefresh(): void {
    const refreshToken =
      this.tokenCookieService.getSharedRefreshTokenFromCookie();
    console.log("retrived refreshToken: ", refreshToken);
    if (refreshToken) {
      this.tokenRefreshSubscription = this.authService
        .refreshAccessToken(refreshToken)
        .subscribe(
          (response) => {
            // Token refreshed successfully, update user session details
            this.tokenCookieService.saveUser(response.entity);
          },
          (error) => {
            // Token refresh failed, redirect user to login page
            this.router.navigate(["/authentication/signin"]);
          }
        );
    } else {
      this.router.navigate(["/authentication/signin"]);
    }
  }

  ngAfterViewInit(): void { }

  privileges: any[] = [];
  openModule(module: string) {
    this.currentUser = this.tokenCookieService.getUser();
    const userId = this.currentUser.id;
    localStorage.setItem(`selectedModule_${userId}`, JSON.stringify(module));
    console.log("module: ", module);

    const moduleRoutes = {
      AdminModule: "/erp-admin-module/dashboard",
      ProcurementModule: "/erp-procurement-module/dashboard",
      HumanResourceModule: "/erp-hr/dashboard",
      EmployeeSelfServiceModule: "/erp-hr/dashboard",
      FinanceModule: "/erp-finance/dashboard",
      SupplierManagementModule: "/erp-suppliermanagement/dashboard",
    };
    const route = moduleRoutes[module];
    if (route) {
      this.router.navigate([route]);
      console.log(`${module} module selected.`);
    } else {
      console.log("Invalid module selected.");
    }
  }

  // use this if HR and self service are to be handled externally
  // openModule(module: string) {
  //   this.currentUser = this.tokenCookieService.getUser();
  //   const userId = this.currentUser.id;
  //   localStorage.setItem(`selectedModule_${userId}`, JSON.stringify(module));
  //   console.log("module: ", module);

  //   const moduleRoutes = {
  //     AdminModule: "/admin-module/dashboard",
  //     ProcurementModule: "/erp-procurement/dashboard",
  //     HumanResourceModule: "/erp-hr/dashboard",
  //     EmployeeSelfServiceModule: "/erp-hr/dashboard",
  //     FinanceModule: "/erp-finance/dashboard",
  //     FixedAssetsModule: "/erp-fixed-assets/dashboard",
  //     SuppliersManagementModule: "/erp-suppliers-management/dashboard",
  //     BudgetModule: "/erp-budget/dashboard",
  //     ImprestModule: "/erp-imprest/dashboard",
  //     PrepaymentModule: "/erp-prepayment/dashboard",
  //     InventoryModule: "/erp-inventory/dashboard",
  //   };

  //   if (
  //     module === "HumanResourceModule" ||
  //     module === "EmployeeSelfServiceModule"
  //   ) {
  //     // Navigate to external dashboard for specific modules
  //     this.tokenCookieService.navigateToExternalDashboard(module).subscribe({
  //       next: (res) => {
  //         console.log("res: ", res.body);

  //         if (res.body.statusCode == 200) {
  //           // Handle success if needed
  //         } else {
  //           // Handle error if needed
  //         }
  //       },
  //       error: (err) => {
  //         // Handle error if needed
  //       },
  //       complete: () => {
  //         // Handle completion if needed
  //       },
  //     });
  //   } else {
  //     // Navigate to internal module route for all other modules
  //     const route = moduleRoutes[module];
  //     if (route) {
  //       this.router.navigate([route]);
  //       console.log(`${module} module selected.`);
  //     } else {
  //       console.log("Invalid module selected.");
  //     }
  //   }
  // }

  @HostListener("window:beforeunload")
  onBackButton() {
    return;
  }
}
