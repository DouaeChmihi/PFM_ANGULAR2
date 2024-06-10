import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { BehaviorSubject, Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3000/api/products';
  private productUpdatedSubject = new BehaviorSubject<Product[]>([]);
  productUpdated$ = this.productUpdatedSubject.asObservable();

    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.apiUrl)
        .pipe(
          catchError((error: any) => {
            console.error('An error occurred while fetching products:', error);
            return throwError('Something went wrong. Please try again later.');
          }),
          tap(cartItems => this.updateProducts(cartItems))
        );
    }


    getCategories(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/categories`);
    }

    getProductsByAdmin(): Observable<Product[]> {
      return this.http.get<Product[]>(`${this.apiUrl}/admin`, { withCredentials: true }) .pipe(
        catchError(error => {
          console.error('Error deleting product:', error);
          return throwError('Server Error!');
        }),
        switchMap(() => this.fetchAndUpdateProducts())
      );
  
    }
  
    addProduct(product: Product): Observable<any> {
      return this.http.post<Product>(`${this.apiUrl}/admin/add`, product, { withCredentials: true }) .pipe(
        catchError(error => {
          console.error('Error deleting product:', error);
          return throwError('Server Error!');
        }),
        switchMap(() => this.fetchAndUpdateProducts())
      );
  }
    
  
    updateProduct(product: Product): Observable<any> {
      return this.http.put<Product>(`${this.apiUrl}/admin/${product._id}`, product, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error deleting product:', error);
          return throwError('Server Error!');
        }),
        switchMap(() => this.fetchAndUpdateProducts())
      );
  }
    
  
    deleteProduct(productId: string): Observable<any> {
      return this.http.delete<void>(`${this.apiUrl}/admin/${productId}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error deleting product:', error);
          return throwError('Server Error!');
        }),
        switchMap(() => this.fetchAndUpdateProducts())
      );
  }

    private updateProducts(product: Product[]): void {
      this.productUpdatedSubject.next(product);
    }

    private fetchAndUpdateProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.apiUrl)
      .pipe(
        catchError((error: any) => {
          console.error('An error occurred while fetching products:', error);
          return throwError('Something went wrong. Please try again later.');
        }),
        tap(product => {
          this.updateProducts(product);
        })
      );
  }
}










