import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './modules/cart/components/cart/cart.component';
import { ProductListComponent } from './modules/catalog/components/product-list/product-list.component';
import { RegisterComponent } from './modules/user/components/register/register.component';
import { LoginComponent } from './modules/user/components/login/login.component';
import { CheckoutComponent } from './modules/cart/components/checkout/checkout.component';
import { OrderDetailComponent } from './modules/order/components/order-detail/order-detail.component';
import { OrderListComponent } from './modules/order/components/order-list/order-list.component';
import { AdminPageComponent } from './modules/order/components/admin-page/admin-page.component';
import { AddProductsComponent } from './modules/order/components/add-products/add-products.component';
import { UserListComponent } from './modules/order/components/user-list/user-list.component';
import { AdminProductListComponent } from './modules/order/components/admin-product-list/admin-product-list.component';

const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  {path: 'admin', component: AdminPageComponent },
    { path: 'products', component: AdminProductListComponent },
    { path: 'admin/add-product', component: AddProductsComponent },
    { path: 'users', component: UserListComponent },
    { path: 'orders', component: OrderListComponent },

  
  { path: 'cart', component: CartComponent},
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {path:'signup', component: RegisterComponent},
  {path:'signin', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent},
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/:id', component: OrderDetailComponent }
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
