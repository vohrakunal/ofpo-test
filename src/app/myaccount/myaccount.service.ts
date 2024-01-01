import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';


@Injectable()
export class MyAccountService {
  cusToken;
  constructor(public http: Http) {

  }

  getCustomerAllInfo(cusToken) {
    return this.http.get(environment.context_root + '/customerAllDetails/' + cusToken)
      .map(res => res.json());
  }

  getOrderHistory(email) {
    return this.http.get(environment.context_root + '/customer/orderhistory/' + email)
      .map(res => res.json());
  }
  
  getTrackOrder(orderNumber,customer_id) {
    return this.http.get(environment.context_root + '/customer/trackOrder/' + orderNumber +'/'+ customer_id)
      .map(res => res.json());
  }
 
  cancelOrder(orderId, orderCreatedEndTime, status,entity_id,parent_id,created_at) {
    var order = {
      "orderId": orderId,
      "status": status,
      "createdEndTime": orderCreatedEndTime,
      "entity_id" :entity_id,
      "parent_id" :parent_id,
      "created_at" :created_at
    };
    return this.http.post(environment.context_root + '/cancelOrder', order)
      .map(res => res.json());
  }
  
  getOrderDetailById(orderId) {
    return this.http.get(environment.context_root + '/orderDetail/' + orderId)
      .map(res => res.json());
  }
 
  returnOrderRequest(orderReturn, orderNumber, customerName, customerEmail, file) {
    var orderRrturn = {
      "orderReturn": orderReturn,
      "orderId": orderNumber,
      "name": customerName,
      "email": customerEmail,
      "files": file
    };
    return this.http.post(environment.context_root + '/orderReturn', orderRrturn)
      .map(res => res.json());
  }
    
  getCustomerCredit(customerId) {
    return this.http.get(environment.context_root + '/credit/' + customerId)
      .map(res => res.json());
  }
    
  sellonOfposion(selldata, file) {
     var sell = {
      "brandName": selldata.brandName,
      "mainOfficeLocation": selldata.mainOfficeLocation,
      "brandBrief": selldata.mainOfficeLocation,
      "productCategory":selldata.productCategory,
      "pricePoint":selldata.pricePoint,
      "files": file
    };
    return this.http.post(environment.context_root + '/sellon', sell)
      .map(res => res.json());
  }
    
 
}



