import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { TokenCookieService } from "src/app/core/service/token-storage-cookies.service";

@Injectable({
  providedIn: "root",
})
export class AccessControlService {
  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  currentUser: any;
  myPrivileges: any;

  constructor(
    private _snackBar: MatSnackBar,
    private tokenCookieService: TokenCookieService
  ) {
    this.currentUser = this.tokenCookieService.getUser();

    console.log("this.currentUser.id: From AccessControl Service: ", this.currentUser)

    // this.myPrivileges = JSON.parse(
    //   localStorage.getItem(`userPrivileges_${this.currentUser.id}`) || "{}"
    // );
  }


  hasPrivilege(clientName: string, requiredPrivileges: string[]): boolean {
    const client = this.currentUser?.role.clients.find((element) => element.name === clientName);
  
    if (!client) {
      return false;
    }
  
    let hasAccess = false;
    requiredPrivileges.forEach((privilege) => {
      if (client.privileges.indexOf(privilege) !== -1) {
        hasAccess = true;
      }
    });
  
    if (!hasAccess) {
      this._snackBar.open(
        "You do not have the necessary permissions to access this resource!",
        "X",
        {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 20000,
          panelClass: ["snackbar-danger"],
        }
      );
    }
  
    return hasAccess;
  }
  

  // hasPrivilege(requiredPrivileges: string[]): boolean {
  //   let hasAccess = false;
  //   requiredPrivileges.forEach((privilege) => {
  //     if (this.myPrivileges.indexOf(privilege) !== -1) {
  //       hasAccess = true;
  //     }
  //   });

  //   if (!hasAccess) {
  //     this._snackBar.open(
  //       "You do not have the necessary permissions to access this resource!",
  //       "X",
  //       {
  //         horizontalPosition: this.horizontalPosition,
  //         verticalPosition: this.verticalPosition,
  //         duration: 20000,
  //         panelClass: ["snackbar-danger"],
  //       }
  //     );
  //   }

  //   return hasAccess;
  // }

  hasThisPrivilege(requiredPrivileges: string[]): boolean {
    let hasAccess = false;
    requiredPrivileges.forEach((privilege) => {
      if (this.myPrivileges.indexOf(privilege) !== -1) {
        hasAccess = true;
      }
    });

    return hasAccess;
  }
}

