import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
declare var jquery: any;
declare var $: any;

import {StorageService} from '../storage/storage.service';
import {MenuService} from '../menu/menu.service';
import {CartService} from '../cart/cart.service';
import {MyAccountService} from '../myaccount/myaccount.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})

export class ThankyouComponent {
  orderId: any;
  constructor(private route: ActivatedRoute, private storageService: StorageService, private menuService: MenuService, private cartService: CartService,private myAccountService :MyAccountService) {
    this.route.paramMap.subscribe((params) => {
      if (params.get('orderId') != null) {
        this.orderId = params.get('orderId');
      }
    });

    this.storageService.getCustomerCartId().subscribe((custoken) => {
      if (custoken != "" && custoken != null) {
        this.menuService.initializeCustomerCart(custoken).subscribe((data) => {
          this.storageService.setCartId(data);
          console.log("initializeCustomerCart + " + data);
        });
      } else {
        this.menuService.initializeCart().subscribe((data) => {
          this.storageService.setCartId(data);
          console.log("initialize Cart + " + data);
        });
      }
    });
      
    this.storageService.getCustomerId().subscribe((customerId) => {
        if (customerId != "" && customerId != null && customerId != undefined) {
            this.myAccountService.getCustomerCredit(customerId).subscribe((credit) => {
                this.storageService.setStoreCredit(credit);
            });
        }
    });    
  }
}