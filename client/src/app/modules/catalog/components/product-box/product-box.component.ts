import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { CartService } from '../../../../shared/services/cart.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent {

  @Input() fullWidthMode = false;
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();

  constructor(private cartService: CartService, private router: Router, private _snackBar: MatSnackBar) { }

  onAddToCart(productId: string): void {
    this.cartService.addToCart(productId).subscribe({
      next: () => {
        console.log('Product added to cart successfully');
            this._snackBar.open('Prouct added to your cart sucessfully!', 'close', { duration: 3000 });
 
      },
      error: (error) => {
        console.error('Error adding product to cart:', error);
      }
    });
  }
  

  

}
