// import { Injectable } from '@angular/core';

// const TOKEN_KEY = 'auth-token';
// const USER_KEY = 'auth-user';

// @Injectable({
//   providedIn: 'root'
// })
// export class TokenCookieService {
//   constructor() { }

//   signOut(): void {
//     this.deleteCookie(TOKEN_KEY);
//     this.deleteCookie(USER_KEY);
//     localStorage.clear();
//   }

//   public saveToken(token: string): void {
//     this.setCookie(TOKEN_KEY, token);
//   }

//   public getToken(): string | null {
//     return this.getCookie(TOKEN_KEY);
//   }

//   public saveUser(user: any): void {
//     this.setCookie(USER_KEY, JSON.stringify(user));
//   }

//   public getUser(): any {
//     const user = this.getCookie(USER_KEY);
//     if (user) {
//       return JSON.parse(user);
//     }

//     return {};
//   }

//   // private setCookie(name: string, value: string, expireDays = 1, path = '/') {
//   //   const date = new Date();
//   //   date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
//   //   const expires = '; expires=' + date.toUTCString();
//   //   const secureFlag = '; Secure';
//   //   const httpOnlyFlag = '; HttpOnly';
//   //   document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=' + path + secureFlag + httpOnlyFlag;
//   // }

//   private setCookie(name: string, value: string, expireDays = 1, path = '/') {
//     //const date = new Date();
//     //date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
//     //const expires = '; expires=' + date.toUTCString();
//     // const secureFlag = '; Secure';
//     //const httpOnlyFlag = '; HttpOnly';
//     // const sameSiteFlag = '; SameSite=Strict';
//     document.cookie = name + '=' + encodeURIComponent(value);
//   }
//   // httpOnlyFlag +
//   // +  sameSiteFlag
//   // + secureFlag
//   //  + expires + '; path=' + path

//   private getCookie(name: string) {
//     const nameEQ = name + '=';
//     const ca = document.cookie.split(';');
//     for (let i = 0; i < ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) == ' ') c = c.substring(1, c.length);
//       if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
//     }
//     return null;
//   }

//   private deleteCookie(name: string) {
//     document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//   }

//   //  setSessionCookie(sessionId: string) {
//   //   document.cookie = `JSESSIONID=${sessionId}; Secure; HttpOnly`;
//   // }

// }

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, tap } from "rxjs";
import { environment } from "src/environments/environment.prod";

const TOKEN_KEY = "auth-token";
const USER_KEY = "auth-user";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {}

  // signOut(): Observable<any> {
  //   const SIGNOUT_URL = `${environment.authUrl}/soa/auth/logout`;
  //   return this.http.post(SIGNOUT_URL, 'data', {
  //     observe: "response",
  //     headers: this.headers,
  //     withCredentials: true,
  //   }).pipe(
  //     tap(() => {
  //       // clear local storage
  //       localStorage.clear();

  //       // clear cookies
  //       const cookies = document.cookie.split(';');
  //       for (let i = 0; i < cookies.length; i++) {
  //         const cookie = cookies[i];
  //         const eqPos = cookie.indexOf('=');
  //         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
  //         document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  //       }

  //       // reload the current page
  //       location.reload();

  //       console.log("Signed out: Page reloaded")
  //     })
  //   );
  // }

  // .pipe(
  //   map((res) => {
  //     window.localStorage.clear();
  //     document.cookie.split(";").forEach((c) => {
  //       document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  //     });
  //     return res || {};
  //   }),

  // );

  public getToken(): string | null {
    // get the name of the cookie to retrieve
    const name = "accessToken";
    // split the document.cookie string into an array of individual cookies
    const cookieArray = document.cookie.split(";");
    // loop through the cookies to find the one with the matching name
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      //console.log("cookieArray: ", cookieArray)
      // remove any leading spaces from the cookie string
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      // if the cookie name matches the desired name, return the cookie value
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    // if the cookie was not found, return null
    return null;
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }
}
