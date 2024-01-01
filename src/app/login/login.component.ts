import {Component, OnInit} from '@angular/core';
import {NgForm, NgModel, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl} from '@angular/forms';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {ActivatedRoute,Router} from '@angular/router';
import { AuthService } from "angular2-social-login";
import { CookieService } from 'ngx-cookie-service';
declare var jquery: any;
declare var $: any;

import {SpinnerService} from '../spinner/spinner.service';
import {CartService} from '../cart/cart.service';
import {WishlistService} from '../wishlist/wishlist.service';
import {MyAccountService} from '../myaccount/myaccount.service';
import {StorageService} from '../storage/storage.service';
import { environment } from '../../environments/environment';
import { MessageService} from '../message/message.service'; 
import {MenuService} from '../menu/menu.service';
import {ProductService} from '../product/product.service';
import {LoginService} from '../login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    
  loginForm: FormGroup;
  loginData:any={};
  submitAttempt: boolean = false;
  cusToken;
  cardId;
  categoryId:any = "";
  submitted;
  submittedher;
  users;
  userRegister={};
  socialData:any={};
  customer_id;
  remember:boolean =false;  

  
  constructor(private formBuilder: FormBuilder, private storageService: StorageService, public http: Http,private messageService :MessageService,private router :Router,
      private menuService: MenuService, private cartService: CartService,
      private productService: ProductService, public _auth: AuthService,
      private spinnerService: SpinnerService,private wishlistService: WishlistService,private myAccountService: MyAccountService,
      private route: ActivatedRoute,private cookieService:CookieService , private loginService: LoginService) {
    this.loginForm = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      username: ['', Validators.compose([Validators.required, Validators.pattern(GlobalValidator.EMAIL_REGEX)])],
      remember: ['', Validators.compose([Validators.nullValidator])],
    });
    
    this.storageService.getCustomerCartId().subscribe((custoken) => {
        if (custoken != "" && custoken != null && custoken != undefined) {
            this.cusToken = custoken;
            this.storageService.getCategoryId().subscribe((categoryId) => {
                this.categoryId = categoryId;
            });
        }
    });

    this.storageService.getCartId().subscribe((cardId) => {
        this.cardId = cardId;
    });
      
    this.getrememberMe();
      
  }
  
  login() {
     this.spinnerService.start();
    if (!this.loginForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      this.spinnerService.end();
      return;
    } else {
      if (this.cusToken != undefined && this.cusToken != "" && this.cusToken != null) {
        var error = "You have already login";
        this.messageService.validationError(error);
        this.spinnerService.end();
        return this.router.navigate(['/home',this.categoryId]);
      }
      console.log("success! success! success!");
     
       //this.loginData.password = btoa(this.loginData.password);
            
      this.http.post(environment.context_root + '/login', this.loginData)
        .subscribe((res) => {
          if(res.json().message == "You did not sign in correctly or your account is temporarily disabled."){
            console.log("invalid User");
            var error="Invalid username and password";
            this.messageService.validationError(error);
            this.spinnerService.end();
          }else{
            this.addRememberMe();
            console.log("valid user");
            this.storageService.setCartId('');
            this.storageService.setCustomerCartId(res.json());
            this.storageService.setSocialFlag(false);
            this.storageService.setLogout(false);
            console.log("login user token" + res.json());
            var success = "Login successfully";
            this.messageService.popToastSuccess(success);
            this.loginData = {};
            this.submitted=false;
            this.submittedher=false;
            this.menuService.initializeCustomerCart(res.json()).subscribe((data) => {
              this.storageService.setCartId(data);
              this.getCustomerDetailsWithWishlist(res.json());
              if (this.cardId != undefined && this.cardId != null) {
                this.getGuestCartItemAssignToCustomer(res.json(), data,false);
              } else {
                this.cartService.getCustomerCartItems(res.json()).subscribe((cartdata) => {
                  this.updateInCart(cartdata,false);
                });
              }
              console.log("initializeCustomerCart + " + data);
            });
          }
        },
        err => {
          this.messageService.popToastError();
          this.spinnerService.end();
        });
    }
  }
    
  getrememberMe() {
      var flag = this.cookieService.get('cmVtZW1iZXI=');
      if (flag == "true") {
          this.loginData.username = this.cookieService.get('dXNlcm5hbWU=');
          //this.loginData.password = atob(this.cookieService.get('cGFzc3dvcmQ='));
          this.loginData.password = this.cookieService.get('cGFzc3dvcmQ=');
          this.remember=true;
      }
  }
    
  rememberMe = function() {
      if (this.remember == false) {
          this.remember = true;
      } else {
          this.remember = false;
      }
  }   
    
  addRememberMe() {
    if (this.remember == true) {
          if (this.loginForm.valid) {
              console.log("Setting remember me in cookies");
              this.loginService.setRememberMe(this.loginData.username, this.loginData.password, this.remember);
          }
      }
  }
    
  
  getGuestCartItemAssignToCustomer(cusToken,customerId,socialflag) {
      this.cartService.getCartItems(this.cardId).subscribe((cartdata) => {
        if (!cartdata.length) {
          if (socialflag == false) {
            this.cartService.getCustomerCartItems(cusToken).subscribe((custdata) => {
              if (!custdata.length) {
                this.spinnerService.end();  
                this.router.navigate(['/home', this.categoryId]);
              } else {
                this.updateInCart(custdata, socialflag);
              }
            });
          } else {
            this.cartService.getCustomerCartItems(cusToken).subscribe((custdata) => {
              if (!custdata.length) {
                if (socialflag == false) {
                  this.spinnerService.end();    
                  this.router.navigate(['/home', this.categoryId]);
                } else {
                  console.log(" landing hide");
                  $('.langdingComponent').hide();
                  this.spinnerService.end();    
                  this.router.navigate(['/home',this.categoryId]);
                }
              } else {
                this.updateInCart(custdata, socialflag);
              }
            });
          }
        } else {
          for (var i = 0; i < cartdata.length; i++) {
            this.http.post(environment.context_root + "/customercart/additem/" + cusToken, {
              "cartItem": {
                sku: cartdata[i].sku,
                qty: cartdata[i].qty,
                quote_id: customerId
              }
            })
              .subscribe(
              res => {
                console.log(res);
                this.cartService.getCustomerCartItems(cusToken).subscribe((custdata) => {
                  this.updateInCart(custdata,socialflag);
                });
              },
              err => {
                console.log("Error occured");
                this.messageService.popToastError();
              });
          }
        }
      });
  }
  
  ngOnInit() {
    // $('.serach2').hide();
    // $('.myaccount').hide();
    // $('.navmenu').hide();
  }

  guestUser() {
    this.storageService.getCustomerCartId().subscribe((Custoken) => {
      this.cusToken = Custoken;
      this.storageService.setCustomerCartId('');
      this.storageService.setCartId('');
      this.storageService.setCustomerId('');
      var wishListItem = []
      this.storageService.setWishListItems(wishListItem);
      var cartItem = []
      this.storageService.setCartItems(cartItem);
      this.initializeCart();
    });
  }
  
  initializeCart() {
    this.menuService.initializeCart().subscribe((cardId) => {
      this.storageService.setCartId(cardId);
      this.cardId = cardId;
      console.log("geust initializeCart + " + this.cardId);
      this.cartService.getCartItems(cardId).subscribe((data) => {
        this.updateInCart(data,false);
      });
    });
  }
  
  updateInCart(data, socialflag) {
    var cartItems = [];
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
        product.weight = product.weight;
        product.actual_price = product.actual_price;
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
        product.sku = data[i].sku;
        product.name = data[i].name;
        cartItems.push(product);
        this.storageService.setCartItems(cartItems);
      });
    }
    if (socialflag == false) {
      this.spinnerService.end();  
      this.router.navigate(['/home', this.categoryId]);
    } else {
      console.log(" landing hide");
      $('.langdingComponent').hide();
      this.spinnerService.end();    
      this.router.navigate(['/home',this.categoryId]);
     }
  }
  
  register() {
    this.storageService.setGeustWishList('');
    this.router.navigate(['/registration']);
  }
  
  him() {
    this.storageService.getCategoryId().subscribe((category) => {
      if (category == "" || category == null) {
        this.storageService.setCategoryId(13);
        this.categoryId = 13;
      } else {
        this.categoryId = category;
      }
    });
  }

  her() {
    this.storageService.getCategoryId().subscribe((category) => {
      if (category == "" || category == null) {
        this.storageService.setCategoryId(14);
        this.categoryId = 14;
      } else {
        this.categoryId = category;
      }
    });
  }
  
  signIn(provider) {
    this._auth.login(provider).subscribe(
      (data) => {
        this.spinnerService.start();
        this.users = data;
        console.log(data);
        var password;
        if (this.users.provider == 'facebook') {
          password = 'Fa' + this.users.uid;
        } else {
          password = 'Go' + this.users.uid;
        }
        this.socialData.username = this.users.email;
        this.socialData.password = password;
        this.http.post(environment.context_root + '/login', this.socialData)
          .subscribe((res) => {
            if (res.json().message) {
              console.log("invalid User");
              var nameArr=this.users.name;
              var arry =[];
              arry = nameArr.split(" ");
              this.userRegister = {
                customer: {
                  firstname: arry[0],
                  lastname: arry[1],
                  email: this.users.email,
                },
                password: password
              }
              this.storageService.setSocialFlag(true);
              this.storageService.setLogout(false);
              this.scocialRegister();
            } else {
              console.log("valid user");
              this.storageService.setCartId('');
              this.storageService.setCustomerCartId(res.json());
              this.storageService.setSocialFlag(true);
              this.storageService.setLogout(false);
              console.log("login user token" + res.json());
              var success = "Login successfully";
              this.messageService.popToastSuccess(success);
              this.spinnerService.end();
              this.loginData = {};
              this.menuService.initializeCustomerCart(res.json()).subscribe((data) => {
                this.storageService.setCartId(data);
                this.getCustomerDetailsWithWishlist(res.json());
                if (this.cardId != undefined && this.cardId != null) {
                  this.getGuestCartItemAssignToCustomer(res.json(), data,true);
                } else {
                  this.cartService.getCustomerCartItems(res.json()).subscribe((cartdata) => {
                    this.updateInCart(cartdata,true);
                  });
                }
                console.log("initializeCustomerCart + " + data);
              });
            }
          },
          err => {
            this.messageService.popToastError();
            this.spinnerService.end();
          });
      })
  }
  
  scocialRegister() {
    this.http.post(environment.context_root + '/createUser', this.userRegister)
      .subscribe((userres) => {
        console.log(userres);
        if (userres.json().message) {
          var error = "Emailid already exits";
          this.messageService.validationError(error);
          this.spinnerService.end();
        } else {
          console.log("Registration response" + userres.json());
          this.http.post(environment.context_root + '/login', this.socialData)
            .subscribe((res) => {
              if (res.json().message) {
                this.spinnerService.end();
                return;
              } else {
                console.log("valid user");
                this.spinnerService.end();
                this.storageService.setCartId('');
                this.storageService.setCustomerCartId(res.json());
                console.log("login user token" + res.json());
                this.socialData = {};
                this.submitted = false;
                this.menuService.initializeCustomerCart(res.json()).subscribe((data) => {
                  this.storageService.setCartId(data);
                  this.getCustomerDetailsWithWishlist(res.json());
                  if (this.cardId != undefined && this.cardId != null) {
                    this.getGuestCartItemAssignToCustomer(res.json(), data, true);
                  } else {
                    this.cartService.getCustomerCartItems(res.json()).subscribe((cartdata) => {
                      this.updateInCart(cartdata, true);
                    });
                  }
                  console.log("initializeCustomerCart + " + data);
                });
              }
            },
            err => {
              this.spinnerService.end();
              this.messageService.popToastError();
            });
        }
        //this.router.navigate(['/myaccount']);
      },
      err => {
        console.log("Error in  user registration");
        this.spinnerService.end();
        this.messageService.popToastError();
      });
  }
  
  getCustomerDetailsWithWishlist(res) {
    this.myAccountService.getCustomerAllInfo(res).subscribe((customerInfo) => {
      this.customer_id = customerInfo.customer.id;
      this.storageService.setNewsLetter(customerInfo.customer.extension_attributes.is_subscribed);   
      this.storageService.setCustomerId(this.customer_id);
      this.myAccountService.getCustomerCredit(this.customer_id).subscribe((credit) => {
        this.storageService.setStoreCredit(credit);
      });  
      this.wishlistService.getWishListItems(this.customer_id).subscribe((wishListData) => {
        this.storageService.setWishListItems(wishListData);
      });
    });
  }
    
  forgotPassword() {
      if (this.loginForm.controls.username.status == "VALID") {
          //this.loginService.resetPasswordLink(this.loginData.username);
      } else {
          var error = "Email not found please enter valid email";
          this.messageService.validationError(error);
      }
  } 
   
}

export class GlobalValidator {
  public static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}