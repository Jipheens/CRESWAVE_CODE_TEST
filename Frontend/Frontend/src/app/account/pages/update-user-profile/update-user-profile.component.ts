import { Component, OnInit } from "@angular/core";
import { User } from "../../data/types/user";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/service/auth.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-update-user-profile",
  templateUrl: "./update-user-profile.component.html",
  styleUrls: ["./update-user-profile.component.scss"],
})
export class UpdateUserProfileComponent implements OnInit {
  hide = true;
  user: User;
  updatePasswordForm: FormGroup;
  currentUser: any;
  currentYear: any;
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private tokenStorageService: TokenCookieService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.currentUser = this.tokenStorageService.getUser();
    console.log("current user:", this.currentUser);

    this.updatePasswordForm = this.fb.group({
      emailAddress: [this.currentUser.email, [Validators.required]],
      // currentPassword: ["", [Validators.required]],
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
      confirmPassword: [
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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updatePassword() {
    console.log("Details submitted:", this.updatePasswordForm.value);
    if (
      this.updatePasswordForm.value.password !==
      this.updatePasswordForm.value.confirmPassword
    ) {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Passwords don't match, Please check and retry!"
      );
    } else {
      this.authService
        .updatePassword(this.updatePasswordForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.snackbar.showNotification("snackbar-success", res.message);
            console.log(res);

            this.router.navigate(["/erp-dashboard/home"]);
          },
          (err) => {
            console.log(err);

            this.snackbar.showNotification("snackbar-danger", err.message);
          }
        );
    }
  }
}
