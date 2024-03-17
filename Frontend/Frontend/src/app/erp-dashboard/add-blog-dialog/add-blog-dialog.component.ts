// import { Component, Inject, OnInit, Optional } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { TokenCookieService } from 'src/app/core/service/token-storage-cookies.service';

// @Component({
//   selector: 'app-add-blog-dialog',
//   templateUrl: './add-blog-dialog.component.html',
//   styleUrls: ['./add-blog-dialog.component.sass']
// })
// export class AddBlogDialogComponent implements OnInit {
//   blogTittle: string;
//   blogType: string;
//   headline: string;
//   blogDecription: string;
//   author: string;
//   timestamp: string;

//   constructor(
//     private dialogRef: MatDialogRef<AddBlogDialogComponent>,
//     @Optional() @Inject(MAT_DIALOG_DATA) public existingBlogData: any,
//     private tokenCookieService: TokenCookieService
//   ) { }

//   ngOnInit(): void {
//     if (this.existingBlogData) {
//       this.blogTittle = this.existingBlogData.blogTittle;
//       this.blogType = this.existingBlogData.blogType;
//       this.headline = this.existingBlogData.headline;
//       this.blogDecription = this.existingBlogData.blogDecription;
//       this.author = this.existingBlogData.author;
//       this.timestamp = this.existingBlogData.timestamp;
//     } else {
//       this.author = this.tokenCookieService.getUser().username;
//       this.timestamp = new Date().toISOString();
//     }
//   }

//   onSubmitClick(): void {
//     const newBlog = {
//       blogTittle: this.blogTittle,
//       blogType: this.blogType,
//       headline: this.headline,
//       blogDecription: this.blogDecription,
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
import { UserManagementService } from 'src/app/user-management.service';

@Component({
  selector: 'app-add-blog-dialog',
  templateUrl: './add-blog-dialog.component.html',
  styleUrls: ['./add-blog-dialog.component.sass']
})
export class AddBlogDialogComponent implements OnInit {
  blogTittle: string;
  blogType: string;
  headline: string;
  blogDecription: string;
  author: string;
  timestamp: string;

  constructor(
    private dialogRef: MatDialogRef<AddBlogDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public existingBlogData: any,
    private tokenCookieService: TokenCookieService,
    private userService: UserManagementService,

  ) { }

  ngOnInit(): void {
    if (this.existingBlogData) {
      this.blogTittle = this.existingBlogData.blogTittle;
      this.blogType = this.existingBlogData.blogType;
      this.headline = this.existingBlogData.headline;
      this.blogDecription = this.existingBlogData.blogDecription;
      this.author = this.existingBlogData.author;
      this.timestamp = this.existingBlogData.timestamp;
    } else {
      this.author = this.tokenCookieService.getUser()?.username;
      this.timestamp = new Date().toISOString();
    }
  }

  // onSubmitClick(): void {
  //   const newBlog = {
  //     blogTittle: this.blogTittle,
  //     blogType: this.blogType,
  //     headline: this.headline,
  //     blogDecription: this.blogDecription,
  //     author: this.author,
  //     timestamp: this.timestamp
  //   };
  //   this.dialogRef.close(newBlog);
  // }
  onSubmitClick(): void {
    const blogData = {
      blogTittle: this.blogTittle,
      blogType: this.blogType,
      headline: this.headline,
      blogDecription: this.blogDecription,
      author: this.author,
      timestamp: this.timestamp
    };
    if (this.existingBlogData) {
      const updatedBlogData = {
        id: this.existingBlogData.id,
        blogTittle: blogData.blogTittle,
        blogType: blogData.blogType,
        headline: blogData.headline,
        blogDecription: blogData.blogDecription,
        author: blogData.author,
        timestamp: blogData.timestamp
      };
    
      console.log("blog data on update submission", updatedBlogData);
      this.userService.updateBlog(updatedBlogData).subscribe(
        (response) => {
          console.log('Blog updated successfully:', response);
          this.dialogRef.close(response); 
        },
        (error) => {
          console.error('Error updating blog:', error);
        }
      );
    }
     else {
        console.log("blog data on add submission",blogData)

      this.userService.addBlog(blogData).subscribe(
        (response) => {
          console.log('Blog added successfully:', response);
          this.dialogRef.close(response); 
        },
        (error) => {
          console.error('Error adding blog:', error);
          
        }
      );
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
