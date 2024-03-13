import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from "rxjs";

import { environment } from "src/environments/environment.prod";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
  withCredentials: true,
};

@Injectable({
  providedIn: "root",
})
// /auth/signin
export class SuplierAuthService {
  constructor(private http: HttpClient) {}

  headers = new HttpHeaders().set("Content-Type", "application/json");

  // login(data: any): Observable<any> {
  //   let CREATE_URL = `${environment.baseUrlSelfservice}/erp/suppliers/auth/signin`;
  //   return this.http
  //     .post(CREATE_URL, data, {
  //       observe: "response",
  //       headers: this.headers,
  //       withCredentials: true,
  //     })
  //     .pipe(
  //       map((res) => {
         
  //         return res || {};
  //       }),
        
  //     );
  // }
  

  login(data: any): Observable<any> {
    // Check if the provided credentials match the hardcoded credentials
    if (
      data.username === "wahomejipheens@gmail.com" &&
      data.password === "Pass1234"
    ) {
      // If they match, return a dummy user as if it's a successful login
      return of({
        body: {
          id: 1, // You can set any dummy user ID
          // Add other properties as needed
        },
      });
    } else {
      // If the credentials don't match, simulate a failed login
      return of({
        error: true,
        message: "Invalid credentials",
      });
    }
  }
  verifyOTP(username, otpCode): Observable<any> {
    const OTP_URL = `${environment.baseUrlSelfservice}/erp/suppliers/auth/otp/verify`;

    return this.http.get<any>(OTP_URL, {
      params: { username, otpCode },
    });
  }


  
  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `${error.error.message}`;
    }
    return throwError(errorMessage);
  }

  register(user: any): Observable<{ message: string }> {
    const registerUrl = `${environment.baseUrlSelfservice}/soa/auth/signup`;

    return this.http.post<{ message: string }>(registerUrl, user);
  }

  onboardUser(user): Observable<{ message: string }> {
    const onboardUserUrl = `${environment.baseUrlSelfservice}/soa/otherusers/signup`;

    return this.http.post<{ message: string }>(onboardUserUrl, user);
  }

  resetPassword(resetPasswordDetails): Observable<{ message: string }> {
    const resetPasswordUrl = `${environment.baseUrlSelfservice}/soa/reset/change-password`;

    return this.http.post<{ message: string }>(
      resetPasswordUrl,
      resetPasswordDetails
    );
  }

  forgotPassword(email): Observable<any> {
    const resetPasswordUrl = `${environment.baseUrlSelfservice}/soa/users/forgot-password`;

    return this.http.post<any>(resetPasswordUrl, email);
  }
}
