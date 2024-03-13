import { SelectionModel } from "@angular/cdk/collections";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatMenuTrigger } from "@angular/material/menu";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Subject, takeUntil, Subscription } from "rxjs";
import { RolesService } from "src/app/erp-admin-module/data/services/roleService.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";

@Component({
  selector: "app-roles-lookup",
  templateUrl: "./roles-lookup.component.html",
  styleUrls: ["./roles-lookup.component.sass"],
})
export class RolesLookupComponent implements OnInit {
  displayedColumns: string[] = ["select", "id", "name"];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  contextMenu: MatMenuTrigger;

  selection = new SelectionModel<any>(true, []);

  rolesDetails: any;

  dataSourceFilteredList: any[] = [];
  rolesArray: any[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();

  downloadLoading: boolean = false;

  isLoading: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<RolesLookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.selection = new SelectionModel<any>(true, []);
    this.getData();
  }
  ngAfterViewInit() {
    console.log("Finally: ", this.dataSourceFilteredList);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  filter() {
    //let storeId = [1, 2, 3];
    this.dataSource.data.forEach((element) => {
      this.rolesArray.forEach((item) => {
        if (item === element.id) {
          // this.dataSourceFilteredList.push(this.dataSource.data.indexOf(element));
          this.selection.select(element);
        }
      });
    });

    console.log("dataSourceFilteredList ", this.dataSourceFilteredList);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //******************************************************************************************************
  //Select cost centre

  //Select GL Accounts
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
  proceed() {
    this.dialogRef.close({ event: "close", data: this.selectedRows });

    //   console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close({ event: "close", data: this.selectedRows });
  }
  public confirmAdd(): void {}

  getData() {
    this.rolesService
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log("res: ", res);
          if (res.statusCode == 201 || 200 || 302) {
            this.data = res;
            this.dataSource = new MatTableDataSource<any>(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }

          this.isLoading = false;
        },
        error: (err) => {
          this.snackbar.showNotification("snackbar-danger", err.message);
        },
        complete: () => {},
      }),
      Subscription;
  }
}
