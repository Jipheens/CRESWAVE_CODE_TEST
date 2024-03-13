import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { TokenStorageService } from "src/app/core/service/token-storage.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.sass"],
})
export class ResetPasswordComponent implements OnInit {
  isSuccessful = false;
  isUploadFailed = false;
  errorMessage = "";

  action: string;
  dialogTitle: string;
  //employeesForm: FormGroup;
  sender: any;

  Data?: any;
  message?: any;
  Form!: FormGroup;

  //categorys = [{ name: "Company" }, { name: "Individual" }];

  selectFeedback: " ";

  currentUserName: any;
  hide1 = true;
  hide2 = true;

  loading: boolean = false;

  constructor(
    private router: Router,
    private tokenStorage: TokenCookieService,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<DashboardComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.Data = data.test;
  }

  ngOnInit(): void {
    this.currentUserName = this.tokenStorage.getUser().username;
    this.Form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      username: [this.currentUserName, [Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
          Validators.minLength(10),
          Validators.maxLength(25),
        ],
      ],

      confirmpassword: [
        "",
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
          Validators.minLength(10),
          Validators.maxLength(25),
        ],
      ],

      // password: ["", [Validators.required]],
      // confirmpassword: ["", [Validators.required]],
    });
  }

  // {
  //   "headers": {
  //     "normalizedNames": {},
  //     "lazyUpdate": null
  //   },
  //   "status": 200,
  //   "statusText": "OK",
  //   "url": "https://uraintegration-auth.postbank.co.ug/soa/auth/logout",
  //   "ok": true,
  //   "type": 4,
  //   "body": {
  //     "name": null,
  //     "account_no": null,
  //     "scheme_code": null,
  //     "scheme_type": null,
  //     "message": "Logged Out Successfully!",
  //     "entity": null,
  //     "statusCode": 200
  //   }
  // }

  // resetPassword() {
  //   if (this.Form.value.password !== this.Form.value.confirmpassword) {
  //     this.snackbar.showNotification(
  //       "snackbar-danger",
  //       "Passwords don't match, please check and retry!"
  //     );
  //   } else {
  //     this.loading = true;
  //     this.staticsService.firstTimeResetPassword(this.Form.value).subscribe(
  //       (res) => {
  //         console.log("res: ", res);

  //         this.loading = false;
  //         if (res.message) {
  //           this.dialogRef.close({ event: "close", data: "Password reset" });
  //           this.notificationAPI.alertSuccess(res.message);
  //         } else {
  //           this.notificationAPI.alertWarning("Password reset was not succesful");
  //         }
  //       },
  //       (err) => {
  //         this.loading = false;
  //         // this.notificationAPI.alertWarning(err);
  //         this.notificationAPI.alertWarning(
  //           "Password policy not met. Use a different password!"
  //         );
  //       }
  //     );
  //   }
  // }

  resetPassword() {
    // if (this.Form.value.password !== this.Form.value.confirmpassword) {
    //   this.snackbar.showNotification(
    //     "snackbar-danger",
    //     "Passwords don't match, please check and retry!"
    //   );
    // } else if (this.Form.value.password.includes(this.currentUserName)) {
    //   this.notificationAPI.alertWarning(
    //     "Password policy not met. Use a different password!"
    //   );
    // } else {
    //   this.loading = true;
    // }
  }

  onClose(): void {
    // this.tokenStorage.signOut().subscribe(
    //   (res) => {
    //     console.log("res: ", res);
    //     if (res) {
    //       this.dialogRef.close();
    //       this.router.navigate(["/authentication/signin"]);
    //       this.notificationAPI.alertWarning(
    //         "Password reset required before proceeding!"
    //       );
    //     }
    //   },
    //   (err) => {
    //     console.log(err);
    //     this.dialogRef.close();
    //     this.router.navigate(["/authentication/signin"]);
    //     this.notificationAPI.alertWarning(err);
    //   }
    // );
  }
}
