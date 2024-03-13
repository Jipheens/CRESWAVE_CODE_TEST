import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-gen-widgets",
  templateUrl: "./gen-widgets.component.html",
  styleUrls: ["./gen-widgets.component.scss"],
})
export class GenWidgetsComponent implements OnInit {
  suppliersCount: number = 0;
  expenseCount: number = 0;
  costCentersCount: number = 0;
  usersCount: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getSuppliers();
    this.getExpenses();
    this.getCostCenters();
    this.getAllUsers();
  }

  suppliers() {
    this.router.navigateByUrl("/admin/supplier/suppliers-management/all");
  }
  expenses() {
    this.router.navigateByUrl("/admin/supplier/expenses-management/all");
  }
  costCenters() {
    this.router.navigateByUrl("/admin/supplier/cost-centers-management/all");
  }
  userManagement() {
    this.router.navigateByUrl("/admin/user-accounts/all");
  }

  getExpenses() {
    // this.expenseService.getExpenses
    // ()
    // .subscribe(
    //   (res) => {
    //     this.expenseCount = res.length;
    //   },
    //   (err) => {
    //     console.log(err);
    //   })
  }

  getSuppliers() {
    // this.supplierService
    //   .getSuppliers()
    //   .subscribe(
    //     (res) => {
    //       this.suppliersCount = res.length;
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }
  getCostCenters() {
    // this.costCenterService
    //   .getCostCenters()
    //   .subscribe(
    //     (res) => {
    //       this.costCentersCount = res.length;
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }
  getAllUsers() {
    // this.accountService
    //   .listActiveAccounts()
    //   .subscribe(
    //     (res) => {
    //       this.usersCount = res.length;
    //     },
    //     (err) => {
    //       console.log(err);
    //     }
    //   );
  }
}
