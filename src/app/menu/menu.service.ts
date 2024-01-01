import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'; 

@Injectable()
export class MenuService {

  cartId:string;

  constructor(public http : Http) {
   }

   getMenu(){
     return this.http.get(environment.context_root + '/menu')
      .map(res => res.json());
   }

   initializeCart() {
    return this.http.get(environment.context_root + '/guestcart')
      .map(res => res.json());
   }
  
   initializeCustomerCart(cusToken) {
     return this.http.get(environment.context_root + '/customercart/' + cusToken)
       .map(res => res.json());
   }
   
   getSerachProduct(productName) {
    return this.http.get(environment.context_root + '/serachProduct/'+productName)
      .map(res => res.json());
   }
}
