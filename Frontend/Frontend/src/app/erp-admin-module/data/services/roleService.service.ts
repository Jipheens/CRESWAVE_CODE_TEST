import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class RolesService {
  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    const RolesUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles`;
    return this.http.get<any[]>(RolesUrl);
  }

  getRolesById(params: any): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrlAdmin}/api/v1/auth/roles/find/by/id`,
      { params }
    );
  }

  getRolesByStatus(params): Observable<any> {
    const RolesUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/fetchbyStatus`;
    return this.http.get<any[]>(RolesUrl, { params });
  }

  addRole(data: any): Observable<any> {
    const RolesUrl = `${environment.baseUrlAdmin}/api/v1/auth/role/add`;
    return this.http.post<any[]>(RolesUrl, data);
  }

  updateRole(data: any): Observable<any> {
    const RolesUrl = `${environment.baseUrlAdmin}/api/v1/auth/role/update`;
    return this.http.put<any[]>(RolesUrl, data);
  }

  deleteRoleTemporarily(params: any): Observable<any> {
    const RolesUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/delete`;
    return this.http.delete<any[]>(RolesUrl, { params });
  }

  uploadBatchRoles(data: any): Observable<any> {
    const RolesUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/create/bulk`;
    return this.http.post<any>(RolesUrl, data);
  }

  validateRoles(dataToValidate: any): Observable<any> {
    const imprestUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/update/state`;
    return this.http.put<any>(imprestUrl, dataToValidate);
  }

  getPrivielgesByParams(params: any): Observable<any> {
    const RolessUrl = `${environment.baseUrlAdmin}/api/v1/allprivileges/read`;
    return this.http.get<any>(RolessUrl, { params });
  }

  // getRoles(params: any): Observable<any> {
  //   const RolessUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/find/all`;
  //   return this.http.get<any>(RolessUrl, {params});
  // }

  // getRolesByStatus(params: any): Observable<any> {
  //   const RolessUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/all/by/status`;
  //   return this.http.get<any>(RolessUrl, {params});
  // }

  // getRolesById(params: any): Observable<any> {
  //   const RolessUrl= `${environment.baseUrlAdmin}/api/v1/auth/roles/find/by/id`;

  //   return this.http.get<any>(RolessUrl, {params});
  // }

  // addRoles(data: any): Observable<any> {
  //   const RolessUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/add`;
  //   return this.http.post<any>(RolessUrl, data);
  // }

  // updateRoles(RolesDetails: any): Observable<any> {
  //   const updateBillUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/update`;
  //   return this.http.put<any>(updateBillUrl, RolesDetails)
  // }

  // verifyRole(params: any): Observable<any> {
  //   const updateBillUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/verify`;
  //   return this.http.put<any>(updateBillUrl, {params})
  // }

  // deleteRolesTemporarily(params: any): Observable<any> {
  //   const RolessUrl = `${environment.baseUrlAdmin}/api/v1/auth/roles/delete`;
  //   return this.http.put<any>(RolessUrl, {params});
  // }

  // getPrivielgesByParams(params: any): Observable<any> {
  //   const RolessUrl = `${environment.baseUrlAdmin}/api/v1/allprivileges/read`;
  //   return this.http.get<any>(RolessUrl, {params});
  // }

  // ********************************************************************************************************************
}
