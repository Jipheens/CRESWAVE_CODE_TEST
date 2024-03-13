import { Component, OnInit } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-base",
  templateUrl: "./base.component.html",
  styleUrls: ["./base.component.sass"],
})
export class BaseComponent implements OnInit {
  subject = new Subject<void>();

  constructor() {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
