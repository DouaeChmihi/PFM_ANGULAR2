import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = 'http://localhost:3000/api/orders'; // Adjust the URL as per your backend API

  constructor(private http: HttpClient) { }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/place-order`, orderData, { withCredentials: true });
  }
}
