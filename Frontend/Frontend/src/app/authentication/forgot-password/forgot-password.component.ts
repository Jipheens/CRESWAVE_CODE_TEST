import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Subject, takeUntil, Subscription } from "rxjs";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;

  loading = false;
  error = "";
  hide = true;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackbar: SnackbarService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      emailAddress: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.authForm.controls;
  }
  // onSubmit() {
  //   this.submitted = true;
  //   // stop here if form is invalid
  //   if (this.authForm.invalid) {
  //     return;
  //   } else {
  //     this.router.navigate(["/dashboard/main"]);
  //   }
  // }

  // onSubmit() {
  //   this.submitted = true;
  //   this.loading = true;
  //   this.error = "";
  //   if (this.authForm.invalid) {
  //     this.error = "Email not valid !";
  //     return;
  //   } else {
  //     console.log(this.authForm.value);

  //   }
  // }

  destroy$: Subject<boolean> = new Subject<boolean>();

  downloadLoading: boolean = false;

  onSubmit() {
    localStorage.clear();

    this.submitted = true;
    this.loading = true;
    this.error = "";
    if (this.authForm.valid) {
      this.authService
        .forgotPassword(this.authForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log("res: ", res);

            if (res.statusCode == 200) {
              this.snackbar.showNotification("snackbar-success", res.message);
              this.router.navigate(["/authentication/signin"]);
            } else {
              this.snackbar.showNotification("snackbar-danger", res.message);
            }

            this.loading = false;
          },
          error: (err) => {
            console.log("err::: ", err);
            if (err.status === 401) {
              this.snackbar.showNotification(
                "snackbar-danger",
                "Failed: Please check your email and try again."
              );
            } else {
              this.snackbar.showNotification("snackbar-danger", err.message);
            }

            this.loading = false;
          },
          complete: () => {},
        }),
        Subscription;

      console.log(this.authForm.value);
    }
  }
}
