import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class InitiateRequestsService {

  constructor(private http: HttpClient) { }
  
  getRequests(): Observable<any> {
    const requestsUrl = `${environment.baseUrlAdmin}/api/v1/users/access-request/find/all`;
    return this.http.get<any[]>(requestsUrl);
  }
  getRequestsById(params: any): Observable<any> {
    const requestsUrl = `${environment.baseUrlAdmin}/api/v1/users/access-request/find/by/id`;

    return this.http.get<any>(requestsUrl, {params});

  }


  addRequests(data: any): Observable<any> {
    const requestsUrl = `${environment.baseUrlAdmin}/api/v1/users/access-request/add`;
    return this.http.post<any>(requestsUrl, data);
  }

  updateRequests(InitiateRequestDetails: any): Observable<any> {
    const requestsUrl = `${environment.baseUrlAdmin}/api/v1/users/access-request/update`;
    return this.http.put<any>(requestsUrl, InitiateRequestDetails)
  }


  deleteRequestTemporarily(params: any): Observable<any> {
    const requestsUrl = `${environment.baseUrlAdmin}/api/v1/users/access-request/delete`;
    return this.http.delete<any>(requestsUrl, {params});
  }


    // ********************************************************************************************************************



}
