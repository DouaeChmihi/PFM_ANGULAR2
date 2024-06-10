import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogModule } from './catalog.module';
import { CategoryComponent } from './components/category/category.component';
import { ProductListComponent } from './components/product-list/product-list.component';

const routes: Routes = [
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
