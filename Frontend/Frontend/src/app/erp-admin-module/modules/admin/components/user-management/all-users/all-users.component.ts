import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subject, Subscription, takeUntil } from "rxjs";
import { UsersManagementService } from "src/app/erp-admin-module/data/services/user-management.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-all-users",
  templateUrl: "./all-users.component.html",
  styleUrls: ["./all-users.component.scss"],
})
export class AllUsersComponent implements OnInit {
  displayedColumns: string[] = [
    "select",
    "sn",
    "username",
    "firstName",
    "lastName",
    "email",
    "phoneNumber",
    "status",
    "role",
    "actions",
  ];

  //binding the columns to a table
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  subscription!: Subscription;
  selection = new SelectionModel<any>(true, []);

  data: any;
  error: any;
  formData: any;
  isLoading = true;
  pageFunction = "ADD";
  destroy$: Subject<boolean> = new Subject<boolean>();
  downloadLoading: boolean = false;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private usersManagementService: UsersManagementService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  // data filtering
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getData() {
    this.usersManagementService
      .fetchAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res.statusCode === 302) {
            this.data = res.entity;
            console.log("this.data :", this.data);
            this.snackbarService.showNotification(
              "snackbar-success",
              res.message
            );
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            this.snackbarService.showNotification(
              "snackbar-danger",
              res.message
            );
          }
        },
        error: (err) => {
          this.snackbarService.showNotification("snackbar-danger", err.message);
        },
        complete: () => {
          this.selection = new SelectionModel<any>(true, []);
        },
      });
    Subscription;
  }

  refresh() {
    this.getData();
  }

  //Select
  selectedRows: any[] = [];
  atleastOneSelected: boolean = false;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? "deselect" : "select"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1
      }`;
  }

  expSelected() {
    this.atleastOneSelected = true;
    this.selectedRows = this.selection.selected;

    console.log("this.selectedRows: ", this.selectedRows);
  }

  // add user
  addUser() {
    this.router.navigate(["/erp-admin-module/admin/manage-users"]);
  }

  // edit user details
  editUser(data: any) {
    const additionalData = data;
    const serializedData = JSON.stringify(additionalData);
    let route = "/erp-admin-module/admin/manage-users";
    this.router.navigate([route], {
      queryParams: {
        id: data.sn,
        additionalData: serializedData,
        action: "Update",
      },
    });
  }

  //View user details
  viewUser(data: any) {
    const additionalData = data;
    const serializedData = JSON.stringify(additionalData);
    let route = "/erp-admin-module/admin/manage-users";
    this.router.navigate([route], {
      queryParams: {
        id: data.sn,
        additionalData: serializedData,
        action: "View",
      },
    });
  }

  // verify user
  validateUser(data: any) {
    const additionalData = data;
    const serializedData = JSON.stringify(additionalData);

    let route = "/erp-admin-module/admin/verify-user";
    this.router.navigate([route], {
      queryParams: {
        id: data.sn,
        additionalData: serializedData,
        action: "Verify",
      },
    });
  }

  // lock or unlock account
  lockOrUnlockAccount(row) {
    let action = "";
    let parameter = "";

    console.log("row.isAcctActive:: ", row.isAcctActive);

    if (row.isAcctActive === "Y") {
      action = "Lock";
      parameter = "Lock";
    } else if (row.isAcctActive === "N") {
      action = "UnLock";
      parameter = "Restore";
    }

    Swal.fire({
      title: "Are you sure?",
      text: "This account will be " + action + "ed!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, " + action + " this account",
    }).then((result) => {
      if (result.isConfirmed) {
        const params = { sn: row.sn, action: parameter };
        this.usersManagementService
          .accountLockUnlock(params)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              console.log("res: ", res);
              if (
                res.statusCode === 201 ||
                res.statusCode === 200 ||
                res.statusCode === 302
              ) {
                this.snackbarService.showNotification(
                  "snackbar-success",
                  res.message
                );
              } else {
                this.snackbarService.showNotification(
                  "snackbar-danger",
                  res.message
                );
              }
            },
            error: (err) => {
              this.snackbarService.showNotification(
                "snackbar-danger",
                err.message
              );
            },
            complete: () => {
              this.getData();
            },
          });
      }
    });
  }

  // delete user
  deleteUser(sn: any) {
    Swal.fire({
      title: "Are you Sure?",
      text: "This User will be deleted!!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete this User ",
    }).then((result) => {
      if (result.isConfirmed) {
        let params = { sn: sn };
        this.usersManagementService
          .deleteUser(params)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              console.log("res: ", res);
              if (res.statusCode == 201 || 200 || 302) {
                this.snackbarService.showNotification(
                  "snackbar-success",
                  res.message
                );
              } else {
                this.snackbarService.showNotification(
                  "snackbar-danger",
                  res.message
                );
              }
            },
            error: (err) => {
              this.snackbarService.showNotification(
                "snackbar-danger",
                err.message
              );
            },
            complete: () => {
              this.getData();
            },
          }),
          Subscription;
      }
    });
  }
}
