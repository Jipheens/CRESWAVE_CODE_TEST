import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

const AUTH_API = `${environment.baseUrlAdmin}/api/v1/users/access-request`;
@Injectable({
  providedIn: 'root'
})
export class AccessRequestService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}
  create(data:any){
      let API_URL = `${AUTH_API}/add`;
      return this.http.post(API_URL, data, { headers: this.headers, withCredentials: false }).pipe(map(res => {
            return res || {}
          }),
            catchError(this.errorMgmt)
          )
  }
  findAll(){
    let API_URL = `${AUTH_API}/find/all`;
    return this.http.get(API_URL, { headers: this.headers, withCredentials: false }).pipe(map(res => {
          return res || {}
        }),
          catchError(this.errorMgmt)
        )
  }
  findById(params: any){
    let API_URL = `${AUTH_API}/find/by/id`;
    return this.http.get(API_URL, { params:params, headers: this.headers, withCredentials: false }).pipe(map(res => {
          return res || {}
        }),
          catchError(this.errorMgmt)
        )
  }
  update(data: any){
    let API_URL = `${AUTH_API}/update`;
    return this.http.put(API_URL, data, { headers: this.headers, withCredentials: false }).pipe(map(res => {
          return res || {}
        }),
          catchError(this.errorMgmt)
        )
}
createAccount(params:any){
  let API_URL = `${AUTH_API}/create/account`;
  return this.http.put(API_URL, {}, {params:params, headers: this.headers, withCredentials: false }).pipe(map(res => {
        return res || {}
      }),
        catchError(this.errorMgmt)
      )
}
  approve(params: any){
    let API_URL = `${AUTH_API}/verify`;
    return this.http.put(API_URL, {params:params, headers: this.headers, withCredentials: false }).pipe(map(res => {
          return res || {}
        }),
          catchError(this.errorMgmt)
        )
  }
  delete(params: any){
    let API_URL = `${AUTH_API}/delete`;
    return this.http.get(API_URL, { params:params, headers: this.headers, withCredentials: false }).pipe(map(res => {
          return res || {}
        }),
          catchError(this.errorMgmt)
        )
  }
  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `${error.error.message}`;
    }
    return throwError(errorMessage);
  }
}
