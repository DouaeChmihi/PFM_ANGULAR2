import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'client';
  constructor(private router: Router) {}

  isAdminPage(): boolean {
    return this.router.url.startsWith('/admin');
  }

    // Fonction pour vérifier si l'URL actuelle est celle de la page de connexion ou d'inscription
    isAuthPage(): boolean {
      return this.router.url.startsWith('/signin') || this.router.url.startsWith('/signup');
    }

    isAddProductPage(): boolean {
      return this.router.url === '/admin/add-product';
    }

    isCartPage():boolean {
      return this.router.url === '/cart';

    }
    isCheckoutPage():boolean {
      return this.router.url === '/checkout';

    }
}
