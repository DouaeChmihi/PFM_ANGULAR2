import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../../../shared/models/product';
import { CartService } from '../../../../shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../shared/models/cart-item';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  //header de table de cart
  displayedColumns: string[] = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action',
  ];
 
  errorMessage: string | null = null;

  constructor(private router: Router, private cartService: CartService,  private _snackBar: MatSnackBar,  private authService: AuthService) { }
  ngOnInit(): void {
    this.getCart();
  }



  getCart(): void {
    this.cartService.getCart()
      .subscribe(
        cartItems => {
          this.cartItems = cartItems;
          console.log(this.cartItems);
        },
        error => {
          this.errorMessage = error;
        }
      );
  }

  getTotalPrice(): number {
    return this.cartService.calculateTotalPrice(this.cartItems);
  }

  
  deleteFromCart(cartItemId: string): void {
    this.cartService.deleteFromCart(cartItemId)
      .subscribe({
        next: () => {
          this._snackBar.open('Item remmoved from Your cart successfully!', 'close', { duration: 3000 });
          this.getCart();
        },
        error: (error) => {
          console.error('Error deleting item from cart:', error);
        this._snackBar.open('Error deleting item from cart. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }
    

  onClearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        console.log('Cart cleared successfully');
        this.getCart(); // Recharger le panier pour mettre à jour l'interface utilisateur
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
        this._snackBar.open('Error clearing cart. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }
  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item._id).subscribe({
      next: () => {
        this._snackBar.open('Quantity decreased successfully!', 'Close', { duration: 3000 });
        this.getCart(); // Reload cart to update the UI
      },
      error: (error) => {
        console.error('Error removing quantity from item:', error);
        this._snackBar.open('Error removing quantity from item. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addQuantity(item._id).subscribe({
      next: () => {
        this._snackBar.open('Quantity increased successfully!', 'Close', { duration: 3000 });
        this.getCart();
      },
      error: (error) => {
        console.error('Error adding quantity to item:', error);
        this._snackBar.open('Error adding quantity to item. Please try again later.', 'Close', { duration: 3000 });
      }
    });
  }

  proceedToCheckout(): void {
    this.authService.isAuthenticated().subscribe(user => {
      if (user) {
           // Si l'utilisateur est authentifié, naviguer vers la page de paiement avec les informations de l'utilisateur
       this.router.navigate(['checkout'], { state: { user: user } });
      } else {
        // Si l'utilisateur n'est pas authentifié, naviguer vers la page de connexion
        this.router.navigate(['signin']);
      }
    });
  }

}


