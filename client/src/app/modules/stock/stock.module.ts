import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './components/stock/stock.component';
import { StockAlertComponent } from './components/stock-alert/stock-alert.component';


@NgModule({
  declarations: [
    StockComponent,
    StockAlertComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule
  ]
})
export class StockModule { }
