import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../shared/services/order.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../../shared/services/auth.service';
import { CartItem } from '../../../../shared/models/cart-item';
import { CartService } from '../../../../shared/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  shippingAddress = {
    fullName: '',
    address: '',
    city: '',
    zipCode: ''
  
  };
  cartItems: CartItem[] = [];


  constructor(private orderService: OrderService, private router: Router,  private authService: AuthService, private cartService: CartService, private _snackBar: MatSnackBar) { }


  ngOnInit(): void {
    // Récupérer les informations de l'utilisateur depuis la route
    const user = history.state.user;
    if (user) {
      // Remplir le formulaire avec les informations de l'utilisateur
      this.shippingAddress.fullName = user.name || '';
    }

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
         console.log(error);
        }
      );

  }

  getTotalPrice(): number {
    return this.cartService.calculateTotalPrice(this.cartItems);
  }


  onSubmit(): void {
   // Vérifiez si l'utilisateur est authentifié avant de créer la commande
   this.authService.isAuthenticated().subscribe(authenticated => {
    if (authenticated) {
      const orderData = {
        shippingAddress: this.shippingAddress,
        status: 'Pending'
      };
      this.orderService.placeOrder(orderData).subscribe(
        response => {
          this._snackBar.open('Votre commande a été enregistrée.', 'Fermer', {
            duration: 3000, // Durée d'affichage du message en millisecondes
          });
          console.log('Order created successfully', response);
        },
        error => {
          console.error('Error creating order', error);
        }
      );
    } else {
      // Redirigez l'utilisateur vers la page de connexion s'il n'est pas authentifié
      this.router.navigate(['/signin']);
    }
  });
}
}