import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {ActivatedRoute,Router} from '@angular/router';
import {StorageService} from '../storage/storage.service';
import {environment} from '../../environments/environment';
import {ToasterModule, ToasterService, ToasterConfig, Toast} from 'angular2-toaster';
import {ProductService} from '../product/product.service';
import {MessageService} from '../message/message.service';
import {CartService} from '../cart/cart.service';

declare var jquery:any;
declare var $ :any;

@Injectable()
export class WishlistService {
  cusToken;
  wishListItemTemp: any = [];
  wishListItem: any = [];
  wishList:any=[];
  products:any=[];
  constructor(public http: Http, private storageService: StorageService, private productService: ProductService, private messageService: MessageService,private router :Router,private cartService: CartService) {
    this.storageService.getCustomerCartId().subscribe((custoken) => {
      if (custoken != "" && custoken != null) {
        this.cusToken = custoken;
      }
    });
  }

  getWishListItems(customerId) {
    return this.http.get(environment.context_root + '/wishlist/' + customerId)
      .map(res => res.json());
  }
  
  addToWishList(productId, customer_id) {
    this.http.post(environment.context_root + "/wishlist/additem", {
      "wishlistItem": {
        productId: productId,
        customerId: customer_id
      }
    })
      .subscribe(
      res => {
        console.log(res);
        if (res.json() == true) {
          var success = "Wishlist item added successfully";
          this.messageService.popToastSuccess(success);
          this.getWishListItems(customer_id).subscribe((data) => {
            this.wishListUpdateDetails(data);
          });
        } else {
          this.messageService.popToastError();
        }
      },
      err => {
        console.log("Error occured in add to wishlist ");
        this.messageService.popToastError();
      }
      );
  }
  
  deleteWishList(WishlistItemId, customer_Id) {
    var wish = {
      "wishlistItem": {
        WishlistItemId: WishlistItemId,
        customerId: customer_Id
      }
    };
    return this.http.post(environment.context_root + '/wishlist/deleteItem', wish)
      .map(res => res.json());
  }
  
  wishListUpdateDetails(data) {
    this.wishListItemTemp = [];
    this.wishListItem = [];
    if (!data.length) {
      this.storageService.setWishListItems(this.wishListItemTemp);
    } else {
      for (let i = 0; i < data.length; i++) {
        this.productService.getProduct(data[i].productSKU).subscribe((product) => {
          product.productSKU = data[i].productSKU;
          product.productName = data[i].productName;
          product.productId = data[i].productId;
          product.WishlistItemId = data[i].WishlistItemId;
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
          product.weight = product.weight;
          product.actual_price = product.actual_price;
          this.wishListItemTemp.push(product);
          this.wishListItem.push(product);
          this.storageService.setWishListItems(this.wishListItemTemp);
        });
      }
    }
  }
  
  
  addItemToWish(productId, type_id) {
    this.storageService.getCustomerId().subscribe((customer_Id) => {
      if (customer_Id != "" && customer_Id != null) {
        if ($('#wishlistId' + productId).hasClass("glyphicon glyphicon-heart") || $('#wishlistId' + productId).hasClass("glyphicon ng-star-inserted glyphicon-heart")) {
          this.storageService.getWishListItems().subscribe((list) => {
            for (var i = 0; i < list.length; i++) {
              if (list[i].productId == productId) {
                this.deleteWishList(list[i].WishlistItemId, customer_Id).subscribe((res) => {
                  if (res == true) {
                    this.messageService.wishListDeleteToast();
                    this.wishListUnSelected(productId, type_id);
                    $("#quickview_close").click();
                    this.getWishListItems(customer_Id).subscribe((list) => {
                      this.storageService.setWishListItems(list);
                    });
                  } else {
                    this.messageService.popToastError();
                  }
                });
              }
            }
          });
        } else {
          this.addToWishList(productId, customer_Id);
          this.wishListSelected(productId, type_id);
          $("#quickview_close").click();
        }

      } else {
        this.storageService.setGeustWishList(productId);
        $("#quickview_close").click();
        this.messageService.popToastForRegister();
        this.router.navigate(['/registration']);
      }
    });
  }
  
  
  addItemConfigProductToWish(selectedProductAttribues, singleProduct, product) {
    this.storageService.getCustomerId().subscribe((customer_Id) => {
      if (this.cartService.configurableProductValidation(selectedProductAttribues) == true) {
        for (var i = 0; i < singleProduct.children.length; i++) {
          if ((singleProduct.children[i].colorValueCode == selectedProductAttribues.color) &&
            (singleProduct.children[i].sizeValueCode == selectedProductAttribues.size)) {
            console.log("Adding item to wishlist " + singleProduct.children[i].sku);
            //selectedProductAttribues = {};
            this.productService.getProduct(singleProduct.children[i].sku).subscribe((data) => {
              if (customer_Id != null && customer_Id != undefined && customer_Id != "") {
                this.addToWishList(data.productId, customer_Id);
                this.wishListSelected(product.sku, product.type_id);
                //singleProduct = {};
                $("#quickview_close").click();
              } else {
                this.storageService.setGeustWishList(data.productId);
                $("#quickview_close").click();
                this.messageService.popToastForRegister();
                this.router.navigate(['/registration']);
              }
            });
          }
        }
      }
    });
  }
  
