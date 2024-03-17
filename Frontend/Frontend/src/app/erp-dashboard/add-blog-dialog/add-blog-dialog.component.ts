// import { Component, Inject, OnInit, Optional } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { TokenCookieService } from 'src/app/core/service/token-storage-cookies.service';

// @Component({
//   selector: 'app-add-blog-dialog',
//   templateUrl: './add-blog-dialog.component.html',
//   styleUrls: ['./add-blog-dialog.component.sass']
// })
// export class AddBlogDialogComponent implements OnInit {
//   blogTitle: string;
//   blogType: string;
//   headline: string;
//   blogDescription: string;
//   author: string;
//   timestamp: string;

//   constructor(
//     private dialogRef: MatDialogRef<AddBlogDialogComponent>,
//     @Optional() @Inject(MAT_DIALOG_DATA) public existingBlogData: any,
//     private tokenCookieService: TokenCookieService
//   ) { }

//   ngOnInit(): void {
//     if (this.existingBlogData) {
//       this.blogTitle = this.existingBlogData.blogTitle;
//       this.blogType = this.existingBlogData.blogType;
//       this.headline = this.existingBlogData.headline;
//       this.blogDescription = this.existingBlogData.blogDescription;
//       this.author = this.existingBlogData.author;
//       this.timestamp = this.existingBlogData.timestamp;
//     } else {
//       this.author = this.tokenCookieService.getUser().username;
//       this.timestamp = new Date().toISOString();
//     }
//   }

//   onSubmitClick(): void {
//     const newBlog = {
//       blogTitle: this.blogTitle,
//       blogType: this.blogType,
//       headline: this.headline,
//       blogDescription: this.blogDescription,
//       author: this.author,
//       timestamp: this.timestamp
//     };
//     this.dialogRef.close(newBlog);
//   }

//   onCancelClick(): void {
//     this.dialogRef.close();
//   }
// }

import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenCookieService } from 'src/app/core/service/token-storage-cookies.service';

@Component({
  selector: 'app-add-blog-dialog',
  templateUrl: './add-blog-dialog.component.html',
  styleUrls: ['./add-blog-dialog.component.sass']
})
export class AddBlogDialogComponent implements OnInit {
  blogTitle: string;
  blogType: string;
  headline: string;
  blogDescription: string;
  author: string;
  timestamp: string;

  constructor(
    private dialogRef: MatDialogRef<AddBlogDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public existingBlogData: any,
    private tokenCookieService: TokenCookieService
  ) { }

  ngOnInit(): void {
    if (this.existingBlogData) {
      this.blogTitle = this.existingBlogData.blogTitle;
      this.blogType = this.existingBlogData.blogType;
      this.headline = this.existingBlogData.headline;
      this.blogDescription = this.existingBlogData.blogDescription;
      this.author = this.existingBlogData.author;
      this.timestamp = this.existingBlogData.timestamp;
    } else {
      this.author = this.tokenCookieService.getUser()?.username;
      this.timestamp = new Date().toISOString();
    }
  }

  onSubmitClick(): void {
    const newBlog = {
      blogTitle: this.blogTitle,
      blogType: this.blogType,
      headline: this.headline,
      blogDescription: this.blogDescription,
      author: this.author,
      timestamp: this.timestamp
    };
    this.dialogRef.close(newBlog);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
