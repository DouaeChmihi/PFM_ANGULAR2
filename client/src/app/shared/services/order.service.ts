import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/api/order'; // Your backend API URL

  constructor(private http: HttpClient) { }

  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/place-order`, orderData, { withCredentials: true });
  }

  // Get orders by admin
  getOrdersByAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/orders`, { withCredentials: true });
  }

  // Get order by ID
  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${orderId}`, { withCredentials: true });
  }
}