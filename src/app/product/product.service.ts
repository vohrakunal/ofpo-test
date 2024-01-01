import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from '../../environments/environment';


@Injectable()
export class ProductService {

  constructor(public http: Http) {}

  getProduct(sku) {
    return this.http.get(environment.context_root + '/product/' + sku)
      .map(res => res.json());
  }

  getRelatedProducts(brand, categoryId, sku) {
    return this.http.get(environment.context_root + '/relatedProducts/' + brand + '/' + categoryId + '/' + sku)
      .map(res => res.json());
  }

  getRelatedProductsSecondary(brand, categoryId, sku) {
    return this.http.get(environment.context_root + '/relatedProductsSecondary/' + brand + '/' + categoryId + '/' + sku)
      .map(res => res.json());
  }

  getBrand(brandName: string) {
    return this.http.get(environment.context_root + '/brands/'+ brandName)
      .map(res => res.json());
  }
}