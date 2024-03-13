import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AdminAuthService } from "src/app/erp-admin-module/data/services/adminAuth.service";
import { RolesService } from "src/app/erp-admin-module/data/services/roleService.service";
import { UsersManagementService } from "src/app/erp-admin-module/data/services/user-management.service";

@Component({
  selector: "app-gen-widgets",
  templateUrl: "./gen-widgets.component.html",
  styleUrls: ["./gen-widgets.component.scss"],
})
export class GenWidgetsComponent implements OnInit {
  data: any;
  subscription!: Subscription;

  rolesCount: number = 0;
  pendingUsersCount: number = 0;
  approvedUsersCount: number = 0;
  loginSessionsCount: number = 0;

  constructor(
    private router: Router,
    private usersManagementService: UsersManagementService,
    private rolesService: RolesService,
    private adminAuthService: AdminAuthService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.getPendingUsers();
    this.getApprovedUsers();
    this.getLoginSessions();
  }

  navigateToRoles(): void {
    this.router.navigate(["erp-admin-module/admin/all-roles"]);
  }

  navigateToPendingUsers(): void {
    this.router.navigate(["erp-admin/admin/all-users"]);
  }

  navigateToApprovedUsers(): void {
    this.router.navigate(["erp-admin/admin/all-users"]);
  }

  navigateToLoginSessions(): void {
    this.router.navigate(["/erp-admin/admin/login-session"]);
  }

  getRoles() {
    this.subscription = this.rolesService.getRoles().subscribe((res) => {
      if (res) {
        this.rolesCount = res.length;
        console.log("Roles count:", this.rolesCount);
      }
    });
  }

  getPendingUsers() {
    let params = {
      status: "PENDING",
    };
    this.subscription = this.usersManagementService
      .getUsersByStatus(params)
      .subscribe((res) => {
        if (res.entity) {
          this.pendingUsersCount = res.entity.length;
        }
      });
  }

  getApprovedUsers() {
    let params = {
      status: "APPROVED",
    };
    this.subscription = this.usersManagementService
      .getUsersByStatus(params)
      .subscribe((res) => {
        if (res.entity) {
          this.approvedUsersCount = res.entity.length;
        }
      });
  }

  loginTime: any;
  getLoginSessions() {
    this.loginTime = new Date();
    this.loginTime = this.datePipe.transform(this.loginTime, "yyyy-MM-dd");

    let params = new HttpParams().set("date", this.loginTime);
    this.adminAuthService.activeSessions(params).subscribe((res) => {
      this.data = res;
      if (this.data.entity) {
        this.loginSessionsCount = this.data.entity.length;
      }
    });
  }
}
