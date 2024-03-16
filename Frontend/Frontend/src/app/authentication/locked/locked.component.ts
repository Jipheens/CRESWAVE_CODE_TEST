import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/core/service/auth.service";
import { Role } from "src/app/core/models/role";
@Component({
  selector: "app-locked",
  templateUrl: "./locked.component.html",
  styleUrls: ["./locked.component.scss"],
})
export class LockedComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  userImg: string;
  userFullName: string;
  hide = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      password: ["", Validators.required],
    });

    // this.userImg = this.authService.currentUserValue.img;
    // this.userFullName =
    //   this.authService.currentUserValue.firstName +
    //   " " +
    //   this.authService.currentUserValue.lastName;
    this.userImg =
      "https://w1.pngwing.com/pngs/386/684/png-transparent-face-icon-user-icon-design-user-profile-share-icon-avatar-black-and-white-silhouette.png";
    this.userFullName = "John" + "Doe";
  }
  get f() {
    return this.authForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.authForm.invalid) {
      return;
    } else {
      // const role = "Admin";
      // if (role === Role.All || role === Role.Admin) {
      //   this.router.navigate(["/admin/dashboard/main"]);
      // } else if (role === Role.Employee) {
      //   this.router.navigate(["/employee/dashboard"]);
      // } else if (role === Role.Client) {
      //   this.router.navigate(["/client/dashboard"]);
      // } else {
      //   this.router.navigate(["/authentication/signin"]);
      // }
    }
  }
}
