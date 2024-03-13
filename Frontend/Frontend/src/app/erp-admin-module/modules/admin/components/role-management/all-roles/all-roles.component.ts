import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subject, Subscription, takeUntil } from "rxjs";
import { RolesService } from "src/app/erp-admin-module/data/services/roleService.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-all-roles",
  templateUrl: "./all-roles.component.html",
  styleUrls: ["./all-roles.component.scss"],
})
export class AllRolesComponent implements OnInit {
  displayedColumns: string[] = ["select", "id", "name", "action"];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  selection = new SelectionModel<any>(true, []);
  data: any;
  error: any;
  isLoading = true;
  pageFunction = "Update";
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
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

  getData() {
    this.rolesService
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res) {
            this.data = res;
            this.isLoading = false;
            console.log("this.data :", this.data);
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
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

  refresh() {
    this.getData();
  }

  //add role
  addRole() {
    this.router.navigate(["/erp-admin-module/admin/manage-roles"]);
  }

  // update role
  editRole(data: any) {
    const additionalData = data;
    const serializedData = JSON.stringify(additionalData);
    let route = "/erp-admin-module/admin/manage-roles";
    this.router.navigate([route], {
      queryParams: {
        id: data.id,
        additionalData: serializedData,
        action: "Update",
      },
    });
  }

  // view role
  viewRole(data: any) {
    const additionalData = data;
    const serializedData = JSON.stringify(additionalData);
    let route = "/erp-admin-module/admin/manage-roles";
    this.router.navigate([route], {
      queryParams: {
        id: data.id,
        additionalData: serializedData,
        action: "View",
      },
    });
  }

  // validate role
  validateAsset(data: any) {
    const additionalData = data;
    const serializedData = JSON.stringify(additionalData);

    let route = "/erp-admin-module/admin/manage-roles";
    this.router.navigate([route], {
      queryParams: {
        id: data.id,
        additionalData: serializedData,
        action: "Verify",
      },
    });
  }

  // delete role
  deleteRole(id: any) {
    Swal.fire({
      title: "Are you Sure?",
      text: "This Role will be deleted!!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes, Delete this Role ",
    }).then((result) => {
      if (result.isConfirmed) {
        let params = { id: id };
        this.rolesService
          .deleteRoleTemporarily(params)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              console.log("res: ", res);
              if (res.statusCode == 201 || 200 || 302) {
                this.snackbar.showNotification("snackbar-success", res.message);
              } else {
                this.snackbar.showNotification("snackbar-danger", res.message);
              }
            },
            error: (err) => {
              this.snackbar.showNotification("snackbar-danger", err.message);
            },
            complete: () => {
              this.getData();
            },
          }),
          Subscription;
      }
    });
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
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.position + 1
    }`;
  }

  expSelected() {
    this.atleastOneSelected = true;
    this.selectedRows = this.selection.selected;

    console.log("this.selectedRows: ", this.selectedRows);
  }
}
