import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {StorageService} from '../storage/storage.service';
import { environment } from '../../environments/environment'; 
import {ToasterModule, ToasterService, ToasterConfig, Toast} from 'angular2-toaster';
import {ProductService} from '../product/product.service';
import { MessageService} from '../message/message.service';
import {SpinnerService} from '../spinner/spinner.service';

declare var jquery:any;
declare var $ :any;

@Injectable()
export class CartService {
  cusToken;
  constructor(public http : Http , private storageService : StorageService,private productService : ProductService, private messageService :MessageService,private spinnerService: SpinnerService) { 
    this.storageService.getCustomerCartId().subscribe((custoken) => {
      if (custoken != "" && custoken != null) {
        this.cusToken = custoken;
      }
    });
  }

  addItemToCart(skuSelected:string , quantity:number , product){
    
    let cartItems = [];
    this.storageService.getCartId().subscribe((token) =>{
      this.storageService.getCartItems().subscribe((data) => {
        if(data !== undefined && data !== null)
        cartItems = data;
        this.spinnerService.start();  
        this.addItemToGuestCart(skuSelected , quantity , token , cartItems , product);
        });
    });
  }
  
  addItemToGuestCart(skuSelected:string , quantity:number , token , cartItems , product){
    console.log("tokenid is" +token);
    this.storageService.getCustomerCartId().subscribe((custoken) => {
      if (custoken != "" && custoken != null && custoken !=undefined) {
        this.cusToken = custoken;
        this.http.post(environment.context_root + "/customercart/additem/" + this.cusToken, {
          "cartItem": {
            sku: skuSelected,
            qty: quantity,
            quote_id: token
          }
        })
          .subscribe(
          res => {
            console.log(res);
            if(res.status == 200){
               this.spinnerService.end();
               var errorMessageSize = "Product is out of stock";
               return this.messageService.validationError(errorMessageSize);
            }else{
              this.getCustomerCartItems(this.cusToken).subscribe((data) => {
              this.updateInCart(data);
            });    
           }
          },
          err => {
            console.log("Error occured");
            this.messageService.popToastError();
          }
          );
      }
      else {
        this.http.post(environment.context_root + '/guestcart/additem', {
          "cartItem": {
            sku: skuSelected,
            qty: quantity,
            quote_id: token
          }
        })
          .subscribe(
          res => {
              console.log(res);
              if (res.status == 200) {
                  this.spinnerService.end();
                  var errorMessageSize = "Product is out of stock";
                  return this.messageService.validationError(errorMessageSize);
              } else {
                  this.getCartItems(token).subscribe((data) => {
                      this.updateInCart(data);
                  });
              }
          },
          err => {
            console.log("Error occured");
            this.messageService.popToastError();
          }
          );
      }
    });
  }

  getCartItems(token: string) {
    return this.http.get(environment.context_root + '/guestcart/getItems/' + token)
      .map(res => res.json());
  }

  getCountries() {
    return this.http.get(environment.context_root + '/countries')
      .map(res => res.json());
  }

  getCountry(c) {
    return this.http.get(environment.context_root + '/country/' + c)
      .map(res => res.json());
  }

  removeCartItem(quoteId, itemId) {
    return this.http.get(environment.context_root + '/guestcart/deleteItem/' + quoteId + '/' + itemId)
      .map(res => res);
  }
  
  removeCustomerCartItem(cusToken, itemId) {
    return this.http.get(environment.context_root + '/customercart/deleteItem/' + cusToken + '/' + itemId)
      .map(res => res);
  }
  
  getCustomerCartItems(custoken) {
    return this.http.get(environment.context_root + '/customercart/getItems/' + custoken)
      .map(res => res.json());
  }
  
  updateInCart(data) {
    var cartItems = [];
    for (let i = 0; i < data.length; i++) {
      let stringToSplit = data[i].sku;
      var skuName=stringToSplit.substr(0,stringToSplit.indexOf(' '));
      if(skuName == ""){
        skuName= data[i].sku;
      }
      console.log("skuName" +skuName );
      this.productService.getProduct(skuName).subscribe((product) => {
        product.quantity = data[i].qty;
        product.itemId = data[i].item_id;
        product.sku=data[i].sku;
        product.name=data[i].name;
        if (product.type_id == 'configurable') {
          for (var j = 0; j < product.children.length; j++) {
            if (product.children[j].sku == data[i].sku) {
              for (var k = 0; k < product.sizeOptions.length; k++) {
                if (product.children[j].sizeValueCode == product.sizeOptions[k].valueCode) {
                  product.size = product.sizeOptions[k].sizeCode;
                }
              }

              for (var l = 0; l < product.colorOptions.length; l++) {
                if (product.children[j].colorValueCode == product.colorOptions[l].valueCode) {
                  product.color = product.colorOptions[l].colorCode;
                }
              }
            }
          }
        }
        product.type_id = product.type_id;
        console.log("product.type_id" + product.type_id);
        product.weight = product.weight;
        product.actual_price = product.actual_price;
        cartItems.push(product);
        this.storageService.setCartItems(cartItems);
      });
    }
    this.spinnerService.end();    
    var message = "Product added successfully.";
    this.messageService.popToastSuccess(message);
  }
  
  configurableProductValidation(selectedProductAttribues) {
    if (selectedProductAttribues.size == null || selectedProductAttribues.size == undefined) {
      var errorMessageSize = "Size is not selected";
      return this.messageService.validationError(errorMessageSize);
    }
    if (selectedProductAttribues.color == null || selectedProductAttribues.color == undefined) {
      var errorMessageColor = "Color is not selected";
      return this.messageService.validationError(errorMessageColor);
    }
    if (selectedProductAttribues.size != null && selectedProductAttribues.size != undefined && selectedProductAttribues.size != "" && selectedProductAttribues.color != null && selectedProductAttribues.color != undefined && selectedProductAttribues.color != "") {
      return true;
    }
  }
  
  
}