import { Component, HostListener, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Subject, takeUntil, Subscription } from "rxjs";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { privileges } from "../_data/privileges";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm: FormGroup;
  submitted = false;
  loading = false;
  error = "";
  hide = true;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";
  roles: string[] = [];

  passwordFlag: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  private reloadExecuted: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tokenCookieService: TokenCookieService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {
    super();
    this.router.onSameUrlNavigation = "reload";
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });

    this.tokenCookieService.deleteUser();
  }

  onSubmit() {
    console.log("Login details:", this.authForm.value);
    localStorage.clear();

    this.submitted = true;
    this.loading = true;
    this.error = "";
    if (this.authForm.invalid) {
      this.error = "Username or Password not valid !";
      return;
    } else {
      this.authService
        .login(this.authForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log("res: ", res.body);

            if (res.body.statusCode == 201) {
              this.tokenCookieService.saveUser(res.body.entity);

              this.snackbar.showNotification(
                "snackbar-success",
                res.body.message
              );
              // this.router.navigate(["/authentication/otp-verification"]);
              this.router.navigate(["/erp-dashboard/home"]);
            } else {
              this.snackbar.showNotification(
                "snackbar-danger",
                res.body.message
              );
            }

            this.loading = false;
          },
          error: (err) => {
            console.log("err::: ", err);
            if (err.status === 401) {
              this.snackbar.showNotification(
                "snackbar-danger",
                "Authentication failed: Please check your credentials and try again."
              );
            } else {
              this.snackbar.showNotification("snackbar-danger", err.message);
            }

            this.loading = false;
          },
          complete: () => {},
        }),
        Subscription;
    }
  }
}
