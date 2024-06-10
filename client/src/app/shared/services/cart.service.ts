import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, BehaviorSubject, throwError, tap, catchError, switchMap, of } from 'rxjs';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/api/cart';
  private cartUpdatedSubject = new BehaviorSubject<CartItem[]>([]);
  cartUpdated$ = this.cartUpdatedSubject.asObservable();

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {}

  addToCart(productId: string): Observable<any> {
    const body = { productId };
    return this.http.post(`${this.apiUrl}/add`, body, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error adding product to cart:', error);
          return throwError('Error adding product to cart. Please try again later.');
        }),
        switchMap(() => this.fetchAndUpdateCart())
      );
  }

  getCart(): Observable<CartItem[]> {
    const sessionId = localStorage.getItem('sessionId'); // Retrieve session id from local storage
   
    return this.http.get<CartItem[]>(`${this.apiUrl}?sessionId=${sessionId}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('An error occurred while fetching cart:', error);
          return throwError('Something went wrong. Please try again later.');
        }),
        tap(cartItems => this.updateCart(cartItems))
      );
  }

  deleteFromCart(cartItemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cartItemId}`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error deleting item from the cart:', error);
          return throwError('Server Error!');
        }),
        switchMap(() => this.fetchAndUpdateCart())
      );
  }

  removeQuantity(cartItemId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/remove-quantity/${cartItemId}`, {}, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error removing quantity from item:', error);
          this._snackBar.open('Error removing quantity from item. Please try again later.', 'Close', { duration: 3000 });
          return throwError(error);
        }),
        switchMap(() => this.fetchAndUpdateCart())
      );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error clearing cart:', error);
          this._snackBar.open('Error clearing cart. Please try again later.', 'Close', { duration: 3000 });
          return throwError(error);
        }),
        switchMap(() => this.fetchAndUpdateCart())
      );
  }

  addQuantity(cartItemId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/add-quantity/${cartItemId}`, {}, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error adding quantity to item:', error);
          this._snackBar.open('Error adding quantity to item. Please try again later.', 'Close', { duration: 3000 });
          return throwError(error);
        }),
        switchMap(() => this.fetchAndUpdateCart())
      );
  }

  calculateTotalPrice(cartItems: CartItem[]): number {
    let totalPrice = 0;
    for (const cartItem of cartItems) {
      if (cartItem && cartItem.productId && cartItem.productId.price) {
        totalPrice += cartItem.productId.price * cartItem.quantity;
      }  
      }
    return totalPrice;
  }

  private updateCart(cartItems: CartItem[]): void {
    this.cartUpdatedSubject.next(cartItems);
  }

  private fetchAndUpdateCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('An error occurred while fetching cart:', error);
          return throwError('Something went wrong. Please try again later.');
        }),
        tap(cartItems => {
          this.updateCart(cartItems);
        })
      );
  }

  //avant fusionner , vérifier si la cart sessionId has items
  hasSessionCartItems(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/hasSessionCartItems`, { withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error checking session cart items:', error);
        return of(false); // Default to false if there's an error
      })
    );
  }
}
