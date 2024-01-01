import {Component, OnInit, ViewChild, ElementRef,ChangeDetectorRef} from '@angular/core';
import {NgForm, NgModel, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl} from '@angular/forms';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { FileUploader } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';

import {SpinnerService} from '../spinner/spinner.service';
import {environment} from '../../environments/environment';
import {StorageService} from '../storage/storage.service';
import {MessageService} from '../message/message.service';
import {CartService} from '../cart/cart.service';
import {MenuService} from '../menu/menu.service';
import {CheckoutService} from '../checkout/checkout.service';
import {MyAccountService} from '../myaccount/myaccount.service';
import {WishlistService} from '../wishlist/wishlist.service';
import {ProductService} from '../product/product.service';
declare var jquery: any;
declare var $: any;
const URL = '';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.conponent.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
  personalinfoForm: FormGroup;
  changePasswordForm:FormGroup;
  shippingForm:FormGroup;
  billingForm:FormGroup;
  newLetterForm:FormGroup;
  subcribeNewsLetterForm:FormGroup;
  trackOrderForm:FormGroup;
  returnOrderForm:FormGroup;
  submitAttempt: boolean = false;
  submittedPass;
  submitted;
  shipsubmitted;
  billsubmitted;
  billingAddress={};
  addressDeffrent :boolean = false;
  orderInformation;
  subscription: Subscription;
    
  
  public uploader:FileUploader = new FileUploader({url: URL});
  shippingInfo={
    region_code:'',
    street: [],
    firstname:'',
    lastname:'',
    region:'',
    city:'',
    country_id:'',
    region_id:'',
    postcode:'',
    telephone:'',
    street1:'',
    street2:'',
  };
  
  billingInfo={
    region_code:'',
    street: [],
    firstname:'',
    lastname:'',
    region:'',
    city:'',
    country_id:'',
    region_id:'',
    postcode:'',
    telephone:'',
    street1:'',
    street2:'',
  };

  personalInfo = {
    firstname: '',
    lastname: '',
    email: '',
    gender: '',
    dob:'',
  }
  
  changePassword = {
    oldpassword: '',
    password: '',
    confirmpassword: ''
  }
  
  orderReturn = {
    sku: '',
    itemName:'',
    resolutionType:'',
    returnReson:[],
    customerNotes:'',
    otherReason:''
  };
  
  newsLettersub={
   newsLetter:''
  };
 
  avl_regions: any = [];
  avl_regions1: any = [];
  countries: any = [];
  wishListItem:any=[];
  wishListItemTemp:any=[];
  saveArticalList:any=[];  
  
  passwordNotMatch;
  cusToken;
  updatedInformation={};
  updateLetter={};
  subscribeLetter={};
  websiteId;
  passwordUpdate;
  personalDetailStep;
  shippingAddressStep;
  wishlistStep;
  saveArticalStep;
  trackOrderStep;
  newsLetterStep;
  myOrderStep;
  returnsStep;
  myreturnStep;
  customerName;
  customerEmail;
  customerLastName;
  storeCreditStep;
  viewOrderDetailStep;    
  
  newsLetterFlage:boolean;
  billingAndShipping :boolean;
  updateShippingInfo={};
  customer_id;
  address_id;
  address_id1;
  billing_id;
  updateBillingInfo={};
  billingAddressAvilable;
  categoryId;
  orderHistroy: any = [];
  orderHistroyNew: any = [];
  socialFlag:boolean;
  trackOrderNumber;
  orderTrackData:any=[];
  myOrderEmpty: boolean;
  myWishlistEmpty: boolean;
  saveArticlelistEmpty:boolean;  
  orderNumber;
  returnItemList: any = [];
  resolutionType:any=[];
  returnResones: any = [[{"id":1,"type":"APPAREL","name":"Size too Small",},{"id":2,"type":"APPAREL","name":"Size too Big",},{"id":3,"type":"APPAREL","name":"Style",},{"id":4,"type":"APPAREL","name":"Color",}],[{"id":5,"type":"ISSUE WITH THE PRODUCT","name":"Damaged",},{"id":6,"type":"ISSUE WITH THE PRODUCT","name":"Missing Parts",},{"id":7,"type":"ISSUE WITH THE PRODUCT","name":"Not as Described",}],[{"id":8,"type":"ISSUE WITH THE ORDER","name":"Wrong Product Shipped",},{"id":9,"type":"ISSUE WITH THE ORDER","name":"Unauthorized Purchase",},{"id":10,"type":"ISSUE WITH THE ORDER","name":"Not Delivered",}],[{"id":11,"type":"Other","name":"Please Specify",}],];;
  returnResonFlag;
  fileContents:any=[];
  file;
  returnSubmitted;
  regionBilling:any={};
  regionShipping:any={};   
  regionError:boolean;
  regionErrorForBilling:boolean; 
  shippingAddressStepEdit:boolean;  
  storeCredit:number;
  customerId:number;
  shipping_default_billing :boolean;
  shipping_default_shipping:boolean;
  billing_default_billing :boolean;
  billing_default_shipping:boolean;       
  date;
  month;  
  year;    
    
  constructor(private storageService: StorageService, private formBuilder: FormBuilder, public http: Http, private router: Router, private menuService: MenuService, private myAccountService: MyAccountService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private checkoutService: CheckoutService,
    private cd: ChangeDetectorRef,
    private spinnerService: SpinnerService,
    private wishlistService: WishlistService,
    private productService: ProductService,
    private datePipe:DatePipe) {
    this.passwordNotMatch = "";
    this.regionError = false;
    this.regionErrorForBilling = false;
           
    this.personalinfoForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(GlobalValidator.EMAIL_REGEX)])],
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      gender: ['', Validators.compose([Validators.nullValidator])],
      dob:['', Validators.compose([Validators.nullValidator])],
      date:['', Validators.compose([Validators.nullValidator])],
      month:['', Validators.compose([Validators.nullValidator])],  
      year:['', Validators.compose([Validators.nullValidator])],
    });
    
    this.changePasswordForm = formBuilder.group({
      oldpassword: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(GlobalValidator.PASSWORD_REGEX)])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(GlobalValidator.PASSWORD_REGEX)])],
      confirmpassword: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(GlobalValidator.PASSWORD_REGEX)])],
    });
    
    this.shippingForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      street1: ['', Validators.compose([Validators.required])],
      street2: ['', Validators.compose([Validators.nullValidator])],
      city: ['', Validators.compose([Validators.required])],
      country_id: ['', Validators.compose([Validators.required])],
      region_id: ['', Validators.compose([Validators.nullValidator])],
      region: ['', Validators.compose([Validators.required])],
      postcode: ['', Validators.compose([Validators.required])],
      telephone: ['', Validators.compose([Validators.required])],
    });
    
    this.billingForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      street1: ['', Validators.compose([Validators.required])],
      street2: ['', Validators.compose([Validators.nullValidator])],
      city: ['', Validators.compose([Validators.required])],
      country_id: ['', Validators.compose([Validators.required])],
      region_id: ['', Validators.compose([Validators.nullValidator])],
      region: ['', Validators.compose([Validators.required])],
      postcode: ['', Validators.compose([Validators.required])],
      telephone: ['', Validators.compose([Validators.required])],
    });
    
    this.newLetterForm = formBuilder.group({
      newsLetter: ['', Validators.compose([Validators.nullValidator])]
    });
    
    this.subcribeNewsLetterForm = formBuilder.group({
      customerEmail: ['', Validators.compose([Validators.nullValidator])]
    });
    
    this.trackOrderForm = formBuilder.group({
      trackOrderNumber: ['', Validators.compose([Validators.required])]
    });
    
    this.returnOrderForm = formBuilder.group({
      sku: ['', Validators.compose([Validators.required])],
      itemName: ['', Validators.compose([Validators.required])],
      resolutionType: ['', Validators.compose([Validators.required])],
      returnReson: ['', Validators.compose([Validators.nullValidator])],
      customerNotes: ['', Validators.compose([Validators.required])],
      otherReason:['', Validators.compose([Validators.nullValidator])]
    });
    
    this.storageService.getCustomerCartId().subscribe((custoken) => {
      if (custoken != "" && custoken != null) {
        this.cusToken = custoken;
        this.getPersonalDetail();
      }
    });
    
    this.storageService.getLogout().subscribe((logout) => {
      if (logout==true || this.cusToken == "" && this.cusToken == null){
        this.router.navigate(['']);
      }
    });
    
    this.storageService.getSocialFlag().subscribe((flag) => {
      this.socialFlag = flag;
    });
    
    this.storageService.getCategoryId().subscribe((id) => {
      this.categoryId = id;
    });
    
    this.storageService.getWishListItems().subscribe((list) => {
      this.wishListUpdateDetails(list);
    });

    this.subscription = this.storageService.getNewsLetterAsync().subscribe(value => { 
      this.newsLettersub.newsLetter = value.subscribed;
      console.log("Value changed for NewsLetter " + value.subscribed);
   });
    
    this.newsLetterFlage=false;
    this.billingAndShipping=false;
    this.personalDetailStep=true;
    this.shippingAddressStep=false;
    this.myOrderStep=false;
    this.returnsStep=false;
    this.wishlistStep=false;
    this.saveArticalStep=false;
    this.trackOrderStep=false;
    this.newsLetterStep=false;
    this.myreturnStep=false;
    this.storeCreditStep=false;  
    this.fetchCountries();
    this.billingAddressAvilable=false;
    this.myOrderEmpty=false
    this.myWishlistEmpty=false;
    this.saveArticlelistEmpty=false;  
    this.returnResonFlag=false;
    this.returnSubmitted=false;
    this.shippingAddressStepEdit=false;
    this.viewOrderDetailStep=false; 
    this.viewOrderDetailStep=false;      
    $('.navmenu').hide();
    $('.serach2').show();
    //$('.myaccount').show();
    
  }
 
  ngOnInit() {
    this.shippingForm.valueChanges.subscribe(form => {
      //if (form.region_id != undefined && form.region_id !="") {
      if (form.region != undefined && form.region !="") {    
        for (var i = 0; i < this.avl_regions.length; i++) {
          if (this.avl_regions[i].name == this.shippingInfo.region) {
            this.shippingInfo.region = this.avl_regions[i].name;
            this.shippingInfo.region_code = this.avl_regions[i].code;
            this.shippingInfo.region_id  = this.avl_regions[i].id;
          }
        }
      }
    });
    this.billingForm.valueChanges.subscribe(form => {
      //if (form.region_id != undefined && form.region_id !="") {
       if (form.region != undefined && form.region !="") {
        for (var i = 0; i < this.avl_regions1.length; i++) {
          if (this.avl_regions1[i].name == this.billingInfo.region) {
            this.billingInfo.region = this.avl_regions1[i].name;
            this.billingInfo.region_code = this.avl_regions1[i].code;
            this.billingInfo.region_id = this.avl_regions1[i].id;  
          }
        }
      }
    });
  }
   
  getChangeDetect(){
    this.cd.detectChanges();
  } 
   
  fadeOut() {
    $(".minicart").fadeOut(1000);
  } 
   
  fetchCountries() {
    this.cartService.getCountries().subscribe((data) => {
      this.countries = data;
    });
  }
  
  fetchRegions(c) {
      console.log(c);
      if (c != "") {
          this.cartService.getCountry(c).subscribe((data) => {
              if (data.available_regions == undefined) {
                  this.regionError = true;
              } else {
                  this.regionError = false;
                  this.avl_regions = data.available_regions;
                  this.getChangeDetect();
              }
          });
      }
  }
  
  fetchRegionsForBilling(c) {
      console.log(c);
      if (c != "") {
          this.cartService.getCountry(c).subscribe((data) => {
              if (data.available_regions == undefined) {
                  this.regionErrorForBilling = true;
              } else {
                  this.regionErrorForBilling = false;
                  this.avl_regions1 = data.available_regions;
              }
          });
      }
  }
  
  getShippingAddressTab(tab) {
    this.clearReturnForm();
    this.submitted=false;
    this.submittedPass=false;
    this.commonActiveClass(tab);
    this.showPage(tab);
    $('#mainbackground').removeClass("container-fluid myaccount personal wishlistpage articlepage orderspage orderhistory-return my-credit");
    $('#mainbackground').addClass("container-fluid myaccount shippingpage");
    this.getChangeDetect();
  }
    
  commonActiveClass(tab) {
      var TabList = ["Tab1", "Tab2", "Tab3", "Tab4", "Tab5", "Tab6", "Tab7", "Tab8", "Tab9"];
      for (var i = 0; i < TabList.length; i++) {
          if (tab == TabList[i]) {
              $('#' + tab).addClass("active");
          } else {
              $('#' + TabList[i]).removeClass("active");
          }
      }
  }
    
  showPage(tab) {
      this.personalDetailStep = false;
      this.shippingAddressStep = false;
      this.shippingAddressStepEdit = false;
      this.returnsStep = false;
      this.myOrderStep = false;
      this.wishlistStep = false;
      this.saveArticalStep = false;
      this.trackOrderStep = false;
      this.newsLetterStep = false;
      this.myreturnStep = false;
      this.storeCreditStep = false;
      this.viewOrderDetailStep = false;
      if (tab == "Tab1") {
          this.personalDetailStep = true;
      } else if (tab == "Tab2") {
          this.shippingAddressStep = true;
      } else if (tab == "Tab3") {
          this.wishlistStep = true;
      } else if (tab == "Tab4") {
          this.saveArticalStep = true;
      } else if (tab == "Tab5") {
          this.myOrderStep = true;
      } else if (tab == "Tab7") {
          this.newsLetterStep = true;
      } else if (tab == "Tab9") {
          this.storeCreditStep = true;
      } else if (tab == "return") {
          this.returnsStep = true;
      } else if (tab == "viewOrder") {
          this.viewOrderDetailStep = true;
      }
  }    
  
  getPersonalInfoTab(tab){
    this.clearReturnForm();
    this.shipsubmitted=false;
    this.billsubmitted=false;
    this.commonActiveClass(tab);
    this.showPage(tab);    
    $('#mainbackground').removeClass("container-fluid myaccount shippingpage");
    $('#mainbackground').addClass("container-fluid myaccount personal");
    this.getChangeDetect();
  }
  
  getPersonalDetail() {
    this.myAccountService.getCustomerAllInfo(this.cusToken).subscribe((data) => {
      if(data.message == "Consumer is not authorized to access %resources") {
          var wishListItem = [];
          this.storageService.setWishListItems(wishListItem);
          this.logout();
      }
      this.customerId = data.customer.id;
      this.personalInfo = {
        firstname: data.customer.firstname,
        lastname: data.customer.lastname,
        email: data.customer.email,
        gender: data.customer.gender,
        dob:data.customer.dob
      }
      if(data.customer.dob !=undefined){
         this.splitDate(data.customer.dob); 
      }    
        
      this.customerName=data.customer.firstname;
      this.customerLastName=data.customer.lastname;
      this.customerEmail=data.customer.email;
      this.newsLettersub.newsLetter=data.customer.extension_attributes.is_subscribed;
      this.newsLetterFlage=data.customer.extension_attributes.is_subscribed;
      this.customer_id = data.customer.id;
      this.storageService.setNewsLetter(this.newsLetterFlage); 
      
      for (var i = 0; i < data.customer.addresses.length; i++) {
        if (i == 0) {
          this.shippingInfo = {
            region_code: data.customer.addresses[i].region.region_code,
            region: data.customer.addresses[i].region.region,
            region_id: data.customer.addresses[i].region.region_id,
            street: [],
            firstname: data.customer.addresses[i].firstname,
            lastname: data.customer.addresses[i].lastname,
            city: data.customer.addresses[i].city,
            country_id: data.customer.addresses[i].country_id,
            postcode: data.customer.addresses[i].postcode,
            telephone: data.customer.addresses[i].telephone,
            street1: data.customer.addresses[i].street[0],
            street2: data.customer.addresses[i].street[1],
          };
          //this.default_billing = data.customer.addresses[i].default_billing;
          //this.customer_id = data.customer.addresses[i].customer_id;
          this.address_id = data.customer.addresses[i].id;
          if (data.customer.addresses[i].default_billing != undefined) {
              this.shipping_default_billing = data.customer.addresses[i].default_billing;
          }else{
              this.shipping_default_billing =false;
          }    
          if (data.customer.addresses[i].default_shipping != undefined) {
              this.shipping_default_shipping = data.customer.addresses[i].default_shipping;
          }else{
              this.shipping_default_shipping = false;
          }
            
          if (data.customer.addresses[i].region.region_id == 0) {
              this.regionError = true;
              this.shippingInfo.region = data.customer.addresses[i].region.region;
          } else {
              this.regionError = false;
          }  
            
        }

        if (i == 1) {
          this.billingAddressAvilable = true;
          this.address_id1 = data.customer.addresses[i].id;
          this.billingInfo = {
            region_code: data.customer.addresses[i].region.region_code,
            region: data.customer.addresses[i].region.region,
            region_id: data.customer.addresses[i].region.region_id,
            street: [
              data.customer.addresses[i].street[0],
              data.customer.addresses[i].street[1]
            ],
            firstname: data.customer.addresses[i].firstname,
            lastname: data.customer.addresses[i].lastname,
            city: data.customer.addresses[i].city,
            country_id: data.customer.addresses[i].country_id,
            postcode: data.customer.addresses[i].postcode,
            telephone: data.customer.addresses[i].telephone,
            street1: data.customer.addresses[i].street[0],
            street2: data.customer.addresses[i].street[1],
          };
         
          if (data.customer.addresses[i].default_billing != undefined) {
              this.billing_default_billing = data.customer.addresses[i].default_billing;
          }else{
              this.billing_default_billing =false;
          } 

          if (data.customer.addresses[i].default_shipping != undefined) {
              this.billing_default_shipping = data.customer.addresses[i].default_shipping;
          }else{
              this.billing_default_shipping =false;
          }  
        }
      }
        
      if (this.shipping_default_billing == true && this.shipping_default_shipping == true) {
          this.addressDeffrent = false;
      } else if (this.shipping_default_shipping == true && this.billing_default_billing == true) {
          this.addressDeffrent = true;
      } else if (this.shipping_default_billing == false && this.shipping_default_shipping == true) {
          this.addressDeffrent = false;
      } else if (this.billing_default_billing == true && this.billing_default_shipping == false) {
          this.addressDeffrent = false;
      }  
        
        
      this.billing_id = data.billing_address.id;
      if (this.shippingInfo.country_id != undefined && this.shippingInfo.country_id != "" && this.shippingInfo.country_id != null) {      
          this.fetchRegions(this.shippingInfo.country_id);
      } else {
          this.regionError = false;
      }
      
      if (this.billingInfo.country_id != undefined && this.billingInfo.country_id != "" && this.billingInfo.country_id != null) {    
          this.fetchRegionsForBilling(this.billingInfo.country_id);
      } else {
          this.regionErrorForBilling = false;
      }
       this.getChangeDetect();
    });
  }
  
  splitDate(date){
      this.personalInfo.dob =date;
      var datesplit=date.split("-");
      this.date =datesplit[2];
      this.month =datesplit[1];
      this.year =datesplit[0];
  }    
    
  updatePersonalDetail() {
    if (!this.personalinfoForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      console.log("success! success! success!");
      console.log(this.personalinfoForm.value);
      event.preventDefault();
      var regex = new RegExp("^\s*(3[01]|[12][0-9]|0?[1-9])\-(1[012]|0?[1-9])\-((?:19|20)\d{2})\s*$");    
      if(this.date !="" && this.month !="" && this.year !="" && this.date !=undefined && this.month !=undefined && this.year !=undefined){
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
             this.personalInfo.dob=this.date + "-" + this.month  + "-" + this.year;
          }
      } else if(this.date !="" && this.date !=undefined || this.month !="" && this.month !=undefined || this.year !="" && this.year !=undefined ) {
          if (regex.test(this.personalInfo.dob)) {

          } else {
              var error = "Enter correct date";
              this.messageService.validationError(error);
              return;
          }    
      } else {
          this.personalInfo.dob = "";
      }        
        
      this.updatedInformation = {
        customer: {
          firstname: this.personalInfo.firstname,
          lastname: this.personalInfo.lastname,
          email: this.personalInfo.email,
          gender: this.personalInfo.gender,
          dob:this.personalInfo.dob,
          websiteId: 1
        }
      }
      this.http.put(environment.context_root + '/updateDetail/' + this.cusToken, this.updatedInformation)
        .subscribe((res) => {
          console.log(res);
          var success = "Personal information updated successfully";
          this.messageService.popToastSuccess(success);
          this.getPersonalDetail();
        },
        err => {
          console.log("Error in  user registration");
          this.messageService.popToastError();
        });
    }
  }
  
  
  updatePassword() {
    if (!this.changePasswordForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      console.log("success! success! success!");
      console.log(this.changePasswordForm.value);
      event.preventDefault();
      this.changePassword.password = this.changePasswordForm.value.password;
      this.changePassword.confirmpassword = this.changePasswordForm.value.confirmpassword;
      if (this.changePassword.password == this.changePassword.confirmpassword) {
        this.passwordNotMatch = "";
      } else {
        console.log("password not match");
        return this.passwordNotMatch = "Password and confirm password not match";
      }
      this.passwordUpdate = {
        currentPassword: this.changePassword.oldpassword,
        newPassword: this.changePassword.password
      }
      this.http.put(environment.context_root + '/changePassword/' + this.cusToken, this.passwordUpdate)
        .subscribe((res) => {
          console.log(res);
          if (res.json().message) {
            var error = "Old password doesn't match";
            this.messageService.validationError(error);
          } else {
            var success = "Password updated successfully";
            this.messageService.popToastSuccess(success);
            this.changePassword = {
              oldpassword: '',
              password: '',
              confirmpassword: ''
            }
            this.submittedPass = false;
          }
        },
        err => {
          console.log("Error in  user registration");
          this.messageService.popToastError();
        });
    }
  }
 
  updateNewsLetter() {
      this.updateLetter = {
        customer: {
          firstname: this.customerName,
          lastname: this.customerLastName,
          email: this.customerEmail,
          websiteId: 1,
          "extension_attributes": {
            "is_subscribed": this.newsLettersub.newsLetter
          },
        }
      }
      this.http.put(environment.context_root + '/updateDetail/' + this.cusToken, this.updateLetter)
        .subscribe((res) => {
          console.log(res);
          var success = "News letter updated successfully";
          this.messageService.popToastSuccess(success);
          this.getPersonalDetail();
        },
        err => {
          console.log("Error in  user newsletter ");
          this.messageService.popToastError();
        });
  }
  
  subscibeNewsLetter() {
    if (!this.subcribeNewsLetterForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      console.log("success! success! success!");
      console.log(this.subcribeNewsLetterForm.value);
      event.preventDefault();
      this.subscribeLetter = {
        customer: {
          firstname: this.customerName,
          lastname: this.customerLastName,
          email: this.customerEmail,
          websiteId: 1,
          "extension_attributes": {
            "is_subscribed": true
          },
        }
      }
      this.http.put(environment.context_root + '/updateDetail/' + this.cusToken, this.subscribeLetter)
        .subscribe((res) => {
          console.log(res);
          var success = "News letter subcribe successfully";
          this.messageService.popToastSuccess(success);
          this.shipsubmitted = false;
          this.billsubmitted = false;
          this.commonActiveClass('Tab1');
          this.showPage('Tab1');      
          $('#mainbackground').removeClass("container-fluid myaccount personal shippingpage wishlistpage articlepage orderspage orderhistory-return my-credit");
          $('#mainbackground').addClass("container-fluid myaccount personal");
          this.getPersonalDetail();
        },
        err => {
          console.log("Error in  user newslettersubrtption");
          this.messageService.popToastError();
        });
    }
  }
 
  updateShippingAddress(){
     
  }
  
  updateBillingAddress() {
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
      
      if (this.addressDeffrent == false) {
          if (!this.shippingForm.valid) {
              this.submitAttempt = true;
              console.log('failed! failed! failed!');
              return;
          } else {
              console.log("success! success! success!");
              console.log(this.shippingForm.value);
              event.preventDefault();
              this.getRegionDetail();
              this.updateBillingInfo = {
                  customer: {
                      firstname: this.personalInfo.firstname,
                      lastname: this.personalInfo.lastname,
                      email: this.customerEmail,
                      gender: this.personalInfo.gender,
                      websiteId: 1,
                      addresses: [
                          {
                              id: this.address_id,
                              customer_id: this.customer_id,
                              region: {
                                  region_code: this.regionShipping.region_code,
                                  region: this.regionShipping.region,
                                  region_id: this.regionShipping.region_id
                              },
                              country_id: this.shippingInfo.country_id,
                              street: [
                                  this.shippingInfo.street1,
                                  this.shippingInfo.street2
                              ],
                              telephone: this.shippingInfo.telephone,
                              postcode: this.shippingInfo.postcode,
                              city: this.shippingInfo.city,
                              firstname: this.shippingInfo.firstname,
                              lastname: this.shippingInfo.lastname,
                              default_shipping: this.shipping_default_shipping,
                              default_billing: this.shipping_default_billing
                          }]
                  }
              } 
               this.billingInfo = {
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
              this.billsubmitted == false;
              this.updateAddress(this.updateBillingInfo);
          }
      }else{
          this.shipsubmitted =true;
          this.billsubmitted == true;
          if (!this.shippingForm.valid) {
              this.submitAttempt = true;
              console.log('failed! failed! failed!');
              return;
          } else {
              if (!this.billingForm.valid) {
                  this.submitAttempt = true;
                  console.log('failed! failed! failed!');
                  return;
              } else {
                  console.log("success! success! success!");
                  console.log(this.billingForm.value);
                  event.preventDefault();
                  this.updateBillingInformation();
              }
          }
      }    
  }
  
  getRegionDetail() {
      this.regionShipping = {};
      this.regionBilling = {};

      if (this.regionError == true) {
          this.regionShipping = {
              region: this.shippingInfo.region,
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
              region: this.billingInfo.region,
          }
      } else {
          this.regionBilling = {
              region_id: this.billingInfo.region_id,
              region: this.billingInfo.region,
              region_code: this.billingInfo.region_code
          }
      }
  }    
    
  updateBillingInformation(){
       var addresId2;
       if(this.billingAddressAvilable == true){
           addresId2= this.address_id1;
       }else{
           addresId2='';
       }
       this.getRegionDetail();
       this.updateBillingInfo = {
           customer: {
               firstname: this.personalInfo.firstname,
               lastname: this.personalInfo.lastname,
               email: this.customerEmail,
               gender: this.personalInfo.gender,
               websiteId: 1,
               addresses: [
                   {
                       id: this.address_id,
                       customer_id: this.customer_id,
                       region: {
                           region_code: this.regionShipping.region_code,
                           region: this.regionShipping.region,
                           region_id: this.regionShipping.region_id
                       },
                       country_id: this.shippingInfo.country_id,
                       street: [
                           this.shippingInfo.street1,
                           this.shippingInfo.street2
                       ],
                       telephone: this.shippingInfo.telephone,
                       postcode: this.shippingInfo.postcode,
                       city: this.shippingInfo.city,
                       firstname: this.shippingInfo.firstname,
                       lastname: this.shippingInfo.lastname,
                       default_shipping: this.shipping_default_shipping,
                       default_billing: this.shipping_default_billing
                   },
                   {
                       id: addresId2,
                       customer_id: this.customer_id,
                       region: {
                           region_code: this.regionBilling.region_code,
                           region: this.regionBilling.region,
                           region_id: this.regionBilling.region_id,
                       },
                       country_id: this.billingInfo.country_id,
                       street: [
                           this.billingInfo.street1,
                           this.billingInfo.street2
                       ],
                       telephone: this.billingInfo.telephone,
                       postcode: this.billingInfo.postcode,
                       city: this.billingInfo.city,
                       firstname: this.billingInfo.firstname,
                       lastname: this.billingInfo.lastname,
                       default_shipping: this.billing_default_shipping,
                       default_billing: this.billing_default_billing
                   }]
           }
       } 
       this.updateAddress(this.updateBillingInfo);
  }
          
  updateAddress(address){
      this.http.put(environment.context_root + '/updateDetail/' + this.cusToken, address).subscribe((res) => {
              console.log(res);
              var success = "Billing information updated successfully";
              this.messageService.popToastSuccess(success);
              this.shippingAddressStep = true;
              this.shippingAddressStepEdit = false;
              this.getPersonalDetail();
          },
          err => {
              console.log("Error in  user registration");
              this.messageService.popToastError();
          });         
  }            
  
  sameAsShipping() {
      if (this.addressDeffrent == true) {
          this.addressDeffrent = false;
      } else {
          this.addressDeffrent = true;
      }
  }
    
  editAddress() {
      this.shippingAddressStep = false;
      this.shippingAddressStepEdit = true;
  }
  
  logout() {
    this.storageService.getCustomerCartId().subscribe((Custoken) => {
      this.cusToken = Custoken;
      this.storageService.setCustomerCartId('');
      this.storageService.setCartId('');
      this.storageService.setSocialFlag(false);
      this.storageService.setCustomerId('');
      this.storageService.setGeustWishList('');
      this.storageService.setStoreCredit(0);
      this.storageService.setNewsLetter(false);  
      var wishListItem = [];
      this.storageService.setWishListItems(wishListItem);
      this.storageService.setLogout(true);
      var cartItem = [];
      this.storageService.setCartItems(cartItem);
      this.initializeCart();
    });
  }

  initializeCart() {
    this.menuService.initializeCart().subscribe((cardId) => {
      this.storageService.setCartId(cardId);
      console.log("geust initializeCart" + cardId);
       this.router.navigate(['/home',this.categoryId]);
    });
  }

  formatOrderHistoryDate(dt){
    // Converts traditional sql dateTime to DD.MM.YYYY
    var fd = "-";
    if(dt!== null && dt !== undefined){
       var d = dt.split(" ");
       
       if(d.length >= 2){
         d = d[0].split("-");
         fd = d[2]+"."+d[1]+"."+d[0];
       }
    }
    return fd;
   
  }
   
  getOrderHistory(tab) {
    this.spinnerService.start();
    this.commonActiveClass(tab);
    this.showPage(tab);  
    $('#mainbackground').removeClass("container-fluid myaccount personal shippingpage wishlistpage articlepage orderhistory-return my-credit");
    $('#mainbackground').addClass("container-fluid myaccount orderspage");
    this.orderHistroyNew = [];
    this.orderHistroy=[];  
    this.myAccountService.getOrderHistory(this.customerEmail).subscribe((data) => {
        this.orderHistroy = data.reverse();
        this.spinnerService.end();
        if (!this.orderHistroy.length) {
            this.myOrderEmpty = true;
        } else {
            this.myOrderEmpty = false;
        }
        //this.comaprDate();
        this.compareTime();
        this.getChangeDetect();
    });
  }
  
  cancelOrder(orderId, orderEndTime, status,entity_id,parent_id,created_at) {
    this.myAccountService.cancelOrder(orderId, orderEndTime, status,entity_id,parent_id,created_at).subscribe((res) => {
      if (res == true) {
        var success = "Order cancelled successfully.";
        this.messageService.popToastSuccess(success);
        this.orderHistroyNew = [];
        this.orderHistroy=[];
        this.getOrderHistory('Tab5');
        this.getChangeDetect();
      } else {
        var error = "Your Order cancelled time end.";
        this.messageService.validationError(error);
      }
    });
  }
  
  getOrderDetail(orderId) {
      this.orderNumber = orderId;
      this.orderInformation = {};
      this.myAccountService.getOrderDetailById(orderId).subscribe((data) => {
          this.orderInformation = data;
          for (let i = 0; i < data.items.length; i++) {
              this.productService.getProduct(data.items[i].sku).subscribe((product) => {
                  for (let j = 0; j < this.orderInformation.items.length; j++) {
                      if (this.orderInformation.items[j].sku == product.sku) {
                          this.orderInformation.items[j].imageValue = product.imageValue;
                          this.orderInformation.items[j].brand = product.brand;
                          this.orderInformation.items[j].color = product.color;
                          this.orderInformation.items[j].size = product.size;
                      }
                  }
              });
          }
      });
      this.showPage('viewOrder');
  }
  
  compareTime() {
      this.orderHistroyNew = [];
      for (let i = 0; i < this.orderHistroy.length; i++) {
          if (this.orderHistroy[i].status != 'Canceled' && this.orderHistroy[i].status != 'complete') {
              let stringToSplit = this.orderHistroy[i].created_at;
              console.log("order date" + this.orderHistroy[i].created_at);
              var array = stringToSplit.split(" ");
              let stringToSplit1 = array[1];
              var orderdateAndTime = this.orderHistroy[i].created_at;//array[0];     //this.orderHistroy[i].created_at;   
              var addhours = new Date(orderdateAndTime);
              addhours.setUTCHours(addhours.getUTCHours() + 5);
              console.log("add 5 hours order date" + addhours.toString());
              var year = new Date().getUTCFullYear();
              var month = new Date().getUTCMonth() + 1;
              var day = new Date().getUTCDate();
              var currentDate = year + "-" + month + "-" + day + " " + new Date().getUTCHours() + ":" + new Date().getUTCMinutes() + ":" + new Date().getUTCSeconds();
              console.log("currentDate" + currentDate);
              var d1 = Date.parse(addhours.toString());
              var d2 = Date.parse(currentDate);
              if (d2 < d1) {
                  this.addToList(this.orderHistroy[i], true, currentDate, false);
              } else {
                  this.addToList(this.orderHistroy[i], false, currentDate, false);
              }
          } else {
              if (this.orderHistroy[i].status == 'complete') {
                  let stringToSplit = this.orderHistroy[i].created_at;
                  var array = stringToSplit.split(" ");
                  //console.log("privous date" + this.orderHistroy[i].created_at);
                  var myDate = this.orderHistroy[i].created_at;    //array[0]
                  var addDay = new Date(myDate);
                  addDay.setDate(addDay.getDate() + 7);
                  let latest_date = this.datePipe.transform(addDay, 'yyyy-MM-dd') + " " + array[1];
                  //console.log("add Day" + latest_date);
                  var year = new Date().getUTCFullYear();
                  var month = new Date().getUTCMonth() + 1;
                  var day = new Date().getUTCDate();
                  var currentDate = year + "-" + month + "-" + day + " " + array[1];
                  var d1 = Date.parse(latest_date);
                  var d2 = Date.parse(currentDate);
                  if (d2 < d1) {
                      this.addToList(this.orderHistroy[i], false, "", true);
                  } else {
                      this.addToList(this.orderHistroy[i], false, "", false);
                  }
              } else {
                      this.addToList(this.orderHistroy[i], false, "", false);
              }    
          }
      }
  }
  
  addToList(data, flag,createdDateEndTime,retrnFlag) {
    var statusLabel = '';
    if(data.status == 'complete'){
      statusLabel = 'dispatched';
    } else if (data.status == 'canceled' || data.status == 'Canceled') {
      statusLabel = 'canceled';
    } else {
      statusLabel = 'order placed';
    }
    var newEntry = {
      "created_at": data.created_at,
      "order_id": data.order_id,
      "item_id": data.item_id,
      "name": data.name,
      "sku": data.sku,
      "status": data.status,
      "statusLabel" : statusLabel,
      "grand_total": data.grand_total,
      "firstname": data.firstname,
      "lastname": data.lastname,
      "displayCancle": flag,
      "displayReturn": retrnFlag,
      "entity_id": data.entity_id,
      "parent_id": data.parent_id,
      "createdDateEndTime":createdDateEndTime
    };
    this.orderHistroyNew.push(newEntry);
    //console.log("this.orderHistroyNew" + JSON.stringify(this.orderHistroyNew));  
  }
   
  getReturns(tab) {
    this.resolutionType=[];
    this.resolutionType = [{
      "type": "In-Store Credit",
      "value": "In-StoreCredit"
    }, {
      "type": "Refund to original payment method",
      "value": "Refundtooriginalpaymentmethod"
    }];
    this.commonActiveClass(tab);
    this.showPage('return');    
    $('#mainbackground').removeClass("container-fluid myaccount personal shippingpage wishlistpage articlepage orderspage my-credit");
    $('#mainbackground').addClass("container-fluid myaccount orderhistory-return");    
    this.getChangeDetect();
  }
  
  returnOrder(orderId) {
    this.orderNumber = orderId;
    this.myAccountService.getOrderDetailById(orderId).subscribe((data) => {
      this.returnItemList = data.items;
    });
    this.getReturns('Tab5');
  }
  
  getItemName(sku) {
    this.orderReturn.sku =sku;
  }
  
  addReason(name) {
    if (this.orderReturn.returnReson.includes(name)) {
      var index = this.orderReturn.returnReson.indexOf(name);
      if (index > -1) {
        this.orderReturn.returnReson.splice(index, 1);
      }
    } else {
      this.orderReturn.returnReson.push(name);
    }
    console.log("this.orderReturn.returnReson" + JSON.stringify(this.orderReturn.returnReson));
  }
  
  customerReturnOrder() {
    if (!this.returnOrderForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      if (this.orderReturn.otherReason !=undefined && this.orderReturn.otherReason !='') {
        this.orderReturn.returnReson.push(this.orderReturn.otherReason);
      }
      if (!this.orderReturn.returnReson.length) {
        return this.returnResonFlag = true;
      } else {
        this.returnResonFlag = false;
      }
      this.fileContents = [];
      event.preventDefault();
      if (this.uploader.queue.length > 3) {
        var numberOfImages = "You can upload only three images per return.";
        return this.messageService.validationError(numberOfImages);
      }
      for (let i = 0; i < this.uploader.queue.length; i++) {
        if (this.uploader.queue[i].file.type == 'image/jpeg' || this.uploader.queue[i].file.type == 'image/png' || this.uploader.queue[i].file.type == 'image/jpg') {
          var FileSize = this.uploader.queue[i].file.size / 1024 / 1024; // in MB
          if (FileSize < 2) {
            this.file = this.uploader.queue[i].file.rawFile;
            this.fileread(this.file);
          } else {
            var sizeError = this.uploader.queue[i].file.name + " file size is grater then 2MB long";
            return this.messageService.validationError(sizeError);
          }
        } else {
          var error = "Only JPEG, PNG or JPG file formats supported" + this.uploader.queue[i].file.name;
          return this.messageService.validationError(error);
        }
      }
      //console.log("this.fileContent"+ JSON.stringify(this.fileContents));
      console.log(this.returnOrderForm.value);
      setTimeout(() => {
      this.myAccountService.returnOrderRequest(this.orderReturn, this.orderNumber, this.customerName, this.customerEmail,this.fileContents).subscribe(() => {

      });
      }, 3000);
      console.log("success! success! success!");
      var success = "RETURN SUBMITTED SUCCESFULLY";
      this.messageService.popToastSuccess(success);
    }
  }
  
  fileread(file) {
    this.file = file;
    var reader = new FileReader();
    reader.onloadend = (e: Event) => {
      console.log("inside onloade");
      this.fileContents.push({
        "name": file.name,
        "imageString": reader.result.replace("data:image/jpeg;base64,", ""),
      });
    }
    reader.readAsDataURL(this.file);
  }
  
  
  clearReturnForm() {
    this.orderReturn = {
      sku: '',
      itemName: '',
      resolutionType: '',
      returnReson: [],
      customerNotes: '',
      otherReason: ''
    };
    this.returnSubmitted=false;
    this.uploader.queue=[];
  }
 
  getWishlist(tab){
    this.commonActiveClass(tab); 
    this.showPage(tab);
    $('#mainbackground').removeClass("container-fluid myaccount personal shippingpage  articlepage orderspage my-credit");
    $('#mainbackground').addClass("container-fluid myaccount wishlistpage");  
    this.getChangeDetect();
  }
  
  wishListUpdateDetails(data) {
    this.wishListItemTemp = [];
    this.wishListItem=[];
    this.saveArticalList=[];  
    if (!data.length) {
      this.storageService.setWishListItems(this.wishListItemTemp);
      if (!this.wishListItemTemp.length) {
        this.myWishlistEmpty = true;
      } else {
        this.myWishlistEmpty = false;
      }
    }else{
    for (let i = 0; i < data.length; i++) {
      
      let stringToSplit = data[i].productSKU;
      var skuName = stringToSplit.substr(0, stringToSplit.indexOf(' '));
      if (skuName == "") {
        skuName = data[i].productSKU;
      }
      this.productService.getProduct(skuName).subscribe((product) => {
        product.productSKU = data[i].productSKU;
        product.productName = data[i].productName;
        product.productId = data[i].productId;
        product.WishlistItemId = data[i].WishlistItemId;
        if (product.type_id == 'configurable') {
          for (var j = 0; j < product.children.length; j++) {
            if (product.children[j].sku == data[i].productSKU) {
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
        if(product.productType == 'A'){
        this.saveArticalList.push(product);
        }else{    
        this.wishListItem.push(product);
            if (!this.wishListItem.length) {
                this.myWishlistEmpty = true;
            } else {
                this.myWishlistEmpty = false;
            }    
        }   
        this.storageService.setWishListItems(this.wishListItemTemp);
      });
    }
    }
  }
  
  removeWishListItem(wishlistItemId) {
    this.wishlistService.deleteWishList(wishlistItemId, this.customer_id).subscribe((res) => {
      if (res == true) {
         var success = "Wishlist item deleted successfully";
          this.messageService.popToastSuccess(success);
          this.wishlistService.getWishListItems(this.customer_id).subscribe((data) => {
            this.wishListUpdateDetails(data);
          });
      } else {
        this.messageService.popToastError();
      }
    });
  }
  
  addItemToCart(sku,product) {
    this.cartService.addItemToCart(sku, 1, product);
  }
  
  getSaveArtical(tab){
    this.commonActiveClass(tab);
    this.showPage(tab);        
    $('#mainbackground').removeClass("container-fluid myaccount personal shippingpage wishlistpage  orderspage my-credit");
    $('#mainbackground').addClass("container-fluid myaccount articlepage");
    if (!this.saveArticalList.length) {
        this.saveArticlelistEmpty = true;
    } else {
        this.saveArticlelistEmpty = false;
    }         
    this.getChangeDetect();
  }
  
  trackOrder(){
    this.personalDetailStep = false;
    this.shippingAddressStep = false;
    this.shippingAddressStepEdit = false;  
    this.wishlistStep=false;
    this.saveArticalStep=false;
    this.trackOrderStep=true;
    this.newsLetterStep=false;
    this.myOrderStep = false;
    this.returnsStep = false;
    this.myreturnStep=false;
    this.storeCreditStep=false;
    this.viewOrderDetailStep=false;      
    $('#Tab1').removeClass("active");
    $('#Tab2').removeClass("active");
    $('#Tab3').removeClass("active");
    $('#Tab4').removeClass("active");
    $('#Tab5').removeClass("active");
    $('#Tab6').addClass("active");
    $('#Tab7').removeClass("active");
    $('#Tab8').removeClass("active");
    $('#Tab9').removeClass("active");    
    this.getChangeDetect();
  }
  
  trackOrderDetail() {
    if (!this.trackOrderForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      console.log("success! success! success!");
      console.log(this.trackOrderForm.value);
      event.preventDefault();
      this.myAccountService.getTrackOrder(this.trackOrderNumber,this.customer_id).subscribe((data) => {
        this.orderTrackData = data;
        if (this.orderTrackData.length == 0) {
          var error = "No order available";
          this.messageService.validationError(error);
        }
      });
    }
  }
  
  newsLetter(tab) {
    this.commonActiveClass(tab);
    this.showPage(tab);     
    this.getChangeDetect();
  }
   
  myReturns(){
    this.personalDetailStep = false;
    this.shippingAddressStep = false;
    this.shippingAddressStepEdit = false;  
    this.wishlistStep=false;
    this.saveArticalStep=false;
    this.trackOrderStep=false;
    this.newsLetterStep=true;
    this.myOrderStep = false;
    this.returnsStep = false;
    this.myreturnStep=true;
    this.storeCreditStep=false;
    this.viewOrderDetailStep=false;    
    this.getChangeDetect();
  } 
    
  getStoreCredit(tab) {
      this.commonActiveClass(tab);
      this.showPage(tab);
      this.myAccountService.getCustomerCredit(this.customerId).subscribe((credit) => {
        this.storeCredit=credit;
      });
      $('#mainbackground').removeClass("container-fluid myaccount personal shippingpage wishlistpage  articlepage orderspage");
      $('#mainbackground').addClass("container-fluid myaccount my-credit");    
      this.getChangeDetect();
  }  
   
  goToArticalPage(articleClassification, sku) {
      if (articleClassification == 'A1') {
          this.router.navigate(['/article', sku, this.categoryId]);
      } else {
          this.router.navigate(['/article2', sku, this.categoryId]);
      }
  }
   
}
export class GlobalValidator {
  public static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public static PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!#$%&'(*+),-./:;<=>?@[\]^_`{|}~\s]).{8,}$/;
}