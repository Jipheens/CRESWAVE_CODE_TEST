

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.prod";



@Injectable({
  providedIn: "root",
})
export class PrivilegesService {

  constructor(private http: HttpClient) { }



  getPrivileges(): Observable<any>
  {
    const PrivilegesUrl =`${environment.baseUrlAdmin}/api/v1/auth/Privileges/all`; 
    return this.http.get<any[]>(PrivilegesUrl);
  }

  getPrivilegesById(params: any): Observable<any> {
    return this.http.get<any>(
      `${environment.baseUrlAdmin}/api/v1/auth/Privileges/find/by/id`, {params}
    );
  }

  getPrivilegesByStatus(params): Observable<any> {
    const PrivilegesUrl = `${environment.baseUrlAdmin}/api/v1/auth/Privileges/fetchbyStatus`;
    return this.http.get<any[]>(PrivilegesUrl, { params });
  }


addPrivilege(data: any): Observable<any>
  {
    const PrivilegesUrl =`${environment.baseUrlAdmin}/api/v1/auth/Privileges/create`; 
    return this.http.post<any[]>(PrivilegesUrl, data);
  }

updatePrivilege(data: any): Observable<any>
  {
    const PrivilegesUrl =`${environment.baseUrlAdmin}/api/v1/auth/Privileges/update`; 
    return this.http.put<any[]>(PrivilegesUrl, data);
  }

deletePrivilegeTemporarily(params: any): Observable<any>
  {
    const PrivilegesUrl =`${environment.baseUrlAdmin}/api/v1/auth/Privileges/delete`; 
    return this.http.delete<any[]>(PrivilegesUrl, {params});
  }


uploadBatchPrivileges(data: any): Observable<any> 
  {
    const PrivilegesUrl = `${environment.baseUrlAdmin}/api/v1/auth/Privileges/create/bulk`;
    return this.http.post<any>(PrivilegesUrl, data);
  }



validatePrivileges(dataToValidate: any): Observable<any> {
const imprestUrl = `${environment.baseUrlAdmin}/api/v1/auth/Privileges/update/state`;
return this.http.put<any>(imprestUrl, dataToValidate);
}


  getPrivielgesByParams(params: any): Observable<any> {
    const PrivilegessUrl = `${environment.baseUrlAdmin}/api/v1/allprivileges/read`;
    return this.http.get<any>(PrivilegessUrl, {params});
  }



}