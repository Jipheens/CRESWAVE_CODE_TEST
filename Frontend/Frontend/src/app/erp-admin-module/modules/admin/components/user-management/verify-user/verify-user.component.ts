import { Component, OnInit, ViewChild } from "@angular/core";
import { ValidationDialogComponent } from "../validation-dialog/validation-dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Observable, Subject, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AccessControlService } from "src/app/admin/data/services/_AccessControlService.service";
import { UsersManagementService } from "src/app/erp-admin-module/data/services/user-management.service";
import { RolesLookupComponent } from "../../role-management/roles-lookup/roles-lookup.component";

@Component({
  selector: "app-verify-user",
  templateUrl: "./verify-user.component.html",
  styleUrls: ["./verify-user.component.scss"],
})
export class VerifyUserComponent implements OnInit {
  displayedColumns: string[] = ["id", "role", "actions"];

  dataSourceRole: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorRole!: MatPaginator;
  @ViewChild(MatSort) sortRole!: MatSort;

  showForm: boolean = false;
  userForm!: FormGroup;
  // create roleForm and rolesArray to update roles in userForm
  roleForm!: FormGroup;
  rolesArray: any[] = [];
  showRoleForm: boolean = false;
  editButton: boolean = false;
  addButton: boolean = true;
  index: number;

  currentUser: any;
  formData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  downloadLoading: boolean = false;
  id: any;
  hideSubmit = false;
  hideApprovals = false;

  constructor(
    private tokenStorageCookieService: TokenCookieService,
    private fb: FormBuilder,
    private router: Router,
    private accessControlService: AccessControlService,
    private usersManagementService: UsersManagementService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.currentUser = this.tokenStorageCookieService.getUser().username;
    console.log("this.currentUser :", this.currentUser);
  }

  ngOnInit(): void {
    this.showForm = true;
    this.showRoleForm = true;

    this.route.queryParams.subscribe((params) => {
      console.log("Params:::", params);

      this.id = params["id"];
      const serializedData = params["additionalData"];
      const additionalData = JSON.parse(serializedData);

      this.formData = additionalData;

      this.rolesArray = this.formData.roles;
      this.populateRoleTable();

      this.getPage();
      this.initRoleForm();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  initRoleForm() {
    this.roleForm = this.fb.group({
      id: [""],
      name: [""],
    });
  }

  getPage(): void {
    this.userForm = this.fb.group({
      sn: [this.formData.sn, Validators.required],
      username: [this.formData.username, Validators.required],
      firstName: [this.formData.firstName, Validators.required],
      lastName: [this.formData.lastName, Validators.required],
      phoneNo: [this.formData.phoneNo, Validators.required],
      email: [this.formData.email, [Validators.required, Validators.email]],
      roles: [this.formData.roles],
    });
    console.log("this.userForm:::::", this.userForm.value);
  }

  // add role to rolesArray
  addRole() {
    if (this.roleForm.valid) {
      this.rolesArray.push(this.roleForm.value);
    }
    this.updateRoles();
  }

  // update roles field in userForm
  updateRoles() {
    this.userForm.patchValue({
      roles: this.rolesArray,
    });

    this.populateRoleTable();
    this.initRoleForm();
  }

  // populate role table
  populateRoleTable() {
    this.dataSourceRole = new MatTableDataSource(this.rolesArray);
    this.dataSourceRole.paginator = this.paginatorRole;
    this.dataSourceRole.sort = this.sortRole;
  }

  // edit role selected from table
  editRoleForm(data: any) {
    this.index = this.rolesArray.indexOf(data);
    this.editButton = true;
    this.addButton = false;
    this.roleForm.patchValue({
      id: data.id,
      name: data.name,
    });
  }

  // update the role that was edited to table
  updateRoleToTable() {
    this.editButton = false;
    this.addButton = true;

    this.rolesArray[this.index] = this.roleForm.value;
    this.userForm.patchValue({
      roles: this.rolesArray,
    });
    this.populateRoleTable();
    this.initRoleForm();
  }

  // delete role
  deleteRole(data: any) {
    let deleteIndex = this.rolesArray.indexOf(data);
    this.rolesArray.splice(deleteIndex, 1);
    this.populateRoleTable();
  }

  // Role lookup
  roleIsSelected = false;
  rolesLookup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "700px";
    dialogConfig.data = {
      action: "single role",
    };

    const dialogRef = this.dialog.open(RolesLookupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data.length != 0) {
        console.log("result: ", result.data);
        this.roleIsSelected = true;
        this.roleForm.patchValue({
          id: result.data[0].id,
          name: result.data[0].name,
        });
      }
    });
  }

  // ****************************************************************************************************************************
  //cancel button function
  cancel(): void {
    this.router.navigate(["/erp-admin-module/admin/all-users"]);
  }

  hasAccess: boolean;
  onValidate() {
    // let privilege = "Receivable Payment Validation";
    // this.hasAccess = this.accessControlService.hasPrivilege("FinanceModule", [
    //   privilege,
    // ]);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";
    dialogConfig.data = {
      data: [this.formData],
    };
    const dialogRef = this.dialog.open(ValidationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(["/erp-admin-module/admin/all-users"]);
    });
  }
}
