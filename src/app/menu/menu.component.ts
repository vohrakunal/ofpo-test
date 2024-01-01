import { Component, OnInit } from '@angular/core';
import {MenuService} from './menu.service';
import {ProductService} from '../product/product.service';
import {StorageService} from '../storage/storage.service';
import {CartService} from '../cart/cart.service';
import {ActivatedRoute,Router, NavigationExtras} from '@angular/router';
declare var jquery:any;
declare var $ :any;
import {NgForm, NgModel, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl} from '@angular/forms';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems:Menu[];
  cartItems:any = [];
  public cardId:any = null;
  subTotal:number;
  subTotalValue:number;
  categoryId:any = "";
  cusToken;
  sercahName;
  searchForm: FormGroup;
  submitAttempt;
  //storeCredit:number;  
  
  constructor(private menuService : MenuService,  private productService : ProductService ,
          private storageService : StorageService ,private router :Router,
            private cartService: CartService,private route : ActivatedRoute,private formBuilder: FormBuilder) { 
    
    this.searchForm = formBuilder.group({
      sercahName: ['', Validators.compose([Validators.required, Validators.required])],
    });
    
    this.submitAttempt=false;
    
    this.storageService.getCategoryId().subscribe((id) =>{
      this.categoryId=id;
    });
  	
    this.menuService.getMenu().subscribe((menuItems) =>{
        this.menuItems = menuItems;
    });
       
    this.route.paramMap.subscribe((params) => {
        if (params.get('categoryId') != null) {
            this.categoryId = params.get('categoryId');
        }
    });

    this.storageService.getCustomerCartId().subscribe((Custoken) => {
        if (Custoken != "" && Custoken != null) {
            this.cusToken = Custoken;
            } 
     });
    
     if (this.cusToken == undefined) {
       this.storageService.getCartId().subscribe((cardId) => {
         console.log("cardId + " + cardId);
         if (cardId === null || cardId == '') {
           this.menuService.initializeCart().subscribe((data) => {
             this.storageService.setCartId(data);
             this.cartService.getCartItems(cardId).subscribe((data) => {
             this.getItemsFromcart(data);
             this.cardId = data;
             console.log("initializeCart + " + this.cardId);
             });   
           });
         } else {
           this.cartService.getCartItems(cardId).subscribe((data) => {
           this.cardId = cardId;
           console.log("else block cardId + " + cardId);
           this.getItemsFromcart(data);
           });   
         }
       });
     } else {
       this.storageService.getCartId().subscribe((cardId) => {
         console.log("cardId + " + cardId);
         if (cardId === null || cardId == '') {
           this.menuService.initializeCustomerCart(this.cusToken).subscribe((data) => {
             this.storageService.setCartId(data);
             this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
               this.getItemsFromcart(data);
               this.cardId = data;
               console.log("initializeCustomerCart + " + this.cardId);
             });
           });
         } else {
           this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
             this.cardId = cardId;
             console.log("else block cardId + " + cardId);
             this.getItemsFromcart(data);
           });
         }
       });
     }
  }

  ngOnInit() {
  }

  getItemsFromcart(data) {
    var token = this.cardId;
    //console.log("token  ------------------++++++++++" + token);
    this.cartItems = [];
    //this.cartService.getCartItems(token).subscribe((data) => {
    for (let i = 0; i < data.length; i++) {
      let stringToSplit = data[i].sku;
      var skuName = stringToSplit.substr(0, stringToSplit.indexOf(' '));
      if (skuName == "") {
        skuName = data[i].sku;
      }
      this.productService.getProduct(skuName).subscribe((product) => {
        product.quantity = data[i].qty;
        product.itemId = data[i].item_id;
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
        console.log("product.itemId" + product.itemId);
        this.cartItems.push(product);
        this.storageService.setCartItems(this.cartItems);
      });
    }
    //});
  }

  getLocalCart() {
    this.storageService.getCartItems().subscribe((data) => {
      this.cartItems = data;
      $(".minicart").fadeToggle(1000);
      this.subTotalValue = 0;
      for (var i = 0; i < this.cartItems.length; i++) {
        this.subTotalValue = this.subTotalValue + this.cartItems[i].price * this.cartItems[i].quantity;;
      }
      this.subTotal = this.subTotalValue;
    });
  }
  
  myAccount() {
    $(".minicart").fadeOut(1000);
    this.storageService.getCustomerCartId().subscribe((custoken) => {
        if (custoken != "" && custoken != null && custoken != undefined) {
            this.router.navigate(['/myaccount']);
        } else {
            //this.router.navigate(['/login','reload']);
            this.router.navigate(['/landing']);
        }
    });        
  }
  
  fadeOut() {
    $(".minicart").fadeOut(1000);
  }
  
  fetchProductsForCat = function(category: number, name: string) {
    console.log("Selected category " + category);
    this.categoryId = category;
    this.storageService.setCategoryId(this.categoryId);
    if (name == "BRANDS") {
      this.router.navigate(['/brands', this.categoryId]);
    } else {
      this.router.navigate(['/home', this.categoryId]);
    }
  }
  
  serach() {
    if (!this.searchForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      console.log("success! success! success!");
      console.log(this.searchForm.value);
      event.preventDefault();
      this.router.navigate(['/home', this.categoryId, this.sercahName]);
    }
  }
    
  gotoHome(){
    this.storageService.getCategoryId().subscribe((id) => {
        this.categoryId = id;
        this.router.navigate(['/home', this.categoryId]);
    });  
  }    
}

interface Menu {
  id : number;
  name : string;
  is_active : boolean;
}
