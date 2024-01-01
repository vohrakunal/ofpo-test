import { environment } from '../../environments/environment';
import { Component, OnInit,ViewChild, ElementRef} from '@angular/core';
import {Http} from '@angular/http';
import { NgForm , FormBuilder, FormGroup, Validators,ReactiveFormsModule,AbstractControl ,FormControl } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../cart/cart.service';
import {StorageService} from '../storage/storage.service';
import {MenuService} from '../menu/menu.service';
import {ProductService} from '../product/product.service';
import { MessageService} from '../message/message.service';
import {CheckoutService} from '../checkout/checkout.service';
import {SpinnerService} from '../spinner/spinner.service';
import {ToasterModule, ToasterService, ToasterConfig, Toast} from 'angular2-toaster';
declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private owlf1:boolean = true;
  @ViewChild('owl1')owl1:ElementRef;
  @ViewChild('prdDesc')prdDesc:ElementRef;
  cartItems:any = [];
  subTotal:number;
  subTotalValue:number;
  categoryId:any="";
  public cardId:any = null;
  cartItemsData:any = [];
  singleProduct:any = {};
  selectedProductAttribues:any = {};
  itemId :any={};
  addAnotherSize:boolean;
  editSize:any = {};
  editColor:any = {};
  editItem:any={};
  cusToken;
  countryId;
  shippingEstimate:any=[];
  shippingTemp:any=[];
  shippingTempNew:any=[];
  totalshiiping:number;
  standardTotal:number;
  expeditedTotal:number;
  shippingForm: FormGroup;
  standardShipping: boolean;
  expeditedShipping: boolean;
  
  constructor(private cartService: CartService, private http: Http, private checkoutService: CheckoutService, public formBuilder: FormBuilder,private spinnerService: SpinnerService,
    private storageService: StorageService, private menuService: MenuService, private productService: ProductService, private route: ActivatedRoute, private messageService: MessageService) {
    this.addAnotherSize = false;
    this.standardShipping=false;
    this.expeditedShipping=false;
  }
    
  ngOnInit() {
      this.storageService.getCartItems().subscribe((items) => {
          this.cartItems = items;
          this.cartItemsData = this.cartItems;
          this.subTotalValue = 0;
          for (var i = 0; i < this.cartItemsData.length; i++) {
              this.subTotalValue = this.subTotalValue + this.cartItemsData[i].price * this.cartItemsData[i].quantity;
          }
          this.subTotal = this.subTotalValue;
      });

      this.storageService.getCategoryId().subscribe((id) => {
          this.categoryId = id;
      });
      this.storageService.getCartId().subscribe((cardId) => {
          this.cardId = cardId;
      });

      $('.minicart').click(function() {
          $(".minicart").fadeOut(1000);
      });

      this.storageService.getCustomerCartId().subscribe((custoken) => {
          this.cusToken = custoken;
      });
      this.shippingForm = this.formBuilder.group({
          standardShipping: ['', Validators.compose([Validators.nullValidator])],
          expeditedShipping: ['', Validators.compose([Validators.nullValidator])],
          standardChecked: ['', Validators.compose([Validators.nullValidator])],
          expeditedChecked: ['', Validators.compose([Validators.nullValidator])]
      });
  }
  
  deleteCartItem(itemId) {
      this.fadeOut();
      console.log("ItemId" + itemId);
      this.spinnerService.start();
      if (this.cusToken != undefined && this.cusToken != '') {
          this.cartService.removeCustomerCartItem(this.cusToken, itemId).subscribe((cartResponse) => {
              this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
                  this.getItemsFromcart(data);
              });
              var message = "Cart item deleted successfully.";
              this.messageService.popToastSuccess(message);
          });
      } else {
          this.cartService.removeCartItem(this.cardId, itemId).subscribe((cartResponse) => {
              this.cartService.getCartItems(this.cardId).subscribe((data) => {
                  this.getItemsFromcart(data);
              });
              var message = "Cart item deleted successfully.";
              this.messageService.popToastSuccess(message);
          });
      }
  }
  
  getItemsFromcart(data) {
    var token = this.cardId;
    console.log("token  ------------------++++++++++" + token);
    this.cartItems = [];
    this.cartItemsData=[];
    //this.cartService.getCartItems(token).subscribe((data) => {
      if (data.length == 0) {
        this.storageService.setCartItems(this.cartItems);
        this.subTotal=0;
        this.spinnerService.end();  
      } else {
        this.subTotal=0;
        for (let i = 0; i < data.length; i++) {
          let stringToSplit = data[i].sku;
          var skuName = stringToSplit.substr(0, stringToSplit.indexOf(' '));
          if (skuName == "") {
            skuName = data[i].sku;
          }
          this.productService.getProduct(skuName).subscribe((product) => {
            product.quantity = data[i].qty;
            product.itemId = data[i].item_id;
            
            product.weight =data[i].weight;
            product.actual_price =data[i].actual_price;
            product.type_id = product.type_id;
            
            product.sku = data[i].sku;
            product.name = data[i].name;
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
            this.cartItems.push(product);
            this.cartItemsData.push(product);
            this.storageService.setCartItems(this.cartItems);
            this.subTotal= this.subTotal + product.price * data[i].qty;
          });
        }
          this.spinnerService.end();
      }
    //});
  }
  
  updateQuantity(cartData) {
    this.fadeOut();
    this.spinnerService.start();  
    if(cartData.quantity == "0"){
      this.cartItems = [];
      this.cartItemsData=[];
      if (this.cusToken != undefined && this.cusToken != '') {
          this.cartService.removeCustomerCartItem(this.cusToken, cartData.itemId).subscribe((cartResponse) => {
              this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
                  this.getItemsFromcart(data);
              });
          });
      } else {
          this.cartService.removeCartItem(this.cardId, cartData.itemId).subscribe((cartResponse) => {
              this.cartService.getCartItems(this.cardId).subscribe((data) => {
                  this.getItemsFromcart(data);
              });
          });
      }
      var message = "Cart item deleted successfully.";
      return this.messageService.popToastSuccess(message);
    }
    if (cartData.quantity == "") {
    }else{
      
      if (this.cusToken != undefined && this.cusToken !='') {
        this.storageService.getCartId().subscribe((cardId) => {
          this.cardId = cardId;
          this.http.put(environment.context_root + '/customercart/updateCart/' + this.cusToken + '/' + cartData.itemId, {
            "cartItem": {
              sku: cartData.sku,
              qty: cartData.quantity,
              quote_id: this.cardId
            }
          })
            .subscribe(
            res => {
              console.log(res);
              if (res.status == 200) {
                  this.spinnerService.end();
                  var errorMessageSize = "This product quntity not avilable.";
                  return this.messageService.validationError(errorMessageSize);
              } else {
                  this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
                      var message = "Quantity updated successfully.";
                      this.spinnerService.end();
                      this.updateInCart(data, message);

                  });
              }
            },
            err => {
              console.log("Error occured");
              this.messageService.popToastError();
            }
            );
        });
      }
      else {
        this.storageService.getCartId().subscribe((cardId) => {
          this.cardId = cardId;
          this.http.put(environment.context_root + '/guestcart/updateCart/' + this.cardId + '/' + cartData.itemId, {
            "cartItem": {
              sku: cartData.sku,
              qty: cartData.quantity,
              quote_id: this.cardId
            }
          })
            .subscribe(
            res => {
              console.log(res);
              if (res.status == 200) {
                  this.spinnerService.end();
                  var errorMessageSize = "This product quntity not avilable.";
                  return this.messageService.validationError(errorMessageSize);
              } else {
                  this.cartService.getCartItems(this.cardId).subscribe((data) => {
                      var message = "Quantity updated successfully.";
                      this.spinnerService.end();
                      this.updateInCart(data, message);

                  });
              }    
            },
            err => {
              console.log("Error occured");
              this.messageService.popToastError();
            }
            );
        });
      }
    }
  }
  
  initOwlProd(){
     console.log($(this.owl1.nativeElement));
       $(this.owl1.nativeElement).owlCarousel({
      nav:true,
      items:1,
      navigation:true,
      navigationText:['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>'],
      itemsMobile:true,
      });

      this.owlf1 = true;
  }

  ngAfterViewChecked(){
    if(!this.owlf1){
      this.initOwlProd();
    }

  }
  
  closeModal() {
    $("#owl-demo").owlCarousel('destroy');
  }
  
  getProductDetails = function(sku: string, itemId, addSize, item) {
    this.fadeOut();
    this.addAnotherSize = addSize;
    this.itemId = itemId;
    this.editSize.sizeCode = item.size;
    this.editColor.color = item.color;
    this.editItem = item;

    this.singleProduct = {};
    let stringToSplit = sku;
    var skuName = stringToSplit.substr(0, stringToSplit.indexOf(' '));
    if (skuName == "") {
      skuName = sku;
    }
    console.log("stringToSplit[0]" + stringToSplit.substr(0, stringToSplit.indexOf(' ')));
    this.productService.getProduct(skuName).subscribe((data) => {
      this.singleProduct = data;
      for (var i = 0; i < this.singleProduct.sizeOptions.length; i++) {
        if (this.singleProduct.sizeOptions[i].sizeCode == this.editSize.sizeCode) {
          this.editSize.valueCode = this.singleProduct.sizeOptions[i].valueCode;
        }
      }
      for (var j = 0; j < this.singleProduct.colorOptions.length; j++) {
        if (this.singleProduct.colorOptions[j].colorCode == this.editColor.color) {
          this.editColor.valueCode = this.singleProduct.colorOptions[j].valueCode;
        }
      }

      this.prdDesc.nativeElement.innerHTML = "";
      var description = this.singleProduct.description;
      if (description != undefined) {
        this.prdDesc.nativeElement.insertAdjacentHTML('beforeend', this.singleProduct.description);
      }
      this.owlf1 = false;
    });
  }
  
  setSelectedSize = function(valueCode: number) {
    if (this.addAnotherSize) {
      this.selectedProductAttribues.size = valueCode;
      this.addItemToCart();
    } else {
      this.selectedProductAttribues.size = valueCode;
    }
  }
  
  setSelectedColor = function(valueCode: number) {
    this.selectedProductAttribues.color = valueCode;
  }
 
  
  addItemToCart = function() {
    if (this.singleProduct.type_id == 'configurable') {
      if (this.selectedProductAttribues.size == null || this.selectedProductAttribues.size == undefined) {
        var errorMessageSize = "Size is not selected";
        return this.messageService.validationError(errorMessageSize);
      }
      for (var i = 0; i < this.singleProduct.children.length; i++) {
        if ((this.singleProduct.children[i].sizeValueCode == this.selectedProductAttribues.size)) {
          console.log("Adding item to cart " + this.singleProduct.children[i].sku);
          //this.cartService.addItemToCart(this.singleProduct.children[i].sku, 1, this.singleProduct);
          var skuName=this.singleProduct.children[i].sku;
          let cartItems = [];
          this.storageService.getCartId().subscribe((token) => {
            
            if (this.cusToken != undefined && this.cusToken !='') {
              this.storageService.getCartItems().subscribe((data) => {
                if (data !== undefined && data !== null) {
                  cartItems = data;
                  this.http.post(environment.context_root + '/customercart/additem/' + this.cusToken, {
                    "cartItem": {
                      sku: skuName,
                      qty: 1,
                      quote_id: token
                    }
                  })
                    .subscribe(
                    res => {
                      console.log(res);
                      this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
                        var message = "Product added successfully.";
                        this.updateInCart(data,message);
                      });
                    },
                    err => {
                      console.log("Error occured");
                      this.messageService.popToastError();
                    }
                    );
                }
              });
            } else {
              this.storageService.getCartItems().subscribe((data) => {
                if (data !== undefined && data !== null) {
                  cartItems = data;
                  this.http.post(environment.context_root + '/guestcart/additem', {
                    "cartItem": {
                      sku: skuName,
                      qty: 1,
                      quote_id: token
                    }
                  })
                    .subscribe(
                    res => {
                      console.log(res);
                      this.cartService.getCartItems(token).subscribe((data) => {
                        var message = "Product added successfully.";
                        this.updateInCart(data,message);
                      });
                    },
                    err => {
                      console.log("Error occured");
                      this.messageService.popToastError();
                    }
                    );
                }
              });
            }
            
          });
          this.selectedProductAttribues = {};
          $("#quickview_close").click();
          
        }
      }
    }
    
  }
    
  updateInCart(data,message) {
    this.subTotal = 0;
    var cartItems = [];
    this.cartItemsData = [];
    for (let i = 0; i < data.length; i++) {
      let stringToSplit = data[i].sku;
      var skuName = stringToSplit.substr(0, stringToSplit.indexOf(' '));
      if (skuName == "") {
        skuName = data[i].sku;
      }
      this.productService.getProduct(skuName).subscribe((product) => {
        product.quantity = data[i].qty;
        product.itemId = data[i].item_id;
        product.type_id = product.type_id;
        
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
        product.sku=data[i].sku;
        product.name=data[i].name;
        console.log("product.type_id" + product.type_id);
        product.weight = product.weight;
        product.actual_price = product.actual_price;
        cartItems.push(product);
        this.cartItemsData.push(product)
        this.storageService.setCartItems(cartItems);
        this.subTotal = this.subTotal + product.price * data[i].qty;
      });
    }
    this.messageService.popToastSuccess(message);
  }  
    
    
  updateCartItem(cartData) {
    if (this.selectedProductAttribues.color == undefined) {
      this.selectedProductAttribues.color = this.editColor.valueCode;
    }
    if (this.selectedProductAttribues.size == undefined) {
      this.selectedProductAttribues.size = this.editSize.valueCode;
    }
    for (var i = 0; i < this.singleProduct.children.length; i++) {
      if ((this.singleProduct.children[i].colorValueCode == this.selectedProductAttribues.color) &&
        (this.singleProduct.children[i].sizeValueCode == this.selectedProductAttribues.size)) {

        if(this.selectedProductAttribues.size != this.editSize.valueCode || this.selectedProductAttribues.color !=this.editColor.valueCode){
        if (this.cusToken != undefined && this.cusToken !='') {
          this.cartService.removeCustomerCartItem(this.cusToken, this.itemId).subscribe((cartResponse) => {
            this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
              this.getItemsFromcart(data);
            });
          });
        } else {
          this.cartService.removeCartItem(this.cardId, this.itemId).subscribe((cartResponse) => {
            this.cartService.getCartItems(this.cardId).subscribe((data) => {
              this.getItemsFromcart(data);
            });
          });
        }  
        console.log("updateItem " + this.singleProduct.children[i].sku);
        this.cartService.addItemToCart(this.singleProduct.children[i].sku, this.editItem.quantity, this.singleProduct);
        this.selectedProductAttribues = {};
        }else{
          var message = "Product added successfully.";
          this.messageService.popToastSuccess(message);
        }
          
      }
    }
    $("#quickview_close1").click();
  }
    
  fadeOut(){
    $(".minicart").fadeOut(1000);
  }  
 
}