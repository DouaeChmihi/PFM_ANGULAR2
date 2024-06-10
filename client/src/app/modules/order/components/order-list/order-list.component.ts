import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../shared/services/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  //orders: any[] = [];

  constructor(private orderService: OrderService) { }

 
}
