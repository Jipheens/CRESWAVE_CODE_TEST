import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  openSnackBar: any;

  constructor(private snackBar: MatSnackBar) { }

  showNotification(colorName, text) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: colorName,
    });
  }
}
