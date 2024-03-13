
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

const AUTH_API = `${environment.baseUrlAdmin}/api/v1/auth`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(private http: HttpClient) {}
  signin(data:any){
      let API_URL = `${AUTH_API}/signin`;
      return this.http.post(API_URL, data, { headers: this.headers, withCredentials: false }).pipe(map(res => {
            return res || {}
          }),
            catchError(this.errorMgmt)
          )
  }
  refreshtoken(data:any){
    let API_URL = `${AUTH_API}/refreshtoken`;
    return this.http.post(API_URL, data, { headers: this.headers, withCredentials: false }).pipe(map(res => {
          return res || {}
        }),
          catchError(this.errorMgmt)
        )
}
activeSessions(params:any){
  let API_URL = `${AUTH_API}/sessions`;
  return this.http.get(API_URL,{params:params, headers: this.headers, withCredentials: false }).pipe(map(res => {
        return res || {}
      }),
        catchError(this.errorMgmt)
      )
}
signOut(params:any){
  let API_URL = `${AUTH_API}/logout`;
  return this.http.put(API_URL, {}, {params:params, headers: this.headers, withCredentials: false }).pipe(map(res => {
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
