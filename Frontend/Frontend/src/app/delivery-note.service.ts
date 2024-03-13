// 




import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DeliveryNoteService {

  constructor(private http: HttpClient) { }

  getDeliveryNote(): Observable<any> {
    const DeliveryNoteUrl = `${environment.baseUrl}/api/v1/rankingmatrix/all`;
    return this.http.get<any[]>(DeliveryNoteUrl);
  }
  getDeliveryNoteById(params: any): Observable<any> {
    const DeliveryNotessUrl = `${environment.baseUrl}/api/v1/rankingmatrix/find/by/id`;

    return this.http.get<any>(DeliveryNotessUrl, { params: params, });

  }

  addDeliveryNote(data: any): Observable<any> {
    const DeliveryNoteUrl = `${environment.baseUrl}/api/v1/rankingmatrix/add`;
    return this.http.post<any>(DeliveryNoteUrl, data);
  }

  updateDeliveryNote(DeliveryNoteDetails: any): Observable<any> {
    const DeliveryNote = `${environment.baseUrl}/api/v1/rankingmatrix/modify`;
    return this.http.put<any>(DeliveryNote, DeliveryNoteDetails)
  }


  deleteDeliveryNoteTemporarily(params: any): Observable<any> {
    const DeliveryNoteUrl = `${environment.baseUrl}/api/v1/rankingmatrix/delete`;
    return this.http.delete<any>(DeliveryNoteUrl, { params });
  }


  getDeliveryNoteByCode(params: any): Observable<any> {
    const DeliveryNotessUrl = `${environment.baseUrl}/api/v1/rankingmatrix/find/by/refcode`;
    return this.http.get<any>(DeliveryNotessUrl, { params: params, });
  }

}