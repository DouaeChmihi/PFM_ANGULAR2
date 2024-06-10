import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { ProductService } from '../../../../shared/services/product.service';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrl: './admin-product-list.component.css'
})
export class AdminProductListComponent implements OnInit {
  products: Product[] = []; // À remplacer par les données réelles

  constructor(private productService: ProductService) {}


  ngOnInit(): void {
    this.productService.getProductsByAdmin().subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe(
      () => {
        this.products = this.products.filter(product => product._id !== productId);
        console.log('Produit supprimé avec succès');
      },
      (error) => {
        console.error('Erreur lors de la suppression du produit', error);
      }
    );
  }
}