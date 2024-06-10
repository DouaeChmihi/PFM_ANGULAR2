import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { ProductService } from '../../../../shared/services/product.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { User } from '../../../../shared/models/user';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;
  products: Product[] = [];
  user: User | null = null;
  isAuthenticated: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private userService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
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
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProductsByAdmin().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }

  updateProduct(product: Product): void {
    this.productService.updateProduct(product).subscribe(
      (updatedProduct) => {
        const index = this.products.findIndex(p => p._id === updatedProduct._id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
          console.log('Produit mis à jour avec succès');
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du produit', error);
      }
    );
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        this._snackBar.open('Produit supprimé avec succès', 'Fermer', {
          duration: 3000,
        });
        this.products = this.products.filter(product => product._id !== productId); // Mise à jour locale de la liste des produits
      },
      (error) => {
        console.error('Erreur lors de la suppression du produit', error);
        this._snackBar.open('Erreur lors de la suppression du produit', 'Fermer', {
          duration: 3000,
        });
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
