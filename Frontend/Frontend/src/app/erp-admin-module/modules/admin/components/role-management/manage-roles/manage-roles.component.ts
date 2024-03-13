import { HttpParams } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, Subscription, takeUntil } from "rxjs";
import { TokenStorageService } from "src/app/core/service/token-storage.service";
import { RolesService } from "src/app/erp-admin-module/data/services/roleService.service";
import { SnackbarService } from "src/app/shared/services/snackbar.service";
import * as XLSX from "xlsx";

@Component({
  selector: "app-manage-roles",
  templateUrl: "./manage-roles.component.html",
  styleUrls: ["./manage-roles.component.sass"],
})
export class ManageRolesComponent implements OnInit {
  showForm = false;
  pageFunction = "Add";
  roleForm!: FormGroup;
  currentUser: any;
  formData: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  id: any;
  hideSubmit = false;
  hideApprovals = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private rolesService: RolesService
  ) {
    this.currentUser = this.tokenStorageService.getUser().username;
    console.log("this.currentUser :", this.currentUser);
  }

  ngOnInit(): void {
    this.getPage();
    this.showForm = true;

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

        this.getPage();
      }
    });
  }

  getPage(): void {
    console.log("FormData", this.formData);
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
    this.roleForm = this.fb.group({
      id: [""],
      name: ["", [Validators.required]],
    });
  }

  generateFormWithData(): void {
    this.roleForm = this.fb.group({
      id: [this.formData.id],
      name: [this.formData.name, [Validators.required]],
    });
  }

  generateDisabledFormWithData(): void {
    this.roleForm = this.fb.group({
      id: [{ value: this.formData.id, disabled: true }],
      name: [
        { value: this.formData.name, disabled: true },
        [Validators.required],
      ],
    });
  }

  //cancel button function
  cancel(): void {
    this.router.navigate(["/erp-admin-module/admin/all-roles"]);
  }

  // *************************************************************************************************************************************
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
        console.log("Excel data :", this.items);

        this.itemsForm = this.fb.group({
          items: this.fb.array([]), // Array of items
        });

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
        categoryName: [item.categoryName, [Validators.required]],
        remarks: [item.remarks, [Validators.required]],
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

  hasErrors(): boolean {
    return this.itemErrors && this.itemErrors.length > 0;
  }

  // download template
  private readonly templateFilename = "RolesTemplate.xlsx";

  downloadTemplate() {
    const link = document.createElement("a");
    link.setAttribute("type", "hidden");
    link.href = `/assets/templates/${this.templateFilename}`;
    link.download = this.templateFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ***************************************************************************************************************************
  // submit button function
  posting: boolean = false;
  submit() {
    console.log("data to be submitted: ", this.roleForm.value);
    this.posting = true;
    if (this.pageFunction === "Add") {
      this.rolesService
        .addRole(this.roleForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.statusCode === 201) {
              this.snackbar.showNotification("snackbar-success", res.message);
              this.router.navigate(["/erp-admin-module/admin/all-roles"]);
            } else {
              this.snackbar.showNotification("snackbar-danger", res.message);
            }
          },
          error: (err) => {
            this.snackbar.showNotification("snackbar-danger", err);
          },
          complete: () => {
            this.posting = false;
          },
        }),
        Subscription;
    } else if (this.pageFunction === "Update") {
      const params = new HttpParams().set("id", this.id);
      console.log("data to be updated: ", this.roleForm.value);
      this.rolesService
        .updateRole(this.roleForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            console.log("RESPONSE::::", res);

            if (res.statusCode === 200) {
              this.snackbar.showNotification("snackbar-success", res.message);
              this.router.navigate(["/erp-admin-module/admin/all-roles"]);
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

  // submit batch excel
  submitBatch() {
    this.posting = true;
    if (this.pageFunction === "Add") {
      this.rolesService
        .uploadBatchRoles(this.items)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.statusCode == 201 || 200 || 302) {
              this.snackbar.showNotification("snackbar-success", res.message);
              this.router.navigate(["/erp-admin-module/admin/all-roles"]);
            } else {
              this.snackbar.showNotification("snackbar-danger", res.message);
            }
          },
          error: (err) => {
            console.log("err :", err);
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
