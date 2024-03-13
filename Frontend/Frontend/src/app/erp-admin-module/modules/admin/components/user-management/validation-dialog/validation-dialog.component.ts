import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { UsersManagementService } from "src/app/erp-admin-module/data/services/user-management.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-validation-dialog",
  templateUrl: "./validation-dialog.component.html",
  styleUrls: ["./validation-dialog.component.sass"],
})
export class ValidationDialogComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = "center";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  Data: any;
  status!: string;
  statusForm: FormGroup;
  rejected: boolean = false;
  approved: boolean = false;
  returned: boolean = false;
  currentUser: any;
  postedBy: any;
  canVerify: boolean = false;

  validationIsLoading: boolean = false;
  hideValidation = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  downloadLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ValidationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private tokenCookieService: TokenCookieService,
    private userManagementService: UsersManagementService,
    private router: Router,
    private datepipe: DatePipe
  ) {
    this.Data = this.dialogData.data;
    console.log("Dialog data: ", this.Data);
  }

  ngOnInit(): void {
    this.currentUser = this.tokenCookieService.getUser().username;
    this.postedBy = this.Data.postedBy;
    console.log("Posted by:", this.postedBy);

    if (this.postedBy === this.currentUser) {
      this.snackbar.showNotification(
        "snackbar-danger",
        "You cannot verify this transstatus!"
      );

      this.canVerify = false;
    } else {
      this.canVerify = true;
    }

    this.statusForm = this.createStatusForm();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  createStatusForm(): FormGroup {
    return this.fb.group({
      remarks: ["", [Validators.required]],
    });
  }

  reject() {
    this.rejected = true;
    this.approved = false;

    this.status = "REJECTED";
    if (!this.statusForm.value == null) {
      this.changeStatus();
    }
  }
  approve() {
    this.approved = true;
    this.rejected = false;

    this.status = "APPROVED";
    this.statusForm.patchValue({
      remarks: "NA",
    });

    this.changeStatus();
  }

  changeStatus() {
    this.validationIsLoading = true;
    let todayDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");

    const params = new HttpParams().set(
      "remarks",
      this.statusForm.value.remarks
    );

    let body = [];
    this.Data.forEach((element) => {
      let uploadData = { sn: element.sn, status: this.status };
      body.push(uploadData);
      console.log("Body:::", body);
    });

    this.userManagementService
      .validateUsers(body, params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.statusCode === 200) {
            this.snackbar.showNotification("snackbar-success", res.message);
          } else {
            this.snackbar.showNotification("snackbar-danger", res.message);
          }
        },
        error: (err) => {
          console.log("err = ", err);
          this.snackbar.showNotification(
            "snackbar-danger",
            "Server Error: " + err.message
          );
        },
        complete: () => {
          this.dialogRef.close();
          this.router.navigate(["/erp-admin-module/admin/all-users"]);
        },
      });
  }
}
