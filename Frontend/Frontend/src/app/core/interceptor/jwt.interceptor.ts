// // import { Injectable } from "@angular/core";
// // import {
// //   HttpRequest,
// //   HttpHandler,
// //   HttpEvent,
// //   HttpInterceptor,
// // } from "@angular/common/http";
// // import { Observable } from "rxjs";
// // import { TokenCookieService } from "../service/token-storage-cookies.service";

// // @Injectable()
// // export class JwtInterceptor implements HttpInterceptor {
// //   constructor(private tokenCookieService: TokenCookieService) { }

// //   intercept(
// //     request: HttpRequest<any>,
// //     next: HttpHandler
// //   ): Observable<HttpEvent<any>> {
// //     // add authorization header with jwt token if available
// //     let token = this.tokenCookieService.getToken();
// //     if (token) {

// //       const cloneReq = request.clone({
// //         headers: request.headers.set('Authorization', `Bearer ${token}`)
// //       })

// //       return next.handle(cloneReq);
// //     }

// //     return next.handle(request.clone());
// //   }
// // }


// import { Injectable } from "@angular/core";
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
// } from "@angular/common/http";
// import { Observable } from "rxjs";
// import { TokenCookieService } from "../service/token-storage-cookies.service";

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   constructor(private tokenCookieService: TokenCookieService) { }

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     // add authorization header with jwt token if available
//     let token = this.tokenCookieService.getToken();
//     if (token) {
//       // clone the request and add the Authorization header
//       const cloneReq = request.clone({
//         headers: request.headers.set('Authorization', `Bearer ${token}`)
//       });
      
//       // get the list of cookies in the response and set the HttpOnly and Secure flags on each cookie
//       const cookies = document.cookie.split(';');
//       const secureCookies = cookies.map(cookie => {
//         if (cookie.trim().startsWith('HttpOnly')) {
//           return cookie.trim() + '; Secure';
//         } else {
//           return cookie.trim() + '; HttpOnly; Secure';
//         }
//       });
//       const cookieHeader = secureCookies.join('; ');
//       cloneReq.headers.append('Cookie', cookieHeader);

//       // send the modified request
//       return next.handle(cloneReq);
//     }

//     return next.handle(request.clone());
//   }
// }



import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenCookieService } from "../service/token-storage-cookies.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private tokenCookieService: TokenCookieService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let token = this.tokenCookieService.getToken();
    //console.log("TOken: ", token)
    if (token) {
      // clone the request and add the Authorization header
      const cloneReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
        withCredentials: false // add withCredentials option to the cloned request
      });
      
      // send the modified request
      return next.handle(cloneReq);
    }
    if (!token) {
      // clone the request and add the Authorization header
      const cloneReq = request.clone({
        //headers: request.headers.set('Authorization', `Bearer ${token}`),
        withCredentials: false // add withCredentials option to the cloned request
      });
      
      // send the modified request
      return next.handle(cloneReq);
    }

    return next.handle(request.clone());
  }
}









