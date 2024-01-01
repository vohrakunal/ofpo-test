import {Injectable} from '@angular/core';
import {LocalStorage} from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class StorageService {

  cartId: string;
  private subject = new Subject<any>();

  constructor(protected localStorage: LocalStorage) {

  }

  setCartId(token: string) {
    //console.log("first time" + token);
    this.localStorage.setItem('cartId', token).subscribe(() => {});
  }

  getCartId() {
    return this.localStorage.getItem<string>('cartId');
  }

  setCartItems(items: any) {
    this.localStorage.setItem('cartItems', items).subscribe(() => {});
  }

  getCartItems() {
    // console.log(this.localStorage.getItem<any>('cartItems'));
    return this.localStorage.getItem<any>('cartItems');

  }

  setCategoryId(id) {
    this.localStorage.setItem('categoryId', id).subscribe(() => {});
  }

  getCategoryId() {
    return this.localStorage.getItem('categoryId');
  }

  setHomeDirection(value: boolean) {
    this.localStorage.setItem('homeDirection', value).subscribe(() => {});
  }

  getHomeDirection() {
    return this.localStorage.getItem('homeDirection');
  }

  setProductDirection(value: boolean) {
    this.localStorage.setItem('productDirection', value).subscribe(() => {});
  }

  getProductDirection() {
    return this.localStorage.getItem('productDirection');
  }

  setFooterDirection(value: boolean) {
    this.localStorage.setItem('footerDirection', value).subscribe(() => {});
  }

  getFooterDirection() {
    return this.localStorage.getItem('footerDirection');
  }

  setCustomerCartId(token: string) {
    this.localStorage.setItem('customerCartId', token).subscribe(() => {});
  }

  getCustomerCartId() {
    return this.localStorage.getItem<string>('customerCartId');
  }

  setSocialFlag(value: boolean) {
    this.localStorage.setItem('socialFlag', value).subscribe(() => {});
  }

  getSocialFlag() {
    return this.localStorage.getItem('socialFlag');
  }

  setLogout(value: boolean) {
    this.localStorage.setItem('logout', value).subscribe(() => {});
  }

  getLogout() {
    return this.localStorage.getItem('logout');
  }

  setWishListItems(items: any) {
    this.localStorage.setItem('wishListItems', items).subscribe(() => {});
  }

  getWishListItems() {
    return this.localStorage.getItem<any>('wishListItems');
  }
  
  setCustomerId(token: string) {
    this.localStorage.setItem('customerId', token).subscribe(() => {});
  }

  getCustomerId() {
    return this.localStorage.getItem<string>('customerId');
  }
  
  setGeustWishList(productid: string) {
    this.localStorage.setItem('productId', productid).subscribe(() => {});
  }

  getGeustWishList() {
    return this.localStorage.getItem<string>('productId');
  }
  
  getStoreCredit() {
    return this.localStorage.getItem('storeCredit');
  }

  setStoreCredit(value) {
    this.localStorage.setItem('storeCredit', value).subscribe(() => {});
  }
    
  setNewsLetter(value: boolean) {
    this.localStorage.setItem('newsLetter', value).subscribe(() => {
      this.subject.next({ subscribed : value });
    });
  }

  getNewsLetter() {
    return this.localStorage.getItem('newsLetter');
  } 
  
  getNewsLetterAsync(): Observable<any> {
    return this.subject.asObservable();
}
    
    
} 
