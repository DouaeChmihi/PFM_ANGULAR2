import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/models/user';
import { OrderService } from '../../../../shared/services/order.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrdersByAdmin().subscribe((orders) => {
      this.users = orders.map(order => order.user);
    });
  }
}