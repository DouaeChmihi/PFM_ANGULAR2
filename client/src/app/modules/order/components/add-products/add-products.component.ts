import { Component } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { ProductService } from '../../../../shared/services/product.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { User } from '../../../../shared/models/user';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.css'
})
export class AddProductsComponent {
  product: Product = new Product('', '', 0, '', '', '', '', 0);

  user: User | null = null;
  isAuthenticated : boolean = false;
  errorMessage: string | null = null;

  constructor(private productService: ProductService, private userService: AuthService ,  private router: Router
  ) {}

  ngOnInit(): void {

    
    this.userService.isAuthenticated().pipe(
      catchError(error => {
        console.error('Error retrieving user data:', error);
        this.isAuthenticated = false;
        this.errorMessage = 'Error retrieving user data. Please try again later.';
        return of(null); // Return a null value to handle the error
      })
    ).subscribe(userData => {
      if (userData) {
        this.user = userData;
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
      
    });
  }

  addProduct(): void {
    this.productService.addProduct(this.product).subscribe(
      (response) => {
        console.log('Produit ajouté avec succès', response);
        // Réinitialiser le formulaire ou rediriger l'utilisateur
        this.product = new Product('', '', 0, '', '', '', '', 0); // Reset the form
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du produit', error);
      }
    );
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
}