import { Component, HostListener, OnInit, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { interval, Subject, Subscription } from "rxjs";
import { ResetPasswordComponent } from "src/app/authentication/reset-password/reset-password.component";
import { AuthService } from "src/app/core/service/auth.service";
import { NotificationService } from "src/app/core/service/notification.service";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { SelectionModel } from "@angular/cdk/collections";
import { MatTableDataSource } from "@angular/material/table";
import { UserManagementService } from "src/app/user-management.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { AddBlogDialogComponent } from "../add-blog-dialog/add-blog-dialog.component";


@Component({
  selector: "app-common-dashboard",
  templateUrl: "./common-dashboard.component.html",
  styleUrls: ["./common-dashboard.component.scss"],
})
export class CommonDashboardComponent implements OnInit {
  currentUser: any;
  currentYear: any;
  modules: any[] = [];
  greetingMessage: string; 
  profilePictureUrl: string = 'assets/images/user/profile_img.png';
  checkInTime: Date;
  checkOutTime: Date;
  data: any;

  checkInIntervalSubscription: Subscription;
  elapsedTime: number = 0; 
  private reloadExecuted: boolean;
  private tokenRefreshSubscription: Subscription;
blogs: any[] = [];
  passwordFlag = "N";
  elapsedTimeDisplay: string;
  isLoading = true;
  destroy$: Subject<boolean> = new Subject<boolean>();



  constructor(
    private router: Router,
    private notificationAPI: NotificationService,
    private tokenCookieService: TokenCookieService,
    private authService: AuthService,
    private dialog: MatDialog,
    private http: HttpClient,
    private snackbar: SnackbarService,

    private userService: UserManagementService,

  ) { }


ngOnInit() {
  this.currentYear = new Date().getFullYear();
  this.currentUser = this.tokenCookieService.getUser();
  console.log("currentUser Main dashboard: ", this.currentUser);
  this.getData();
  this.setGreeting();
  const savedCheckInTime = localStorage.getItem('checkInTime');
  if (savedCheckInTime) {
    this.checkInTime = new Date(savedCheckInTime);
    this.startCheckInTimer();
  }
}


 setGreeting(): void { 
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

 addNewBlog(): void {
  const dialogRef = this.dialog.open(AddBlogDialogComponent, {
    width: '500px', 
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      console.log('New blog added:', result);
    }
  });
}

// updateModule(module: any): void {
//   const dialogRef = this.dialog.open(AddBlogDialogComponent, {
//     width: '400px',
//     data: {
//       blogTitle: module.blogTittle,
//       blogType: module.blogType,
//       headline: module.headline,
//       blogDescription: module.blogDecription,
//       author: module.author,
//       timestamp: module.timestamp
//     }   });

//   dialogRef.afterClosed().subscribe((result: any) => {
//     console.log('The dialog was closed with result:', result);
//   });
// }

isSuperUser(): boolean {
  // Check if the user has the 'ROLE_SUPERUSER' role
  const userRoles = this.tokenCookieService.getUser().roles;
  return userRoles.includes('ROLE_SUPERUSER');
}

updateModule(module: any): void {
  const currentUser = this.tokenCookieService.getUser().username;
  
  const currentTimestamp = new Date().toISOString();

  const dialogRef = this.dialog.open(AddBlogDialogComponent, {
    width: '400px',
    data: {
      id: module.id,
      blogTittle: module.blogTittle,
      blogType: module.blogType,
      headline: module.headline,
      blogDecription: module.blogDecription,
      author: currentUser,
      timestamp: currentTimestamp
    }
  });


  dialogRef.afterClosed().subscribe(updatedData => {
    if (updatedData) {
        this.getData();
    }
});
}
getData() {
  console.log("making API call");
  this.isLoading = true;
  this.userService
    .getBlogs()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        console.log("Response from API:", res);
        if (res.statusCode === 200) {
          this.snackbar.showNotification("snackbar-success", res.message);
          this.data = res.entity;
          this.modules = this.data;
        } else {
          this.snackbar.showNotification("snackbar-danger", res.message || "Unknown error occurred");
        }
      },
      error: (err) => {
        console.error("Error fetching data:", err);
        this.snackbar.showNotification("snackbar-danger", "An error occurred while fetching data");
      },
      complete: () => {
        this.isLoading = false;
      }
    });
}


openBlogDescription(blog: any) {
 
}

updateBlog(blog: any) {
  console.log("Update blog:", blog);
}

deleteBlog(blog: any) {
  console.log("Delete blog:", blog);
}

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


  


  deleteModule(id: number) {
    this.userService.deleteModule(id).subscribe(
      (response) => {
        if (response.statusCode === 200) {
          this.snackbar.showNotification(
            "snackbar-success",
            response.message
          );
          const index = this.modules.findIndex(module => module.id === id);
          if (index !== -1) {
            this.modules.splice(index, 1);
          }
        } else {
          this.snackbar.showNotification(
            "snackbar-danger",
            response.message || "Unknown error occurred"
          );
        }
      },
      (error) => {
        console.error("Error deleting module:", error);
        this.snackbar.showNotification(
          "snackbar-danger",
          "An error occurred while deleting module"
        );
      }
    );
  }
  
  
  checkIn() {
    this.checkInTime = new Date();
    localStorage.setItem('checkInTime', this.checkInTime.toString()); 
    this.startCheckInTimer();
 }

 checkOut() {
  if (this.checkInTime) {
    this.checkOutTime = new Date();
    this.elapsedTime = Math.floor((this.checkOutTime.getTime() - this.checkInTime.getTime()) / 1000);
    this.checkInIntervalSubscription.unsubscribe(); 
  }
}

 startCheckInTimer() {
    this.checkInIntervalSubscription = interval(1000).subscribe(() => {
      this.elapsedTime = Math.floor((new Date().getTime() - this.checkInTime.getTime()) / 1000);
    const hours = Math.floor(this.elapsedTime / 3600);
    const minutes = Math.floor((this.elapsedTime % 3600) / 60);
    const seconds = this.elapsedTime % 60;
    this.elapsedTimeDisplay = `${hours}h ${minutes}m ${seconds}s`; 
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
    const target = event.target as HTMLElement;
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling) {
        nextSibling.style.display = "block";
    }
}

  handleMouseLeave(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling) {
        nextSibling.style.display = "none";
    }
}
  private performTokenRefresh(): void {
    const refreshToken =
      this.tokenCookieService.getSharedRefreshTokenFromCookie();
    console.log("retrived refreshToken: ", refreshToken);
    if (refreshToken) {
      this.tokenRefreshSubscription = this.authService
        .refreshAccessToken(refreshToken)
        .subscribe(
          (response) => {
            this.tokenCookieService.saveUser(response.entity);
          },
          (error) => {
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

  @HostListener("window:beforeunload")
  onBackButton() {
    return;
  }
}
