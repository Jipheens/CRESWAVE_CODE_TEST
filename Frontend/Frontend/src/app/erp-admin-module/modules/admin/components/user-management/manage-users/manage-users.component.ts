import { HttpParams } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscription, takeUntil } from "rxjs";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";
import { UsersManagementService } from "src/app/erp-admin-module/data/services/user-management.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import * as XLSX from "xlsx";
import { RolesLookupComponent } from "../../role-management/roles-lookup/roles-lookup.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-manage-users",
  templateUrl: "./manage-users.component.html",
  styleUrls: ["./manage-users.component.scss"],
})
export class ManageUsersComponent implements OnInit {
  displayedColumns: string[] = ["id", "role", "actions"];

  dataSourceRole: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginatorRole!: MatPaginator;
  @ViewChild(MatSort) sortRole!: MatSort;

  showForm: boolean = false;
  pageFunction = "Add";
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
    private usersManagementService: UsersManagementService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.currentUser = this.tokenStorageCookieService.getUser().username;
    console.log("this.currentUser :", this.currentUser);
  }

  ngOnInit(): void {
    this.getPage();
    this.initRoleForm();
    this.showForm = true;
    this.showRoleForm = true;

    this.route.queryParams.subscribe((params) => {
      console.log("Params:", params);

      if (params.hasOwnProperty("id")) {
        const action = params["action"];
        if (action == "Update") {
          this.pageFunction = "Update";
        } else if (action == "View") {
          this.pageFunction = "View";
        } else if (action == "Verify") {
          this.pageFunction = "Verify";
        }

        this.id = params["id"];
        const serializedData = params["additionalData"];
        const additionalData = JSON.parse(serializedData);

        this.formData = additionalData;

        this.rolesArray = this.formData.roles;
        this.populateRoleTable();

        this.getPage();
        this.initRoleForm();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getPage(): void {
    console.log("FormData:", this.formData);
    if (this.pageFunction === "Add") {
      this.generateForm();
      this.hideApprovals = true;
    } else if (this.pageFunction === "Update") {
      this.generateFormWithData();
      this.hideApprovals = true;
    } else if (this.pageFunction === "View") {
      this.generateDisabledFormWithData();
      this.hideSubmit = true;
      this.hideApprovals = true;
    } else if (this.pageFunction === "Verify") {
      this.generateDisabledFormWithData();
      this.hideSubmit = true;
      this.hideApprovals = false;
    }
  }

  generateForm(): void {
    this.userForm = this.fb.group({
      sn: [""],
      username: ["", Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      phoneNo: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      roles: [[]],
    });
  }

  // initialize roleForm
  initRoleForm() {
    this.roleForm = this.fb.group({
      id: [""],
      name: [""],
    });
  }

  generateFormWithData(): void {
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

  generateDisabledFormWithData(): void {
    this.userForm = this.fb.group({
      sn: [{ value: this.formData.sn, disabled: true }, Validators.required],
      username: [
        { value: this.formData.username, disabled: true },
        Validators.required,
      ],
      firstName: [
        { value: this.formData.firstName, disabled: true },
        Validators.required,
      ],
      lastName: [
        { value: this.formData.lastName, disabled: true },
        Validators.required,
      ],
      phoneNo: [
        { value: this.formData.phoneNo, disabled: true },
        Validators.required,
      ],
      email: [
        { value: this.formData.email, disabled: true },
        [Validators.required, Validators.email],
      ],
      roles: [{ value: this.formData.roles }],
    });
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

  //Import from Excel
  @ViewChild("fileInput") fileInput: any;

  items: any[] = []; // Array to store
  itemsForm: FormGroup;
  itemErrors: { [key: string]: string }[] = [];

  handleFileInput(files: FileList) {
    const file = files.item(0);

    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        this.items = jsonData;

        console.log(" this.items :", this.items);

        // Initialize the form
        this.itemsForm = this.fb.group({
          items: this.fb.array([]), // Array of items
        });

        // Call the function to validate the items
        this.validateItems();
      };

      fileReader.readAsArrayBuffer(file);
    }
  }

  validateItems() {
    this.itemErrors = [];
    const items = this.items;

    const itemsFormArray = this.itemsForm.get("items") as FormArray;

    for (const item of items) {
      const formGroup = this.fb.group({
        username: [item.username, [Validators.required]],
        firstName: [item.firstName, [Validators.required]],
        lastName: [item.lastName, [Validators.required]],
        email: [item.email, [Validators.required, Validators.email]],
        phoneNo: [item.phoneNo, [Validators.required]],
      });

      itemsFormArray.push(formGroup);
      this.collectErrors(formGroup);

      if (formGroup.valid) {
      }
    }
  }

  collectErrors(control: AbstractControl, path: string = "") {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((key) => {
        const subControl = control.get(key);
        const subPath = this.getErrorPath(path, key);
        this.collectErrors(subControl, subPath);
      });
    } else {
      const errors = control.errors;
      if (errors) {
        const itemError = {
          field: path,
          message: this.getErrorMessage(errors),
        };
        this.itemErrors.push(itemError);
      }
    }
  }

  getErrorPath(path: string, key: string): string {
    return path ? `${path}.${key}` : key;
  }

  getErrorMessage(errors: any): string {
    if (errors.required) {
      return "This field is required.";
    } else if (errors.pattern) {
      return "Invalid value.";
    }
    return "";
  }

  private readonly templateFilename = "UserManagement.xlsx";

  downloadTemplate() {
    const link = document.createElement("a");
    link.setAttribute("type", "hidden");
    link.href = `/assets/templates/${this.templateFilename}`;
    link.download = this.templateFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  //******************************************************************************************************************************** */
  cancel(): void {
    this.router.navigate(["/erp-admin-module/admin/all-users"]);
  }

  posting: boolean = false;
  submit() {
    console.log("Data submitted: ", this.userForm.value);
    this.posting = true;
    if (this.pageFunction === "Add") {
      this.usersManagementService
        .addUser(this.userForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log("res:: ", res);

            if (res.entity) {
              this.snackbar.showNotification("snackbar-success", res.message);
              this.router.navigate(["/erp-admin/admin/all-users"]);
            } else {
              this.snackbar.showNotification("snackbar-danger", res.message);
            }
          },
          error: (err) => {
            this.snackbar.showNotification("snackbar-danger", err.message);
          },
          complete: () => {
            this.posting = false;
          },
        }),
        Subscription;
    } else if (this.pageFunction === "Update") {
      this.usersManagementService
        .updateUser(this.userForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res) {
              this.snackbar.showNotification("snackbar-success", res.message);
              this.router.navigate(["/erp-admin/admin/all-users"]);
            } else {
              this.snackbar.showNotification("snackbar-danger", res.message);
            }
          },
          error: (err) => {
            this.snackbar.showNotification("snackbar-danger", err.message);
          },
          complete: () => {
            this.posting = false;
          },
        }),
        Subscription;
    }
  }

  //Uploading a batch of items
  submitBatch() {
    this.posting = true;
    if (this.pageFunction === "Add") {
      this.usersManagementService
        .uploadBatchUsers(this.items)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.statusCode == 201 || 200 || 302) {
              this.snackbar.showNotification("snackbar-success", res.message);
              this.router.navigate([
                "/erp-finance/finance-parameters/all-CCentres",
              ]);
            } else {
              this.snackbar.showNotification("snackbar-danger", res.message);
            }
          },
          error: (err) => {
            this.snackbar.showNotification("snackbar-danger", err.message);
          },
          complete: () => {
            this.posting = false;
          },
        }),
        Subscription;
    }
  }
}
