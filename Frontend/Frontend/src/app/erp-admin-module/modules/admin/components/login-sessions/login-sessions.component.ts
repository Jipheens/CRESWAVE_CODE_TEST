import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NotificationService } from "src/app/core/service/notification.service";
import { AdminAuthService } from "src/app/erp-admin-module/data/services/adminAuth.service";

@Component({
  selector: "app-login-sessions",
  templateUrl: "./login-sessions.component.html",
  styleUrls: ["./login-sessions.component.sass"],
})
export class LoginSessionsComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "username",
    "isActive",
    "activity",
    "loginTime",
    "logoutTime",
    "address",
    "os",
    "browser",
    "status",
    "action",
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isLoading: boolean;
  data: any;
  dataRes: any;
  dialogConfig: any;
  loginTime: any;

  downloadLoading: boolean = false;

  constructor(
    private datePipe: DatePipe,
    private notificationAPI: NotificationService,
    private adminAuthService: AdminAuthService
  ) {
    this.getData();
  }
  ngOnDestroy(): void {}
  ngOnInit() {
    this.loginTime = new Date();
  }

  refresh() {
    this.getData();
  }
  getData() {
    console.log(new Date());
    this.loginTime = new Date();
    console.log(this.loginTime);
    this.loginTime = this.datePipe.transform(this.loginTime, "yyyy-MM-dd");
    console.log(this.loginTime);
    let params = new HttpParams().set("date", this.loginTime);
    this.isLoading = true;
    this.adminAuthService.activeSessions(params).subscribe(
      (res) => {
        console.log(res);
        this.dataRes = res;
        this.isLoading = false;
        this.dataRes = this.dataRes.entity;
        this.dataSource = new MatTableDataSource(this.dataRes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        this.notificationAPI.alertWarning(err);
        this.isLoading = false;
      }
    );
  }
  signOut(e: any) {
    let params = new HttpParams().set("refreshToken", e);
    this.adminAuthService.signOut(params).subscribe((res) => {
      this.notificationAPI.alertSuccess("Sign out successfully");
      this.getData();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
