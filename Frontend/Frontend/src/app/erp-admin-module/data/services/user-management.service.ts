import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class UsersManagementService {
  constructor(private http: HttpClient) { }

  fetchAll(): Observable<any> {
    const UsersUrl = `${environment.baseUrlAdmin}/api/v1/auth/FetchAll`;
    return this.http.get<any[]>(UsersUrl);
  }

  // findBySn(params: any): Observable<any> {
  //   return this.http.get<any>(
  //     `${environment.baseUrlAdmin}/api/v1/auth/findById`,
  //     { params }
  //   );
  // }

  findBySn(sn: string): Observable<any> {
    const options = {
      params: new HttpParams().set('Sn', (+sn).toString())
    };
    return this.http.get<any>(`${environment.baseUrlAdmin}/api/v1/auth/findById`, options);
  }

  getUsersByStatus(params: any): Observable<any> {
    const UsersUrl = `${environment.baseUrlAdmin}/api/v1/auth/user/status`;
    return this.http.get<any[]>(UsersUrl, { params });
  }

  //adding cost centres
  addUser(data: any): Observable<any> {
    const UsersUrl = `${environment.baseUrlAdmin}/api/v1/users/create`;
    return this.http.post<any[]>(UsersUrl, data);
  }

  //updating cost centres
  updateUser(data: any): Observable<any> {
    const UsersUrl = `${environment.baseUrlAdmin}/api/v1/auth/users/update`;
    return this.http.put<any[]>(UsersUrl, data);
  }

  accountLockUnlock(params: any): Observable<any> {
    const UsersUrl = `${environment.baseUrlAdmin}/api/v1/users/update/access`;
    return this.http.put<any[]>(UsersUrl, {}, { params });
  }

  deleteUser(params: any): Observable<any> {
    const UsersUrl = `${environment.baseUrlAdmin}/api/v1/auth/permanent/delete/${params}`;
    return this.http.delete<any[]>(UsersUrl, { params });
  }

  uploadBatchUsers(data: any): Observable<any> {
    const UsersUrl = `${environment.baseUrlAdmin}/api/v1/users/create/bulk`;
    return this.http.post<any>(UsersUrl, data);
  }

  validateUsers(body: any, params: any): Observable<any> {
    const imprestUrl = `${environment.baseUrlAdmin}/api/v1/auth/approveOrReject`;
    return this.http.put<any>(imprestUrl, body, { params: params });
  }
}
