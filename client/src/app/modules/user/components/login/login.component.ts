import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../../../shared/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showMergeMessage: boolean = false;
  isAdmin: boolean = false; // New property to store user role

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) { }

  ngOnInit() {
    this.checkUser();
    this.checkCartItems();
  }

  checkUser() {
    this.authService.isAuthenticated().subscribe(user => {
      if (user && user.role === 'admin') {
        this.isAdmin = true;
      }
    });
  }

  checkCartItems() {
    this.cartService.hasSessionCartItems().subscribe(hasItems => {
      this.showMergeMessage = hasItems && !this.isAdmin; // Only show merge message if not admin
    });
  }

  checkAndSignIn(): void {
    if (this.showMergeMessage) {
      const mergeCart = confirm('Do you want to merge your session cart with your logged-in cart?');
      this.signIn(mergeCart);
    } else {
      this.signIn(false);
    }
  }

  signIn(mergeCart: boolean): void {
    if (this.email && this.password) {
      this.authService.signIn({ email: this.email, password: this.password, mergeCart }).subscribe(
        (response) => {
          if (response.user && response.user.role === 'admin') {
            this.router.navigate(['/admin']); // Navigate to admin route if user is admin
          } else {
            this.router.navigate(['/products']); // Navigate to products route for non-admin users
          }
          // Delay navigation to allow the page to refresh
          setTimeout(() => {
            // Navigate to the catalog route
            window.location.reload();
          }, 1000); // Adjust the delay time as needed
        },
        error => {
          console.error('Error signing in:', error);
          this.errorMessage = 'Invalid email or password.';
        }
      );
    } else {
      this.errorMessage = 'Please enter email and password.';
    }
  }
  
  


}
