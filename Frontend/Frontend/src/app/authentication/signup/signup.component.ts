import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";

import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AuthService } from "src/app/core/service/auth.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  error = "";
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  hide = true;
  chide = true;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public snackbar: SnackbarService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      email: [
        "",
        [Validators.required, Validators.email, Validators.minLength(5)],
      ],
      phoneNo: ["", Validators.required],
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
      role: [['defaultRole'], Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    console.log("sign up data",this.authForm.value)
    this.submitted = true;
    if (this.authForm.value.password !== this.authForm.value.confirmPassword) {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Passwords don't match, please check and retry!"
      );
    }
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      console.log("Signup details:", this.authForm.value);
      this.authService.signup(this.authForm.value).subscribe(
        (res) => {
          console.log("RES:", res);
          if (res.statusCode === 201) {
            this.snackbar.showNotification("snackbar-success", res.message);
            this.router.navigate(["/authentication/signin"]);
          } else {
            this.snackbar.showNotification("snackbar-success", res.message);
          }
        },
        (err) => {
          this.submitted = false;
          this.snackbar.showNotification("snackbar-danger", err.message);
        }
      );
    }
  }
}
