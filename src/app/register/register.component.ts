import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {NgForm, NgModel, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl} from '@angular/forms';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/map';
//import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import {SpinnerService} from '../spinner/spinner.service';

import {environment} from '../../environments/environment';
import {StorageService} from '../storage/storage.service';
import {MessageService} from '../message/message.service';
import {CartService} from '../cart/cart.service';
import {MenuService} from '../menu/menu.service';
import {ProductService} from '../product/product.service';
import {WishlistService} from '../wishlist/wishlist.service';
import {MyAccountService} from '../myaccount/myaccount.service';


declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.conponent.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  personalinfoForm:FormGroup;
  shippingForm:FormGroup;
  billingForm:FormGroup;
  
  submitAttempt: boolean = false;
  shipSubmitAttempt: boolean = false;
  regionError:boolean;
  regionErrorForBilling:boolean;
  avl_regions: any = [];
  avl_regions1: any = [];
  countries: any = [];
  newUserInformation = {};
  loginData = {};
  default_billing: boolean = false;
  addressDeffrent :boolean = false;  
  shipsubmitted=false;
  billsubmitted=false;  
  regionBilling:any={};
  regionShipping:any={};  
    
  shippingInfo = {
    region_code: '',
    street: [],
    firstname: '',
    lastname: '',
    region: '',
    city: '',
    country_id: '',
    region_id: '',
    postcode: '',
    telephone: '',
    street1: '',
    street2: '',
  };
  
  billingInfo = {
    region_code: '',
    street: [],
    firstname: '',
    lastname: '',
    region: '',
    city: '',
    country_id: '',
    region_id: '',
    postcode: '',
    telephone: '',
    street1: '',
    street2: '',
  };
  
  personalInfo = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmpassword: '',
    gender:'',
    newsLetter: '',
    dob:'',
  }
  billingAddressAvilable;
  passwordNotMatch;
  personInfoStep;
  shippingInfoStep;
  customerAvaliable={
   customerEmail:''
  };
  categoryId;
  cardId;
  customer_id;
  date;
  month;  
  year;
  shipping_default_billing :boolean;
  shipping_default_shipping:boolean;
  billing_default_billing :boolean;
  billing_default_shipping:boolean;    
  
  constructor(private storageService: StorageService, private formBuilder: FormBuilder, public http: Http,private router :Router,private menuService : MenuService,
    private cartService: CartService,private productService : ProductService,private wishlistService:WishlistService,private myAccountService :MyAccountService,
    private route: ActivatedRoute,private messageService: MessageService,private spinnerService: SpinnerService) {
    this.passwordNotMatch = "";
    this.regionError = false;
    this.regionErrorForBilling = false;
    
    this.shippingForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      street1: ['', Validators.compose([Validators.required])],
      street2: ['', Validators.compose([Validators.nullValidator])],
      city: ['', Validators.compose([Validators.required])],
      country_id: ['', Validators.compose([Validators.required])],
      region_id: ['', Validators.compose([Validators.nullValidator])],
      region: ['', Validators.compose([Validators.nullValidator])],
      postcode: ['', Validators.compose([Validators.required])],
      telephone: ['', Validators.compose([Validators.required])],
    });
    
    this.personalinfoForm = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(GlobalValidator.PASSWORD_REGEX)])],
      confirmpassword: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(GlobalValidator.PASSWORD_REGEX)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(GlobalValidator.EMAIL_REGEX)])],
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      gender:['', Validators.compose([Validators.nullValidator])],
      newsLetter:['', Validators.compose([Validators.nullValidator])],
      dob:['', Validators.compose([Validators.nullValidator])],
      date:['', Validators.compose([Validators.nullValidator,Validators.maxLength(2)])],
      month:['', Validators.compose([Validators.nullValidator,Validators.maxLength(2)])],  
      year:['', Validators.compose([Validators.nullValidator,Validators.maxLength(4)])],
    });
    
    this.billingForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      street1: ['', Validators.compose([Validators.required])],
      street2: ['', Validators.compose([Validators.nullValidator])],
      city: ['', Validators.compose([Validators.required])],
      country_id: ['', Validators.compose([Validators.required])],
      region_id: ['', Validators.compose([Validators.nullValidator])],
      region: ['', Validators.compose([Validators.nullValidator])],
      postcode: ['', Validators.compose([Validators.required])],
      telephone: ['', Validators.compose([Validators.required])],
    });
    
    this.billingAddressAvilable=false;
    this.personInfoStep = true;
    this.shippingInfoStep = false;
    $('.navmenu').show();
    $('.serach2').show();
    $('.myaccount').show();
    
    this.storageService.getCartId().subscribe((cardId) => {
      this.cardId = cardId;
    });
    
    this.storageService.getCategoryId().subscribe((id) =>{
      this.categoryId=id;
    });
    
  }
  
  ngOnInit() {
    this.shippingForm.valueChanges.subscribe(form => {
      if (form.region_id != undefined && form.region_id !="") {
        for (var i = 0; i < this.avl_regions.length; i++) {
          if (this.avl_regions[i].id == this.shippingInfo.region_id) {
            this.shippingInfo.region = this.avl_regions[i].name;
            this.shippingInfo.region_code = this.avl_regions[i].code;
          }
        }
      }
    });
    
    this.billingForm.valueChanges.subscribe(form => {
      if (form.region_id != undefined && form.region_id !="") {
        for (var i = 0; i < this.avl_regions1.length; i++) {
          if (this.avl_regions1[i].id == this.billingInfo.region_id) {
            this.billingInfo.region = this.avl_regions1[i].name;
            this.billingInfo.region_code = this.avl_regions1[i].code;
          }
        }
      }
    });
  }

  fetchCountries() {
    this.cartService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }

  fetchRegions(c) {
      console.log(c);
      this.cartService.getCountry(c).subscribe((data) => {
          if (data.available_regions == undefined) {
              this.regionError = true;
          } else {
              this.regionError = false;
              this.avl_regions = data.available_regions;
          }
          if (this.regionError == true) {
              this.shippingInfo.region = '';
          }
      });
  }
  
  fetchRegionsForBilling(c) {
    console.log(c);
    this.cartService.getCountry(c).subscribe((data) => {
      if (data.available_regions == undefined) {
        this.regionErrorForBilling = true;
      } else {
        this.regionErrorForBilling = false;
        this.avl_regions1 = data.available_regions;
      }
      /*if (this.regionErrorForBilling == true) {
          this.billingInfo.region = '';
      } */ 
    });
  }
  
  personalDetail() {
    if (!this.personalinfoForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      console.log("success! success! success!");
      //console.log(this.personalinfoForm.value);
      event.preventDefault();
      console.log("this.personalInfo.gender"+ this.personalInfo.gender);
      this.personalInfo.password = this.personalinfoForm.value.password;
      this.personalInfo.confirmpassword = this.personalinfoForm.value.confirmpassword;
      var regex = new RegExp("^\s*(3[01]|[12][0-9]|0?[1-9])\-(1[012]|0?[1-9])\-((?:19|20)\d{2})\s*$");      
      if (this.date != "" && this.month != "" && this.year != "" && this.date != undefined && this.month != undefined && this.year != undefined) {
          if (this.date == 31 && (this.month == 4 || this.month == 6 || this.month == 9 || this.month == 11)) {
              var error = "Enter month 30 days and you entered  "+this.date + " days";
              this.messageService.validationError(error);
              return; //# 31st of a month with 30 days
          }else if(this.date >= 30 && this.month == 2) {
              var error = "Enter month 29 days and you entered  "+this.date + " days";
              this.messageService.validationError(error);
              return; //# February 30th or 31st
          } else if(this.month == 2 && this.date == 29 &&  !(this.year % 4 == 0 && (this.year % 100 != 0 || this.year % 400 == 0))) {
              var error = "February 29th outside a leap year";
              this.messageService.validationError(error);
              return; //# February 29th outside a leap year
          } else {
             this.personalInfo.dob = this.date + "-" + this.month + "-" + this.year;
          }
      } else if (this.date != "" && this.date != undefined || this.month != "" && this.month != undefined || this.year != "" && this.year != undefined) {
          if (regex.test(this.personalInfo.dob)) {

          } else {
              var error = "Enter correct date";
              this.messageService.validationError(error);
              return;
          }
      } else {
          this.personalInfo.dob = "";
      }   
      if (this.personalInfo.password == this.personalInfo.confirmpassword) {
        console.log("password match");
        this.customerAvaliable.customerEmail=this.personalInfo.email;
        /*
        this.http.post(environment.context_root + '/emailAvailable', this.customerAvaliable)
          .subscribe((res) => {
            console.log(res);
            if (res.json() == true) {
              var error = "Emailid already exits";
              this.messageService.validationError(error);
            } else {
              this.passwordNotMatch = "";
              this.personInfoStep = false;
              this.shippingInfoStep = true;
              this.fetchCountries();
            }
          },
          err => {
            console.log("");
            this.messageService.popToastError();
          });*/
          
        this.passwordNotMatch = "";
        this.newUserInformation = {
            customer: {
                firstname: this.personalInfo.firstname,
                lastname: this.personalInfo.lastname,
                email: this.personalInfo.email,
                gender: this.personalInfo.gender,
                dob: this.personalInfo.dob,
                "extension_attributes": {
                    "is_subscribed": this.personalInfo.newsLetter
                },
            },
            password: this.personalInfo.password
        }
        this.userCreate(this.newUserInformation);
        
          /*
        this.personInfoStep = false;
        this.shippingInfoStep = true;
        this.fetchCountries();
        $('#regbackground').removeClass("container-fluid myaccount personal");
        $('#regbackground').addClass("container-fluid myaccount shipping");*/
      } else {
        console.log("password not match");
        return this.passwordNotMatch = "Password and  confirm password not match";
      }
    }
  }
  
  
  createUser() {
      if (this.addressDeffrent == true) {
          this.shipping_default_billing = false;
          this.shipping_default_shipping = true
          this.billing_default_billing = true;
          this.billing_default_shipping = false;
          this.billsubmitted = true;
      } else {
          this.shipping_default_billing = true;
          this.shipping_default_shipping = true
          this.billing_default_billing = false;
          this.billing_default_shipping = false;
      }
      this.shipsubmitted = true;
      //this.billsubmitted = true;
      this.shippingInfo.street = [];
      if (this.shippingInfo.street1 != "" && this.shippingInfo.street1 != undefined) {
          this.shippingInfo.street.push(this.shippingInfo.street1);
      }

      if (this.shippingInfo.street2 != "" && this.shippingInfo.street2 != undefined) {
          this.shippingInfo.street.push(this.shippingInfo.street2);
      }
      this.billingInfo.street = [];
      if (this.billingInfo.street1 != "" && this.billingInfo.street1 != undefined) {
          this.billingInfo.street.push(this.billingInfo.street1);
      }

      if (this.billingInfo.street2 != "" && this.billingInfo.street2 != undefined) {
          this.billingInfo.street.push(this.billingInfo.street2);
      }

      if (this.addressDeffrent == false) {
          if (!this.shippingForm.valid) {
              this.shipSubmitAttempt = true;
              console.log('failed! failed! failed!');
              return;
          } else {
              this.spinnerService.start();
              console.log("success! success! success!");
              console.log(this.shippingForm.value);
              this.getRegionDetail();
              this.newUserInformation = {
                  customer: {
                      firstname: this.personalInfo.firstname,
                      lastname: this.personalInfo.lastname,
                      email: this.personalInfo.email,
                      gender: this.personalInfo.gender,
                      dob:this.personalInfo.dob,
                      addresses: [{
                          defaultShipping: true,
                          defaultBilling: this.default_billing,
                          firstname: this.shippingInfo.firstname,
                          lastname: this.shippingInfo.lastname,
                          region: {
                              region_id: this.regionShipping.region_id,
                              region: this.regionShipping.region,
                              region_code: this.regionShipping.region_code
                          },
                          postcode: this.shippingInfo.postcode,
                          street: this.shippingInfo.street,
                          city: this.shippingInfo.city,
                          telephone: this.shippingInfo.telephone,
                          country_id: this.shippingInfo.country_id,
                          default_shipping: this.shipping_default_shipping,
                          default_billing: this.shipping_default_billing
                      }
                      ],
                      "extension_attributes": {
                          "is_subscribed": this.personalInfo.newsLetter
                      },
                  },
                  password: this.personalInfo.password
              }
              this.userCreate(this.newUserInformation);
          }
      } else {
          if (!this.shippingForm.valid) {
              this.shipSubmitAttempt = true;
              console.log('failed! failed! failed!');
              return;
          } else {
              if (!this.billingForm.valid) {
                  this.submitAttempt = true;
                  this.spinnerService.end();
                  return;
              } else {
                  console.log("success! success! success!");
                  console.log(this.billingForm.value);
                  event.preventDefault();
                  this.billingAddressAvilable = true;
                  this.getRegionDetail();
                  this.newUserInformation = {
                      customer: {
                          firstname: this.personalInfo.firstname,
                          lastname: this.personalInfo.lastname,
                          email: this.personalInfo.email,
                          gender: this.personalInfo.gender,
                          dob:this.personalInfo.dob,
                          addresses: [{
                              defaultShipping: true,
                              defaultBilling: this.default_billing,
                              firstname: this.shippingInfo.firstname,
                              lastname: this.shippingInfo.lastname,
                              region: {
                                  region_id: this.regionShipping.region_id,
                                  region: this.regionShipping.region,
                                  region_code: this.regionShipping.region_code
                              },
                              postcode: this.shippingInfo.postcode,
                              street: this.shippingInfo.street,
                              city: this.shippingInfo.city,
                              telephone: this.shippingInfo.telephone,
                              country_id: this.shippingInfo.country_id,
                              default_shipping: this.shipping_default_shipping,
                              default_billing: this.shipping_default_billing
                          },
                              {
                                  firstname: this.billingInfo.firstname,
                                  lastname: this.billingInfo.lastname,
                                  region: {
                                      region_id: this.regionBilling.region_id,
                                      region: this.regionBilling.region,
                                      region_code: this.regionBilling.region_code
                                  },
                                  postcode: this.billingInfo.postcode,
                                  street: this.billingInfo.street,
                                  city: this.billingInfo.city,
                                  telephone: this.billingInfo.telephone,
                                  country_id: this.billingInfo.country_id,
                                  default_shipping: this.billing_default_shipping,
                                  default_billing: this.billing_default_billing
                              }
                          ],
                          "extension_attributes": {
                              "is_subscribed": this.personalInfo.newsLetter
                          },
                      },
                      password: this.personalInfo.password
                  }
                  this.userCreate(this.newUserInformation);
              }
          }
      }
  }
  
  getRegionDetail() {
      this.regionBilling = {};
      this.regionShipping = {};
      if (this.regionError == true) {
          this.regionShipping = {
              region: this.shippingInfo.region
          }
      } else {
          this.regionShipping = {
              region_id: this.shippingInfo.region_id,
              region: this.shippingInfo.region,
              region_code: this.shippingInfo.region_code
          }
      }
      if (this.regionErrorForBilling == true) {
          this.regionBilling = {
              region: this.billingInfo.region
          }
      } else {
          this.regionBilling = {
              region_id: this.billingInfo.region_id,
              region: this.billingInfo.region,
              region_code: this.billingInfo.region_code
          }
      }
  } 
    
  userCreate(details) {
      this.spinnerService.start();
      this.http.post(environment.context_root + '/createUser', details)
          .subscribe((res) => {
              console.log(res);
              if (res.json().message == "A customer with the same email already exists in an associated website.") {
                  var error = "email address already exist";
                  this.messageService.validationError(error);
                  this.personInfoStep = true;
                  this.shippingInfoStep = false;
                  $('#regbackground').removeClass("container-fluid myaccount shipping");
                  $('#regbackground').addClass("container-fluid myaccount personal");
                  this.spinnerService.end();
              } else {
                  var success = "Registration successfully";
                  this.messageService.popToastSuccess(success);
                  console.log("Registration response" + res.json());
                  this.spinnerService.end();
                  this.login();
              }
          },
          err => {
              console.log("Error in  user registration");
              this.messageService.popToastError();
          });
  }    
    
    
  login() {
    this.loginData = {
      "username": this.personalInfo.email,
      "password": this.personalInfo.password
    };
    this.http.post(environment.context_root + '/login', this.loginData)
      .subscribe((res) => {
        if (res.json().message) {
          console.log("invalid User");
          var error = "Invalid username and password";
          this.messageService.validationError(error);
        } else {
          console.log("valid user");
          this.storageService.setCartId('');
          this.storageService.setCustomerCartId(res.json());
          this.storageService.setLogout(false);
          console.log("login user token" + res.json());
          this.loginData = {};
          this.menuService.initializeCustomerCart(res.json()).subscribe((data) => {
            this.storageService.setCartId(data);
            
            this.myAccountService.getCustomerAllInfo(res.json()).subscribe((customerInfo) => {
              this.customer_id = customerInfo.customer.id;
              this.storageService.setCustomerId(this.customer_id);
              this.storageService.getGeustWishList().subscribe((productId) => {
                if (productId != null && productId != undefined && productId != "") {
                  this.storageService.setGeustWishList('');
                  this.wishlistService.addToWishList(productId, this.customer_id);
                }
              });
              if (this.cardId != undefined && this.cardId != null) {
                this.getGuestCartItemAssignToCustomer(res.json(), data);
              } else {
                this.cartService.getCustomerCartItems(res.json()).subscribe((cartdata) => {
                  this.updateInCart(cartdata);
                });
              }
           });
          
          });
        }

      },
      err => {
        this.messageService.popToastError();
      }
      );
  }
  
    
  getGuestCartItemAssignToCustomer(cusToken,customerId) {
      this.cartService.getCartItems(this.cardId).subscribe((cartdata) => {
        if (!cartdata.length) {
            this.cartService.getCustomerCartItems(cusToken).subscribe((custdata) => {
              if (!custdata.length) {
                this.router.navigate(['/home', this.categoryId]);
              } else {
                this.updateInCart(custdata);
              }
            });
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
                  this.updateInCart(custdata);
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
  
  
  updateInCart(data) {
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
    this.router.navigate(['/home', this.categoryId]);
  }
  
  sameAsShipping() {
      if (this.addressDeffrent == true) {
          this.addressDeffrent = false;
      } else {
          this.addressDeffrent = true;
      }
  }
  
  billingAddress() {
  }   
    
  /*  
  sameAsShipping() {
    if (this.default_billing == false) {
      this.default_billing = true;
      console.log("default_billing" + this.default_billing);
    } else {
      this.default_billing = false;
      console.log("default_billing" + this.default_billing);
    }

    console.log("this.shippingInfo.region_id " + this.shippingInfo.region);
    
    this.billingInfo = {
      country_id: this.shippingInfo.country_id,
      region_code: this.shippingInfo.region_code,
      region: this.shippingInfo.region,
      region_id: this.shippingInfo.region_id,
      street: [
        this.shippingInfo.street1,
        this.shippingInfo.street2
      ],
      firstname: this.shippingInfo.firstname,
      lastname: this.shippingInfo.lastname,
      city: this.shippingInfo.city,
      postcode: this.shippingInfo.postcode,
      telephone: this.shippingInfo.telephone,
      street1: this.shippingInfo.street1,
      street2: this.shippingInfo.street2,
    };
    console.log("this.billingInfo.region_id " + this.billingInfo.region);

    this.fetchRegionsForBilling(this.billingInfo.country_id);
    this.billingForm.valueChanges.subscribe(form => {
      if (form.region_id != undefined) {
        for (var i = 0; i < this.avl_regions1.length; i++) {
          if (this.avl_regions1[i].id == this.billingInfo.region_id) {
            this.billingInfo.region = this.avl_regions1[i].name;
            this.billingInfo.region_code = this.avl_regions1[i].code;
          }
        }
      } 
    });
  }*/
 
}
    
export class GlobalValidator {
  public static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public static PASSWORD_REGEX=/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!#$%&'(*+),-./:;<=>?@[\]^_`{|}~\s]).{8,}$/;
}