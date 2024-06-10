import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import { AdminProductListComponent } from './components/admin-product-list/admin-product-list.component';
import { AddProductsComponent } from './components/add-products/add-products.component';
import { UserListComponent } from './components/user-list/user-list.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
@NgModule({
  declarations: [
    OrderListComponent,
    OrderDetailComponent,
   
    AdminPageComponent,
    AdminProductListComponent,
    AddProductsComponent,
    UserListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    OrderRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class OrderModule { }
