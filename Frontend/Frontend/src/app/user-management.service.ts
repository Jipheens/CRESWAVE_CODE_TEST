import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  constructor(private http: HttpClient) { }

  // getUsersByStatus(params:any): Observable<any> {
  //   const userUrl = `${environment.userUrl}/api/v1//auth/user/status`;
  //   return this.http.get<any[]>(userUrl);
  // }

  getUsersByStatus(params: HttpParams): Observable<any> {
    const userUrl = `${environment.userUrl}/api/v1/auth/user/status`;
    return this.http.get<any[]>(userUrl, { params: params });
  }

  getBlogs(): Observable<any> {
    const userUrl = `${environment.blogUrl}/api/v1/blog/all`;
  
    return this.http.get<any>(userUrl)
      .pipe(
        catchError(error => {
          console.error('Error fetching blogs:', error);
          throw error; 
        })
      );
  }
  
  
  deleteUserTemporarily(sn: number): Observable<any> {
    const userUrl = `${environment.userUrl}/api/v1/auth/permanent/delete/${sn}`;
    return this.http.delete<any>(userUrl);
  }
  
    
  validateUser(dataToValidate: any): Observable<any> {
    const updateBillUrl = `${environment.userUrl}/api/v1/auth/approveOrReject`;
    return this.http.put<any>(updateBillUrl, dataToValidate)
  }
  

  deleteModule(id: number): Observable<any> {
    const deleteUrl = `${environment.blogUrl}/api/v1/blog/delete?id=${id}`;
    return this.http.delete<any>(deleteUrl);
  }


}