import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {StorageService} from '../storage/storage.service';
import {environment} from '../../environments/environment';


@Injectable()
export class CheckoutService {
  address:any={};
  constructor(public http: Http, private storageService: StorageService) {

  }

  getShippingRates(country_id) {
    return this.http.get(environment.context_root + '/shippingRates/' + country_id)
      .map(res => res.json());
  }

  getCustomerInfo(cusToken) {
    return this.http.get(environment.context_root + '/customerinfo/' + cusToken)
      .map(res => res.json());
  }

  getEstimateShippingMethod(cartId, cusToken, shippingDetail,regionErrorFlag) {
      this.address={};
      if (regionErrorFlag == false) {
          this.address = {
              region_code: shippingDetail.region_code,
              street: shippingDetail.street,
              "same_as_billing": "",
              firstname: shippingDetail.firstname,
              lastname: shippingDetail.lastname,
              email: shippingDetail.email,
              region: shippingDetail.region,
              city: shippingDetail.city,
              country_id: shippingDetail.country_id,
              region_id: shippingDetail.region_id,
              postcode: shippingDetail.postcode,
              telephone: shippingDetail.telephone,
          }
      } else {
          this.address = {
              street: shippingDetail.street,
              "same_as_billing": "",
              firstname: shippingDetail.firstname,
              lastname: shippingDetail.lastname,
              email: shippingDetail.email,
              region: shippingDetail.region,
              city: shippingDetail.city,
              country_id: shippingDetail.country_id,
              postcode: shippingDetail.postcode,
              telephone: shippingDetail.telephone,
          }
      }
    var shippingData = {
      address:this.address
    }

    if (cusToken != undefined && cusToken != '' && cusToken != null) {
      return this.http.post(environment.context_root + '/customer/shippingEstimate/' + cartId, shippingData)
        .map(res => res.json());
    } else {
      return this.http.post(environment.context_root + '/shippingEstimate/' + cartId, shippingData)
        .map(res => res.json());
    }
  }
  
  getEstimateShipping(cartId, cusToken, countryid) {
    var address = {
      country_id: countryid
    }
    var shippingData = {
      address
    }
    if (cusToken != undefined && cusToken != '' && cusToken != null) {
      return this.http.post(environment.context_root + '/customer/shippingEstimate/' + cartId, shippingData)
        .map(res => res.json());
    } else {
      return this.http.post(environment.context_root + '/shippingEstimate/' + cartId, shippingData)
        .map(res => res.json());
    }
  }
}