  removeConfigrableProductSelected(sku, product, customer_Id, list) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].sku == sku) {
        this.deleteWishList(list[i].WishlistItemId, customer_Id).subscribe((res) => {
          if (res == true) {
            this.messageService.wishListDeleteToast();
            this.wishListUnSelected(sku,product.type_id);
            $("#quickview_close").click();
            this.getWishListItems(customer_Id).subscribe((list) => {
              this.storageService.setWishListItems(list);
            });
          } else {
            this.messageService.popToastError();
          }
        });
      }
    }
  }
  
  wishListSelected(productId, productType) {
    if (productType == 'simple') {
      $('#wishlistId' + productId).removeClass("glyphicon-heart-empty");
      $('#wishlistId' + productId).addClass("glyphicon-heart");
    } else {
      var sku = productId;
      $('#wishlistname' + sku).removeClass("glyphicon-heart-empty");
      $('#wishlistname' + sku).addClass("glyphicon-heart");
    }
  }
  
  wishListUnSelected(productId, productType) {
    if (productType == 'simple') {
      $('#wishlistId' + productId).removeClass("glyphicon-heart");
      $('#wishlistId' + productId).addClass("glyphicon-heart-empty");
    } else {
      var sku=productId;
      $('#wishlistname' + sku).removeClass("glyphicon-heart");
      $('#wishlistname' + sku).addClass("glyphicon-heart-empty");
    }
  }
  
  
  productCheckInWishList(products) {
    this.products = products;
    this.storageService.getWishListItems().subscribe((list) => {
      this.wishList = list;
      if (this.wishList !=null) {  
        var listofId = [];
        var listOfnonConfigId = [];
        for (var l = 0; l < this.wishList.length; l++) {
          if (this.wishList[l].type_id == 'configurable') {
            listofId.push(this.wishList[l]);
          } else {
            listOfnonConfigId.push(parseInt(this.wishList[l].productId));
          }
        }

        for (var i = 0; i < this.products.length; i++) {
          if (this.products[i].type_id == 'simple') {
            if (listOfnonConfigId.includes(this.products[i].productId)) {
              this.wishListSelected(this.products[i].productId, this.products[i].type_id);
            } else {
              this.wishListUnSelected(this.products[i].productId, this.products[i].type_id);
            }
          }
          if (this.products[i].type_id == 'configurable') {
            for (var j = 0; j < listofId.length; j++) {
              if (this.products[i].sku == listofId[j].sku) {
                this.wishListSelected(this.products[i].sku, this.products[i].type_id);
              } else {
                this.wishListUnSelected(this.products[i].sku, this.products[i].type_id);
              }
            }
          }
        }
      }
    });
  }

}