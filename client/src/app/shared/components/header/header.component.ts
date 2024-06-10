import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartItem } from '../../models/cart-item';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { Subscription, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User | null = null;
  isAuthenticated : boolean = false;
  private cartSubscription: Subscription | undefined;
  
  errorMessage: string | null = null;
  private _cart: CartItem[] = [];
  itemsQuantity = 0;
  
  @Input()
  get cart(): CartItem[] {
    return this._cart;
  }

  set cart(cart: CartItem[]) {
    this._cart = cart;
    this.updateItemsQuantity();
  }

  constructor(private cartService: CartService, 
    private _snackBar: MatSnackBar , 
    private userService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {

    
    this.userService.isAuthenticated().pipe(
      catchError(error => {
        console.error('Error retrieving user data:', error);
        this.isAuthenticated = false;
        this.errorMessage = 'Error retrieving user data. Please try again later.';
        return of(null); 
      })
    ).subscribe(userData => {
      if (userData) {
        this.user = userData;
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
      
    });

  //header va sabonner à cartupdate* observable pour se notifier à chaque fois cart tupdatatt
  this.cartSubscription = this.cartService.cartUpdated$.subscribe(cartItems => {
      this.cart = cartItems;
    });
    this.getCartItems();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the cart subscription
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  
  logout(): void {
    this.userService.logout().subscribe(
      () => {
        this.user = null;
        this.isAuthenticated = false;
        this.router.navigate(['/products']).then(() => {
          window.location.reload();
        });

      },
      (error) => {
        console.error('Error logging out:', error);
      }
    );
  }

  getCartItems(): void {
    this.cartService.getCart().subscribe(
      cartItems => {
        this.cart = cartItems;
        this.updateItemsQuantity();
      },
      error => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  updateItemsQuantity(): void {
    if (this.cart && this.cart.length) {
      this.itemsQuantity = this.cart
        .map(item => item.quantity)
        .reduce((prev, current) => prev + current, 0);
    } else {
      this.itemsQuantity = 0;
    }
  }
  

  onClearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart = [];
        this.updateItemsQuantity();
        this._snackBar.open('Cart cleared successfully', 'Close', { duration: 3000 });
      },
      error: error => {
        console.error('Error clearing cart:', error);
        this._snackBar.open('Error clearing cart. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }
  getTotalPrice(): number {
    return this.cartService.calculateTotalPrice(this.cart);
  }


}
