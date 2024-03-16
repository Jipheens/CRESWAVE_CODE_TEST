import { SelectionModel } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription, Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserManagementService } from 'src/app/user-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {

  displayedColumns: string[] = [
    "select",
    "sn",
    "username",
    "email",
    "phoneNo",
    "createdOn",
    "verifiedOn",
    "approvedTime",
    "status",
    "action",
  ];

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
  pageFunction = "Update";
  destroy$: Subject<boolean> = new Subject<boolean>();

  downloadLoading: boolean = false;

  Form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackbar: SnackbarService,
    private userService: UserManagementService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.Form = this.fb.group({
      status: ["PENDING", Validators.required],
    });

    this.getData();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  reqStatuses: any[] = [
    { name: "PENDING" },
    { name: "VERIFIED" },
    { name: "APPROVED" },
    { name: "RETURNED" },
    { name: "REJECTED" },
  ];

  selectedStatus: string = "PENDING";
  getSelectSelectedStatus() {
    this.getData();
  }
  getSelectedStatus(status: any) {
    this.Form.patchValue({
      status: status,
    });

    this.getData();
  }

  getData() {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = true;
    this.selectedStatus = this.Form.value.status;
    const params = new HttpParams().set("status", this.Form.value.status);
    console.log("your passed param",params)
    this.userService
      .getUsersByStatus(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log("this.data before setting datasource:", res);
          if (res.statusCode === 200) {
            this.snackbar.showNotification("snackbar-success", res.message);
            this.data = res;
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(this.data.entity);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            console.log("this.data :", this.data);
          } else {
            this.snackbar.showNotification("snackbar-danger", res.message);
          }
        },
        error: (err) => {
          this.snackbar.showNotification("snackbar-danger", err.message);
        },
        complete: () => {
          this.selection = new SelectionModel<any>(true, []);
        },
      }),
      Subscription;
  }

  addSupplier() {
    this.router.navigate([
      "/erp-suppliers-management/suppliers-maintenance/manage-supplier",
    ]);
  }

  refresh() {
    this.getData();
  }

  editSupplier(data: any) {
    const additionalData = data;
    const serializedData = JSON.stringify(additionalData);

    let route =
      "/erp-suppliers-management/suppliers-maintenance/manage-supplier";
    this.router.navigate([route], {
      queryParams: { id: data.id, action: "Update" },
    });
  }
  viewSupplier(data: any) {
    const additionalData = data;
    const serializedData = JSON.stringify(additionalData);
    let route =
      "/erp-suppliers-management/suppliers-maintenance/manage-supplier";
    this.router.navigate([route], {
      queryParams: { id: data.id, action: "View" },
    });
  }

  deleteUser(sn: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this User?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete User!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUserTemporarily(sn)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              this.snackbar.showNotification("snackbar-success", res.message);
              this.getData(); // Refresh the data after successful deletion
            },
            error: (err) => {
              this.snackbar.showNotification("snackbar-danger", err.message);
            }
          });
      }
    });
  }
  

  //******************************************************************************************************
  //Select Suppliers
  supplierDetails: any;
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

  processMultipleRows(status: any) {
    this.isLoading = true;

    const processedRows = this.selectedRows.map((element) => {
      return {
        sn: element.sn,
        status: status,
        remarks:"OK",
      };
    });

    console.log("LOG: ", processedRows);

    this.userService
      .validateUser(processedRows)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log("res: ", res);
          if (res.entity) {
            this.snackbar.showNotification("snackbar-success", res.message);

            this.selection = new SelectionModel<any>(true, []);
          } else {
            this.snackbar.showNotification("snackbar-danger", res.message);
          }
        },
        error: (err) => {
          this.snackbar.showNotification("snackbar-danger", err.message);
        },
        complete: () => {
          this.isLoading = false;

          this.getData();
        },
      }),
      Subscription;
  }
  //*************************************************************************************************************** */


}