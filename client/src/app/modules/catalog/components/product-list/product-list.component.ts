import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../shared/models/product';
import { ProductService } from '../../../../shared/services/product.service';



@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = []; // Store all products fetched from the backend
  categories: string[] = [];
  filteredProducts: Product[] = []; // Store filtered products

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Fetch all products from the backend
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
  
    this.productService.getCategories().subscribe(categories => {
        this.categories = categories;
      
    this.filteredProducts = this.allProducts;


    }); 
  })

  }

  filterByCategory(category: string) {
   
      this.filteredProducts = this.allProducts.filter(product =>
        product.category === category
      
      )
  }
  
  resetFilters() {
    // Reset filtered products to all products
    this.filteredProducts = this.allProducts;
  }


  
}

