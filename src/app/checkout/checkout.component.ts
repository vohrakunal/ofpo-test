import { Component,Renderer, OnInit,NgZone,OnChanges, SimpleChanges,ViewChild, ElementRef , AfterViewInit , OnDestroy , ChangeDetectorRef } from '@angular/core';
import {StorageService} from '../storage/storage.service';
import {CartService} from '../cart/cart.service';
import {CheckoutService} from '../checkout/checkout.service';
import { MessageService} from '../message/message.service';
import {ProductService} from '../product/product.service';
import {MenuService} from '../menu/menu.service';
import {WishlistService} from '../wishlist/wishlist.service';
import {SpinnerService} from '../spinner/spinner.service';
import {MyAccountService} from '../myaccount/myaccount.service';
//import {LoginService} from '../login/login.service';

import { NgModel,FormsModule } from '@angular/forms';
import {Http, RequestOptions,Headers,Response} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'; 
import { NgForm , FormBuilder, FormGroup, Validators,ReactiveFormsModule,AbstractControl ,FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import {ActivatedRoute,Router} from '@angular/router';
//import {CookieService} from 'angular2-cookie/core';
declare var jquery:any;
declare var $ :any;


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('addressDiv') addressDiv: ElementRef;
  @ViewChild('reviewCartDiv') reviewCartDiv: ElementRef;
  @ViewChild('paymentDiv') paymentDiv: ElementRef;
  @ViewChild('cardInfo') cardInfo: ElementRef;
  
  private owlf1:boolean = true;
  @ViewChild('owl1')owl1:ElementRef;
  @ViewChild('prdDesc')prdDesc:ElementRef;
  
  signUpForm: FormGroup;
  reviewCartForm :FormGroup;
  paymentForm:FormGroup;
  registerForm: FormGroup;
  shippingForm:FormGroup;
  
  submitAttempt: boolean = false;
  cartItems:any = [];
  countries:any = [];
  checkout:any = {};
  avl_regions:any =[];
  checkoutInfo={
    region_code:'',
    street: [],
    same_as_billing:'',
    firstname:'',
    lastname:'',
    email:'',
    region:'',
    city:'',
    country_id:'',
    region_id:'',
    postcode:'',
    telephone:'',
    street1:'',
    street2:'',
  };
  billingInfo:any={};
  customerShow:boolean;
  guesttShow:boolean;
  address:any={};
  freShipping:boolean;
  expshipping:boolean;
  checkoutData:any={};
  subTotal:number;
  subTotalValue:number;
  shippingRates:any=[];
  shippingCharge:number;
  cartItemsGroup:any = [];
  cartItemsDisplay:any=[];
  shippingEstimate:any = [];
  actualTotal:number;
  totalQuntity:number;
  totalweight:number;
  priceTotal:number;
  totallabs:number;
  discount:number;
  orderInfo:any={};
  cardId;
  register={
   password:'',
   confirmpassword:''
  };
  newUserRegister:any={};
  userCreated:boolean;
  
  shippingInfo:any={};
  shippingMethod:any={};
  termCondtion1:boolean;
  termCondtion2:boolean;
  orderProccess:boolean;
  reviewProccess:boolean;
  categoryId:any="";
  checkoutMethod:any={};
  billingInfoPresent:boolean
  userAccountInfo:any=[];
  updateShippingInfo:any={};
  customerId;
  //addressId;
  emailPresent:boolean;
  storeCredit:number;
  useStoreCredit:boolean;
  spentStoreCredit:number;      
  
  
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  cardTokenId;
  salesTax:number;
  createOrder:any={};
  stripMethod;
  selectedProductAttribues:any = {};
  singleProduct:any = {};
  editSize:any = {};
  editColor:any = {};
  editItem:any={};
  cusToken;
  editQty;

  submitted: boolean = false;
  submittedReview: boolean = false;
  loginForm: FormGroup;
  loginData:any={};
  regionError;
  redioButtonhide;
  passwordNotMatch;
  chekoutPageLogin:boolean;
  totalshiiping:number;
  shipping_carrier_code;
  shipping_carrier_method;
    
  regionPersonalInfo:any={};
  allshippingMethodTotal:number;
  grandTotal:number;
  shippingFree:boolean;
  availableCredit:boolean; 
  appliedCredit:boolean;
  remember:boolean =false;
  vendorIdList:any=[];
  vendorSelection:any=[];         

  constructor(private storageService : StorageService,private router :Router , private route : ActivatedRoute, private cartService: CartService,public http : Http,
     public formBuilder: FormBuilder,private checkoutService :CheckoutService,
     private messageService :MessageService , private cd: ChangeDetectorRef,private menuService : MenuService,
     private spinnerService: SpinnerService,private productService : ProductService,
     private wishlistService:WishlistService,private myAccountService :MyAccountService/*,private cookieService:CookieService*/) {
      
      this.productService.getProduct("BackGround").subscribe((data) => {
          var image = data.imageValue;
          $('body').css('position', 'relative');
          $('body').css('background', 'url(' + image + ')');
          $('body').css('background-size', 'cover');
      });  
      
      this.storageService.getCartItems().subscribe((data) => {
      this.cartItems = data;
      this.subTotalValue = 0;
      for (var i = 0; i < this.cartItems.length; i++) {
        this.subTotalValue = this.subTotalValue + this.cartItems[i].price * this.cartItems[i].quantity;
        if (this.cartItemsGroup.includes(this.cartItems[i].brand) == false) {
          this.cartItemsGroup.push(this.cartItems[i].brand);
        }
      }
      this.subTotal = this.subTotalValue;
      console.log("subTaotal"+ this.subTotal);    
      this.initPay();
    });
     
    this.storageService.getCartId().subscribe((cardId) => {
      this.cardId = cardId;
    });
    
    this.storageService.getCategoryId().subscribe((id) =>{
      this.categoryId=id;
    });
    
    this.loginForm = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      username: ['', Validators.compose([Validators.required, Validators.pattern(GlobalValidator.EMAIL_REGEX)])],
      remember: ['', Validators.compose([Validators.nullValidator])],
    });
    
    this.storageService.getCustomerCartId().subscribe((custoken) => {
      if (custoken != "" && custoken != null && custoken != undefined) {
        this.cusToken = custoken;
        let el: HTMLElement = this.addressDiv.nativeElement as HTMLElement;
        el.click();
        this.redioButtonhide=false;
        this.checkOutMethodType('guest');
        this.getCustomerDetail();
       }
    });
    
    this.passwordNotMatch = "";
    this.redioButtonhide=true;
    this.discount = 0;
    this.customerShow=false;
    this.guesttShow=false;
    this.freShipping=false;
    this.expshipping=false;
    this.shippingMethod='';
    this.termCondtion1=false
    this.termCondtion2=false;
    this.orderProccess=false;
    this.reviewProccess=false;
    this.billingInfoPresent=false;
    this.userCreated=false;
    this.checkoutMethod='';
    this.stripMethod='';
    this.salesTax=0;
    this.regionError=false;
    this.emailPresent=false;
    this.chekoutPageLogin=false;
    this.totalshiiping=0;
    this.allshippingMethodTotal=0;
    this.storeCredit=0;
    this.useStoreCredit=false;
    this.grandTotal=0;
    this.shippingFree=false;
    this.spentStoreCredit=0;
    this.availableCredit=false; 
    this.appliedCredit=false;   
    
    this.signUpForm = formBuilder.group({
        firstname:['',Validators.compose([Validators.required,Validators.maxLength(30)])],
        lastname:['',Validators.compose([Validators.required,Validators.maxLength(30)])],
        email: ['', Validators.compose([Validators.required,Validators.pattern(GlobalValidator.EMAIL_REGEX)])],
        street1:['', Validators.compose([Validators.required])],
        street2:['', Validators.compose([Validators.nullValidator])],
        city:['', Validators.compose([Validators.required])],
        country_id:['', Validators.compose([Validators.required])],
        //region_id:['', Validators.compose([Validators.required])],
        region_id:['', Validators.compose([Validators.nullValidator])],
        region:['', Validators.compose([Validators.required])],
        postcode:['', Validators.compose([Validators.required])],
        telephone:['',Validators.compose([Validators.required,Validators.maxLength(16)])],
        //shippingMethod:['', Validators.compose([Validators.required])],
     });
    
    this.reviewCartForm = formBuilder.group({
        termCondtion1:['', Validators.compose([Validators.required])],
        termCondtion2:['', Validators.compose([Validators.required])],
        //useStoreCredit:['', Validators.compose([Validators.nullValidator])],
     });
    
    this.shippingForm = formBuilder.group({
      standardShipping: ['', Validators.compose([Validators.nullValidator])],
      expeditedShipping: ['', Validators.compose([Validators.nullValidator])],
      standardChecked: ['', Validators.compose([Validators.nullValidator])],
      expeditedChecked: ['', Validators.compose([Validators.nullValidator])]
    });
    
    this.paymentForm = formBuilder.group({
        paymentMethod:['', Validators.compose([Validators.required])],
    });
    
    this.registerForm = formBuilder.group({
      password: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(GlobalValidator.PASSWORD_REGEX)])],
      confirmpassword: ['', Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern(GlobalValidator.PASSWORD_REGEX)])],
    });
    
     this.getrememberMe();
  }

  initPay(){
    // stripe.applePayDomains.create({
    //     domain_name: 'localhost'
    // });
    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        //amount: parseFloat(this.grandTotal),
        amount :this.grandTotal,  
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
    console.log("**********************************");
    console.log(paymentRequest);
    const elements = stripe.elements();
    const prButton = elements.create('paymentRequestButton', {
      paymentRequest,
    });

    (async () => {
      // Check the availability of the Payment Request API first.
      const result = await paymentRequest.canMakePayment();
      console.log(result);
      if (result) {
        prButton.mount('#payment-request-button');
      } else {
        document.getElementById('payment-request-button').style.display = 'none';
      }
    })();

    paymentRequest.on('source', async (result) => {
      // Duplicate code. Card and this can be combined to a single function.
      console.log("*******************");
      console.log(result);
      const ownerInfo = {
      amount: 59,
      currency: 'usd',
      owner: {
        name: this.checkoutInfo.firstname + " "+ this.checkoutInfo.lastname,
        address: {
          line1: this.checkoutInfo.street1,
          city: this.checkoutInfo.city,
          postal_code: this.checkoutInfo.postcode,
          country: this.checkoutInfo.country_id,
        },
        email: this.checkoutInfo.email
      },
    };
     console.log(prButton);
     
       if (result.source.id == undefined) {
         this.messageService.popToastError();
       } else {
         //this.spinnerService.start();
         this.cardTokenId = result.source.id;
         var currency = result.source.currency;
         console.log("tokencode " + this.cardTokenId);
         this.createOrder = {
           "email": this.checkoutInfo.email,
           "paymentMethod": {
             "method": this.stripMethod,
             "additional_data": {
               "stripeToken": this.cardTokenId,
               "currencyCode": currency,
               "customerEmail": this.checkoutInfo.email,
               "stripeCard3ds": "optional",
             }
           },
           "billing_address": this.shippingInfo.addressInformation.billing_address,
         }

         this.payPayment();
         /**This should be called based on success/fail of payPayment **/
         result.complete("success");
         /****/

       }

     
      // const response = await fetch('/charges', {
      //   method: 'POST',
      //   body: JSON.stringify({token: ev.token.id}),
      //   headers: {'content-type': 'application/json'},
      // });

      // if (response.ok) {
      //   // Report to the browser that the payment was successful, prompting
      //   // it to close the browser payment interface.
      //   ev.complete('success');
      // } else {
      //   // Report to the browser that the payment failed, prompting it to
      //   // re-show the payment interface, or show an error message and close
      //   // the payment interface.
      //   ev.complete('fail');
      // }
    });
  }
 
  getCatSubTotal() {
    this.subTotalValue = 0;
    for (var i = 0; i < this.cartItems.length; i++) {
      this.subTotalValue = this.subTotalValue + this.cartItems[i].price
    }
    this.subTotal = this.subTotalValue;
  }
   
  ngOnInit() {
    this.fetchCountries();
    this.signUpForm.valueChanges.subscribe(form => {
      //if (form.region_id != undefined && form.region_id !="" && form.region_id !=null) {
      if (form.region != undefined && form.region !="" && form.region !=null) {    
        for (var i = 0; i < this.avl_regions.length; i++) {
          if (this.avl_regions[i].name == this.checkoutInfo.region) {
            this.checkoutInfo.region = this.avl_regions[i].name;
            this.checkoutInfo.region_code = this.avl_regions[i].code;
            this.checkoutInfo.region_id = this.avl_regions[i].id;
          }
        }
      }
    });
     $('.minicart').click(function(){
       $(".minicart").fadeOut(1000);
    })
  }

  ngAfterViewInit() {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }
  

  async onSubmit(form: NgForm) {
    // const { token, error } = await stripe.createToken(this.card);
      var total = this.subTotal + this.allshippingMethodTotal + this.salesTax;
      var storeCredit = Number(this.storeCredit)
      if (this.useStoreCredit == true && storeCredit >= total) {
          //if (storeCredit >= total) {
              this.createOrder = {
                  "email": this.checkoutInfo.email,
                  "paymentMethod": {
                      "method": this.stripMethod,
                  },
                  "billing_address": this.shippingInfo.addressInformation.billing_address,
              }
              this.payPayment(); 
          //}
      }else{
          
      const ownerInfo = {
      amount: 59,
      currency: 'usd',
      owner: {
        name: this.checkoutInfo.firstname + " "+ this.checkoutInfo.lastname,
        address: {
          line1: this.checkoutInfo.street1,
          city: this.checkoutInfo.city,
          postal_code: this.checkoutInfo.postcode,
          country: this.checkoutInfo.country_id,
        },
        email: this.checkoutInfo.email
      },
    };
    // const { token, error } = await stripe.createSource(this.card, ownerInfo);
    //     if (error) {
    //       console.log('Something is wrong:', error);
    //     } else {
    //       console.log('Success!', token);
    //       // ...send the token to the your backend to process the charge
    //     }
     stripe.createSource(this.card, ownerInfo).then((result) => {
       if (result.source.id == undefined) {
         this.messageService.popToastError();
       } else {
         //this.spinnerService.start();
         this.cardTokenId = result.source.id;
         var currency = result.source.currency;
         console.log("tokencode " + this.cardTokenId);
         this.createOrder = {
           "email": this.checkoutInfo.email,
           "paymentMethod": {
             "method": this.stripMethod,
             "additional_data": {
               "stripeToken": this.cardTokenId,
               "currencyCode": currency,
               "customerEmail": this.checkoutInfo.email,
               "stripeCard3ds": "optional",
             }
           },
           "billing_address": this.shippingInfo.addressInformation.billing_address,
         }
         this.payPayment();
       }

     });
      }    
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
         this.regionError=true;
      } else {
        this.regionError=false;
        this.avl_regions = data.available_regions;
      }
      //if (this.regionError == true) {
      //    this.checkoutInfo.region = '';
      //} 
      this.discount = 0;
      this.cartItemsDisplay = [];
      this.getShipingRate();
      //this.getShippingEstimate();
    });
  }
  
  getCustomerDetail() {
    this.checkoutService.getCustomerInfo(this.cusToken).subscribe((data) => {
      this.checkoutInfo.email=data.email;
      this.customerId=data.id;
      this.storageService.setCustomerId(this.customerId);
      if(this.chekoutPageLogin ==true){
         this.getWishList(this.customerId);
      }
      this.myAccountService.getCustomerCredit(this.customerId).subscribe((credit) => {
        this.storeCredit=credit;
        if (this.storeCredit > 0) {
            this.availableCredit = true;
        } else {
            this.availableCredit = false;
        }
        this.storageService.setStoreCredit(credit);  
      });   
      this.userAccountInfo=data;
      for (var i = 0; i < data.addresses.length; i++) {
        if (i == 0) {
          this.checkoutInfo = {
            region_code: data.addresses[i].region.region_code,
            street: [],
            same_as_billing: '',
            firstname: data.addresses[i].firstname,
            lastname: data.addresses[i].lastname,
            email: data.email,
            region: data.addresses[i].region.region,
            city: data.addresses[i].city,
            country_id: data.addresses[i].country_id,
            region_id: data.addresses[i].region.region_id,
            postcode: data.addresses[i].postcode,
            telephone: data.addresses[i].telephone,
            street1: data.addresses[i].street[0],
            street2: data.addresses[i].street[1],
          }
          if (data.addresses[i].region.region_id == 0) {
              this.regionError = true;
          } else {
              this.regionError = false;
          } 
        }
        if (i == 1) {
          this.billingInfoPresent=true;
          this.billingInfo = {
            region_code: data.addresses[i].region.region_code,
            street: [],
            same_as_billing: '',
            firstname: data.addresses[i].firstname,
            lastname: data.addresses[i].lastname,
            email: data.email,
            region: data.addresses[i].region.region,
            city: data.addresses[i].city,
            country_id: data.addresses[i].country_id,
            region_id: data.addresses[i].region.region_id,
            postcode: data.addresses[i].postcode,
            telephone: data.addresses[i].telephone,
            street1: data.addresses[i].street[0],
            street2: data.addresses[i].street[1],
          }
        }
      //this.signUpForm.valueChanges.subscribe(form => {
        if (this.checkoutInfo.region_id != undefined && this.checkoutInfo.region_id != "" && this.checkoutInfo.region_id != null) {
          this.fetchRegions(this.checkoutInfo.country_id);
        }
      //});
      }
    });
  }
  
  shippingAddress() {
    if (!this.signUpForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      $('#addressDiv').removeClass("accordion-toggle green");    
      $('#addressDiv').addClass("accordion-toggle gold");
      $('#addressDiv1').removeClass("number1");
      $('#addressDiv1').addClass("number");
      $('#addressDivicon').removeClass("indicator glyphicon glyphicon-ok");   
      $('#addressDivicon').addClass("indicator glyphicon glyphicon-chevron-down pull-right");
      return;
    } else {
      console.log("success! success! success!");
      console.log(this.signUpForm.value);
      this.orderProccess=true;
      this.spinnerService.start();
      $('#addressDiv').removeClass("accordion-toggle gold");
      $('#addressDiv').addClass("accordion-toggle green");
      $('#addressDiv1').removeClass("number");
      $('#addressDiv1').addClass("number1"); 
      $('#ShippingProgress1').removeClass("panel panel-default");
      $('#ShippingProgress1').addClass("panel panel-default Green-left-bod");
      $('#addressDivicon').removeClass("indicator glyphicon glyphicon-chevron-down pull-right");
      $('#addressDivicon').addClass("indicator glyphicon glyphicon-ok");   
      this.cd.detectChanges();    
      event.preventDefault();
      if (this.checkoutMethod == 'guest') {
        this.createUser();
      }
      if (!this.userAccountInfo.addresses.length) {
          this.addshippingAddress();
      }
      this.getShippingEstimate();
    }
  }
  
  shippingAddressRequestData(){
    this.spinnerService.start(); 
    var count = 0;
    this.shipping_carrier_method=""; 
    this.vendorIdList.sort();  
    //console.log("this.vendorIdList.sort();" + JSON.stringify(this.vendorIdList));
    for (var i = 0; i < this.vendorIdList.length; i++) {
        var codeandMethod = this.getDHLMethodCode(this.vendorIdList[i]);
        if (codeandMethod != undefined) {
            var method_code = codeandMethod.method_code1.split("||");
            var correctedMethodCode=method_code[0] + "||" + this.vendorIdList[i];
            if (this.shipping_carrier_method == "") {
                this.shipping_carrier_method = this.shipping_carrier_method + codeandMethod.carrier_code1 + "_" + correctedMethodCode;
            } else {
                this.shipping_carrier_method = this.shipping_carrier_method + "|" + "_|" + codeandMethod.carrier_code1 + "_" + correctedMethodCode;
            }
        }
    }  
    //console.log("this.shipping_carrier_method" +this.shipping_carrier_method);
    this.checkoutInfo.street=[];
    if (this.checkoutInfo.street1 != "" && this.checkoutInfo.street1 != undefined) {
      this.checkoutInfo.street.push(this.checkoutInfo.street1);
    }
    if (this.checkoutInfo.street2 != "" && this.checkoutInfo.street2 != undefined) {
      this.checkoutInfo.street.push(this.checkoutInfo.street2);
    }
    var checkoutInfoData = {
      region_code: this.checkoutInfo.region_code,
      street: this.checkoutInfo.street,
      same_as_billing: "",
      firstname: this.checkoutInfo.firstname,
      lastname: this.checkoutInfo.lastname,
      email: this.checkoutInfo.email,
      region: this.checkoutInfo.region,
      city: this.checkoutInfo.city,
      country_id: this.checkoutInfo.country_id,
      region_id: this.checkoutInfo.region_id,
      postcode: this.checkoutInfo.postcode,
      telephone: this.checkoutInfo.telephone,
    }
    this.shippingInfo = {
      "addressInformation": {
        "shipping_address": {
          region_code: this.checkoutInfo.region_code,
          street: this.checkoutInfo.street,
          same_as_billing: "",
          firstname: this.checkoutInfo.firstname,
          lastname: this.checkoutInfo.lastname,
          email: this.checkoutInfo.email,
          region: this.checkoutInfo.region,
          city: this.checkoutInfo.city,
          country_id: this.checkoutInfo.country_id,
          region_id: this.checkoutInfo.region_id,
          postcode: this.checkoutInfo.postcode,
          telephone: this.checkoutInfo.telephone,
        },
        "billing_address": {
          region_code: this.checkoutInfo.region_code,
          street: this.checkoutInfo.street,
          same_as_billing: "",
          firstname: this.checkoutInfo.firstname,
          lastname: this.checkoutInfo.lastname,
          email: this.checkoutInfo.email,
          region: this.checkoutInfo.region,
          city: this.checkoutInfo.city,
          country_id: this.checkoutInfo.country_id,
          region_id: this.checkoutInfo.region_id,
          postcode: this.checkoutInfo.postcode,
          telephone: this.checkoutInfo.telephone,
        },
        "shipping_carrier_code": this.shipping_carrier_code,
        "shipping_method_code": this.shipping_carrier_method
      }
    }
    
    if (this.orderProccess && this.cusToken != undefined && this.cusToken !='') {
      if (!this.userAccountInfo.addresses.length) {
        this.addshippingAddress();
      }
      
       
      this.http.post(environment.context_root + '/customer/shippingInformation/' + this.cusToken, this.shippingInfo)
        .subscribe((res) => {
          console.log(res);
          if (res.status == 200) {
              this.getPaymentStep();
              this.getPaymentAndSalesTax(res.json());
          }else{
               this.errorMessage();
               this.spinnerService.end();
          }    
        },
        err => {
          console.log("Error in  shippingInformation");
          this.messageService.popToastError();
          this.spinnerService.end();  
        });
    } else {
      if (this.userCreated) {
        this.http.post(environment.context_root + '/shippingInformation/' + this.cardId, this.shippingInfo)
          .subscribe((res) => {
            console.log(res);
            if (res.status == 200) {
                this.getPaymentStep();
                this.getPaymentAndSalesTax(res.json());
            }else{
                this.errorMessage();
                this.spinnerService.end();
            }    
          },
          err => {
            console.log("Error in  shippingInformation");
            this.messageService.popToastError();
            this.spinnerService.end();   
          });
      }
    }
  }
    
  
  getDHLMethodCode(code) {
      for (let i = 0; i < this.vendorSelection.length; i++) {
          if (this.vendorSelection[i].vendorId == code && this.vendorSelection[i].selected == true) {
              for (var j = 0; j < this.shippingEstimate.length; j++) {
                  if (this.shippingEstimate[j].method_title == this.vendorSelection[i].method_title) {
                      this.shippingEstimate[j].vendorId = this.vendorSelection[i].vendorId;
                      return this.shippingEstimate[j];
                  }
              }
          }
      }
  }    
    
  getPaymentStep() {
      this.spinnerService.end();
      $('#paymentDiv').attr("data-toggle", "collapse");
      $('#paymentDiv').attr("data-parent", "#accordion");
      $('#paymentDiv').attr("href", "#collapseThree");
      $('#reviewCartDiv').removeClass("accordion-toggle gold");
      $('#reviewCartDiv').addClass("accordion-toggle green");
      $('#reviewCartDiv2').removeClass("number");
      $('#reviewCartDiv2').addClass("number1");
      $('#ShippingProgress2').removeClass("panel panel-default");
      $('#ShippingProgress2').addClass("panel panel-default review-cart");
      $('#reviewCartDivIcon').removeClass("indicator glyphicon glyphicon-chevron-down  pull-right");
      $('#reviewCartDivIcon').addClass("indicator glyphicon glyphicon-ok");
      let el: HTMLElement = this.paymentDiv.nativeElement as HTMLElement;
      el.click();
  }    
    
  
  addshippingAddress() {
    this.updateShippingInfo = {
      customer: {
        firstname: this.checkoutInfo.firstname,
        lastname: this.checkoutInfo.lastname,
        email: this.checkoutInfo.email,
        websiteId: 1,
        addresses: [
          {
            customer_id: this.customerId,
            region: {
              region_code: this.checkoutInfo.region_code,
              region: this.checkoutInfo.region,
              region_id: this.checkoutInfo.region_id
            },
            region_id: this.checkoutInfo.region_id,
            country_id: this.checkoutInfo.country_id,
            street: [
              this.checkoutInfo.street1,
              this.checkoutInfo.street2
            ],
            telephone: this.checkoutInfo.telephone,
            postcode: this.checkoutInfo.postcode,
            city: this.checkoutInfo.city,
            firstname: this.checkoutInfo.firstname,
            lastname: this.checkoutInfo.lastname,
            default_shipping: true,
            default_billing: false
          }]
      }
    }
    this.http.put(environment.context_root + '/updateDetail/' + this.cusToken, this.updateShippingInfo)
      .subscribe((res) => {
        //console.log(res);
        var success = "Shipping information added successfully";
        this.messageService.popToastSuccess(success);
        this.getCustomerDetail();
      },
      err => {
        console.log("Error in  user registration");
        this.messageService.popToastError();
      });
  }
  
  
  createUser() {  
    if (!this.registerForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      console.log("success! success! success!");
      //console.log(this.registerForm.value);
      this.register.password = this.registerForm.value.password;
      this.register.confirmpassword = this.registerForm.value.confirmpassword;
      if (this.register.password == this.register.confirmpassword) {
        this.passwordNotMatch = "";
      } else {
        console.log("password not match");
        return this.passwordNotMatch = "Password and confirm password not match";
      }
    this.spinnerService.start();
        this.checkoutInfo.street=[];
    if (this.checkoutInfo.street1 != "" && this.checkoutInfo.street1 != undefined) {
      this.checkoutInfo.street.push(this.checkoutInfo.street1);
    }
    if (this.checkoutInfo.street2 != "" && this.checkoutInfo.street2 != undefined) {
      this.checkoutInfo.street.push(this.checkoutInfo.street2);
    } 
    
    this.regionPersonalInfo = {};
    if (this.regionError == true) {
        this.regionPersonalInfo = {
            region: this.checkoutInfo.region,
        }
    } else {
        this.regionPersonalInfo = {
            region_id: this.checkoutInfo.region_id,
            region: this.checkoutInfo.region,
            region_code: this.checkoutInfo.region_code
        }
    }
        
    this.newUserRegister = {
      customer: {
        firstname: this.checkoutInfo.firstname,
        lastname: this.checkoutInfo.lastname,
        email: this.checkoutInfo.email,
        addresses: [{
          defaultShipping: true,
          defaultBilling: false,
          firstname: this.checkoutInfo.firstname,
          lastname: this.checkoutInfo.lastname,
          region: {
            region_id: this.regionPersonalInfo.region_id,
            region: this.regionPersonalInfo.region,
            region_code: this.regionPersonalInfo.region_code
          },
          postcode: this.checkoutInfo.postcode,
          street: this.checkoutInfo.street,
          city: this.checkoutInfo.city,
          telephone: this.checkoutInfo.telephone,
          country_id: this.checkoutInfo.country_id,
          default_shipping: true,
          default_billing: true
        }
        ]
      },
      password: this.register.password
    }
    this.http.post(environment.context_root + '/createUser', this.newUserRegister)
      .subscribe((res) => {
        console.log(res);
        if (res.json().message == "A customer with the same email already exists in an associated website.") {
          this.emailPresent=true;
          var error = "You are already registered. Please log in.";
          this.messageService.validationError(error);
          this.spinnerService.end();
        } else {
          this.userCreated = true;
          this.emailPresent=false;
          var success = "Registration successfully";
          this.messageService.popToastSuccess(success);
          console.log("Registration response" + res.json());
          this.spinnerService.end();
          this.http.post(environment.context_root + '/shippingInformation/' + this.cardId, this.shippingInfo)
          .subscribe((shippres) => {
              if (shippres.status == 200) {
                  this.getPaymentAndSalesTax(shippres.json());
              }else{
                  this.errorMessage(); 
                  this.spinnerService.end();
              }    
          },
          err => {
            console.log("Error in  shippingInformation");
            this.messageService.popToastError();
          });
        }
      },
      err => {
        console.log("Error in  user registration");
        this.messageService.popToastError();
      });
    }
  }
  
  
    
  getPaymentAndSalesTax(res) {
    var shippingResponse = res;
    this.salesTax = shippingResponse.totals.tax_amount;
    console.log("salesTax" + this.salesTax);
    var paymentMethods = [];
    paymentMethods = shippingResponse.payment_methods;
    for (var i = 0; i < paymentMethods.length; i++) {
      if (paymentMethods[i].code == "stripecreditcards") {
        this.stripMethod = paymentMethods[i].code;
        console.log("this.stripMethod" + this.stripMethod);
      }
    }
    $('#reviewCartDiv').attr("data-toggle", "collapse");
    $('#reviewCartDiv').attr("data-parent", "#accordion");
    $('#reviewCartDiv').attr("href", "#collapseTwo");
    let el: HTMLElement = this.reviewCartDiv.nativeElement as HTMLElement;
    el.click();
  }
 
 
  getShipingRate() {
    this.checkoutService.getShippingRates(this.checkoutInfo.country_id).subscribe((data) => {
      if(data !=null){
      this.shippingRates = data;
      for (var j = 0; j < this.cartItemsGroup.length; j++) {
        this.totalQuntity = 0;
        this.totalweight = 0;
        this.priceTotal = 0;
        this.actualTotal = 0;
        this.totallabs = 0;

        for (var i = 0; i < this.cartItems.length; i++) {
          if (this.cartItemsGroup[j] == this.cartItems[i].brand) {
            this.priceTotal = this.priceTotal + this.cartItems[i].price * this.cartItems[i].quantity;
            this.actualTotal = this.actualTotal + this.cartItems[i].actual_price * this.cartItems[i].quantity
            this.totallabs = this.totallabs + this.cartItems[i].quantity * this.cartItems[i].weight;
          }
        }
        console.log("total lbs" + this.totallabs);
        console.log("priceTotal" + this.priceTotal);
        console.log("actualTotal" + this.actualTotal);
        this.cartItemsDisplay.push({
          "priceTotal": this.priceTotal,
          "actualTotal": this.actualTotal,
          "totallabs": this.totallabs,
        });
      }
      console.log("this.cartItemsDisplay" + JSON.stringify(this.cartItemsDisplay));
      var priceTotalTemp = 0;
      var actualTotalTemp = 0;
      var totallabsTemp = 0;
      var actual_weightTemp = 0;
      for (var a = 0; a < this.cartItemsDisplay.length; a++) {
        priceTotalTemp = priceTotalTemp + this.cartItemsDisplay[a].priceTotal
        actualTotalTemp = actualTotalTemp + this.cartItemsDisplay[a].actualTotal
        totallabsTemp = totallabsTemp + this.cartItemsDisplay[a].totallabs;
        actual_weightTemp = actualTotalTemp + this.shippingRates[totallabsTemp - 1];
        this.discount = this.discount + priceTotalTemp - actual_weightTemp;
        console.log("this.shippingRates[ totallabsTemp - 1]" + this.shippingRates[totallabsTemp - 1]);
        priceTotalTemp = 0;
        actualTotalTemp = 0;
        totallabsTemp = 0;
        actual_weightTemp = 0;
      }
     }
    });
  }
  
  getShippingEstimate() {
    
    this.storageService.getCartId().subscribe((cardId) => {
    if(cardId !=null && cardId !=undefined && cardId!=''){
    this.cardId=cardId;
    this.checkoutService.getEstimateShippingMethod(this.cardId, this.cusToken, this.checkoutInfo,this.regionError).subscribe((estimate) => {
      this.shippingEstimate = [];
      var tempDHLMethod = [];
      if (!estimate.length) {
        this.spinnerService.end();
        this.orderProccess=false;
        var err = "Shipping method is not avilable and we cant process";
        return this.messageService.validationError(err);
      }
      for (let i = 0; i < estimate.length; i++) {
          if (estimate[i].carrier_code != 'vendor_multirate') {
              var method_code = estimate[i].method_code.split("||");
              if (tempDHLMethod.includes(estimate[i].method_title) == false) {
                  tempDHLMethod.push(estimate[i].method_title);
                  this.shippingEstimate.push({
                          "carrier_code1": estimate[i].carrier_code,
                          "carrier_code": estimate[i].carrier_title + " " + estimate[i].method_title,
                          "method_code1": estimate[i].method_code,
                          "method_title": estimate[i].method_title,
                          "price_incl_tax": estimate[i].price_incl_tax,
                          "vendor_code": [],
                          "shippingSelected": false,
                          "shippingMethodTotal": 0
                      });
                      this.shippingEstimate[this.shippingEstimate.length -1].vendor_code.push(method_code[1]);
             }else{
                  console.log(i);
                  for (let j = 0; j < this.shippingEstimate.length; j++) {
                      if (this.shippingEstimate[j].method_title == estimate[i].method_title) {
                          if (this.shippingEstimate[j].vendor_code.includes(method_code[1]) == false) {
                              this.shippingEstimate[j].vendor_code.push(method_code[1]);
                          }
                      }
                  }
                  
             }     
          } else {
              this.shipping_carrier_code = estimate[i].carrier_code;
              //this.shipping_carrier_method=estimate[i].method_code;
          }
      }
       
      //console.log("this.shippingEstimate" + JSON.stringify(this.shippingEstimate));  
       this.totalshiiping=0;
       this.spinnerService.end(); 
       $('#reviewCartDiv').attr("data-toggle", "collapse");
       $('#reviewCartDiv').attr("data-parent", "#accordion");
       $('#reviewCartDiv').attr("href", "#collapseTwo");
       let el: HTMLElement = this.reviewCartDiv.nativeElement as HTMLElement;
       el.click(); 
    });
     }
    });    
  }
   
  
  getProductString = function(vendorId, method_title) {
      var productString = [];
      for (let k = 0; k < this.cartItems.length; k++) {
          if (this.cartItems[k].vendor_id == vendorId) {
              productString.push(this.cartItems[k].name);
          }
      }
      var object = {
          "method_title": method_title,
          "productString": productString,
          "vendorId": vendorId,
          "disabled": false,
          "selected":false
      };
      var vendorSelectionExits = false;
      for (let i = 0; i < this.vendorSelection.length; i++) {
          if (this.vendorSelection[i].method_title == method_title && this.vendorSelection[i].vendorId == vendorId) {
              vendorSelectionExits = true;
          }
      }
      if (vendorSelectionExits == false) {
          this.vendorSelection.push(object);
      } 
      return object;
  }
  
  disabledOtherOptionForVendor(method_title, vendorId) {
      var shippingEstimateObject;
      for (let i = 0; i < this.shippingEstimate.length; i++) {
          if (this.shippingEstimate[i].method_title == method_title) {
              shippingEstimateObject = this.shippingEstimate[i];
          }
      }    
      
      for (let k = 0; k < this.vendorSelection.length; k++) {
         if (this.vendorSelection[k].method_title != method_title && this.vendorSelection[k].vendorId == vendorId) {
              if (this.vendorSelection[k].disabled == true) {
                  this.vendorSelection[k].disabled = false;
              } else {
                  this.vendorSelection[k].disabled = true;
              }
         } else if (this.vendorSelection[k].method_title == method_title && this.vendorSelection[k].vendorId == vendorId) {
             if (this.vendorSelection[k].selected == true) {
                 this.vendorSelection[k].selected = false;
                 shippingEstimateObject.shippingMethodTotal = shippingEstimateObject.shippingMethodTotal - shippingEstimateObject.price_incl_tax;
                 this.allshippingMethodTotal= this.allshippingMethodTotal - shippingEstimateObject.price_incl_tax;
             } else {
                 this.vendorSelection[k].selected = true;
                 shippingEstimateObject.shippingMethodTotal = shippingEstimateObject.shippingMethodTotal + shippingEstimateObject.price_incl_tax;
                 this.allshippingMethodTotal= this.allshippingMethodTotal + shippingEstimateObject.price_incl_tax;
             }
         }
      }
      //console.log(JSON.stringify(this.vendorSelection));
  } 
    
  isSelectionEnabled(method_title, vendorId){
      for (let k = 0; k < this.vendorSelection.length; k++) {
          if (this.vendorSelection[k].method_title == method_title && this.vendorSelection[k].vendorId == vendorId) {
             return this.vendorSelection[k].disabled;
          }
      }
  }    
    
  errorMessage() {
      var error = "Please contact to admin";
      this.messageService.validationError(error);
  }  
 
  checkOutMethodType(method) {
    if (method == 'guest') {
      this.customerShow = false;
      this.guesttShow = true;
      this.checkoutMethod = method;
    }
    if (method == 'customer') {
      this.guesttShow = false;
      this.customerShow = true;
      this.checkoutMethod = method;
    }
  }
  
  expeShiiping(){
    this.freShipping=false;
    this.expshipping=true;
  }
  
  freeShipping(){
    this.freShipping=true;
    this.expshipping=false;
  } 
  
  editShippingAddress() {
    let el: HTMLElement = this.addressDiv.nativeElement as HTMLElement;
    el.click();
  }
    
  reviewCartInformation() {
    if (!this.reviewCartForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      this.reviewProccess = false;
      $('#reviewCartDiv').removeClass("accordion-toggle green");
      $('#reviewCartDiv').addClass("accordion-toggle gold"); 
      $('#reviewCartDiv2').removeClass("number1");
      $('#reviewCartDiv2').addClass("number");
      $('#reviewCartDivIcon').addClass("indicator glyphicon glyphicon-chevron-down  pull-right");
      $('#reviewCartDivIcon').removeClass("indicator glyphicon glyphicon-ok");     
      return;
    } else {
      console.log("success! success! success!");
      console.log(this.reviewCartForm.value);
      event.preventDefault();
          this.vendorIdList = [];
          for (var i = 0; i < this.cartItems.length; i++) {
              if (this.vendorIdList.includes(this.cartItems[i].vendor_id) == false) {
                  this.vendorIdList.push(this.cartItems[i].vendor_id);
              }
          }
          for (var j = 0; j < this.vendorIdList.length; j++) {
              var codeandMethod = this.getDHLMethodCode(this.vendorIdList[j]);
              if (codeandMethod == null || codeandMethod == undefined) {
                  this.reviewProccess = false;
                  var error = "Please select shipping method for all products";
                  this.spinnerService.end();
                  this.messageService.validationError(error);
              } else {
                  this.reviewProccess = true;
              }
          }
          if (this.reviewProccess) {
              this.shippingAddressRequestData();
          } 
    }
  }
    
  payPayment() {
      this.spinnerService.start();
      if (this.orderProccess && this.reviewProccess && this.cusToken != undefined && this.cusToken != '') {
          this.http.post(environment.context_root + '/customerOrder/' + this.cusToken + '/' + this.customerId + '/' + this.spentStoreCredit.toFixed(2) + '/' + this.useStoreCredit, this.createOrder)
              .subscribe((res) => {
                  console.log(res);
                  if (res.status == 200) {
                      var cartItems = [];
                      this.storageService.setCartItems(cartItems);
                      this.spinnerService.end();
                      var orderSuccess = "Order created sucessfully";
                      this.messageService.popToastForOrderCreate(orderSuccess);
                      this.router.navigate(['/thankyou', res.json()]);
                  } else {
                      this.errorMessage();
                      this.spinnerService.end();
                  }
              },
              err => {
                  console.log("Error in  shippingInformation");
                  this.messageService.popToastError();
                  this.spinnerService.end();
              });

      } else {
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          let options = new RequestOptions({ headers });
          this.http.post(environment.context_root + '/createOrder/' + this.cardId, this.createOrder, options)
              .subscribe((res) => {
                  console.log(res);
                  if (res.status == 200) {
                      var cartItems = [];
                      this.storageService.setCartItems(cartItems);
                      //setTimeout(() => {
                      this.spinnerService.end();
                      var orderSuccess = "Order created sucessfully";
                      this.messageService.popToastForOrderCreate(orderSuccess);
                      this.router.navigate(['/thankyou', res.json()]);
                      //}, 7000);
                  } else {
                      this.errorMessage();
                      this.spinnerService.end();
                  }
              },
              err => {
                  console.log("Error in  shippingInformation");
                  this.messageService.popToastError();
                  this.spinnerService.end();
              });
      }
  }
  
  doPayment() {
      this.http.post(environment.context_root + '/customerOrder/' + this.cusToken + '/' + this.customerId + '/' + this.storeCredit + '/' + this.useStoreCredit, this.createOrder)
          .subscribe((res) => {
              console.log(res);
              if (res.status == 200) {
                  var orderSuccess = "Order created sucessfully";
                  this.messageService.popToastForOrderCreate(orderSuccess);
                  var cartItems = [];
                  this.storageService.setCartItems(cartItems);
                  this.spinnerService.end();
                  this.router.navigate(['/thankyou', res.json()]);
              }else{
                  this.spinnerService.end();
                  this.errorMessage();
              }    
          },
          err => {
              console.log("Error in  shippingInformation");
              this.messageService.popToastError();
              this.spinnerService.end();
          });
  }
  
  
  initOwlProd() {
    console.log($(this.owl1.nativeElement));
    $(this.owl1.nativeElement).owlCarousel({
      nav: true,
      items: 1,
      navigation: true,
      navigationText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
      itemsMobile: true,
    });
    this.owlf1 = true;
  }

  ngAfterViewChecked() {
    if (!this.owlf1) {
      this.initOwlProd();
    }
  }
  
  getProductDetails = function(sku :string,itemId,addSize,item) {
     this.addAnotherSize=addSize;
     this.itemId = itemId;    
     this.editSize.sizeCode=item.size;
     this.editColor.color=item.color;
     this.editItem=item; 
     this.editQty=item.quantity;
      
     this.singleProduct={};
     let stringToSplit = sku;
     var skuName=stringToSplit.substr(0,stringToSplit.indexOf(' '));
     if(skuName == ""){
       skuName=sku;
     }    
     console.log("stringToSplit[0]" + stringToSplit.substr(0,stringToSplit.indexOf(' ')));
     this.productService.getProduct(skuName).subscribe((data) =>{
       this.singleProduct = data;
       
       if(this.editItem.productClassification == 'P2'){
         for(var i=0;i < this.singleProduct.sizeOptions.length;i++){
             if(this.singleProduct.sizeOptions[i].sizeCode == this.editSize.sizeCode){
               this.editSize.valueCode=this.singleProduct.sizeOptions[i].valueCode;
             }
         }
         for(var j=0;j < this.singleProduct.colorOptions.length;j++){
             if(this.singleProduct.colorOptions[j].colorCode == this.editColor.color){
               this.editColor.valueCode=this.singleProduct.colorOptions[j].valueCode;
             }
         }
       }
        this.prdDesc.nativeElement.innerHTML = "";
        var description= this.singleProduct.description;
        if( description != undefined){
          this.prdDesc.nativeElement.insertAdjacentHTML('beforeend', this.singleProduct.description);
        }
          this.owlf1 = false;  
      });
   }
  
  closeModal() {
    $("#owl-demo").owlCarousel('destroy');
  }
  
  setSelectedSize = function(valueCode: number) {
    if (this.addAnotherSize) {
      this.selectedProductAttribues.size = valueCode;
      //this.addItemToCart();
    } else {
      this.selectedProductAttribues.size = valueCode;
    }
  }
  
  setSelectedColor = function(valueCode: number) {
    this.selectedProductAttribues.color = valueCode;
  }
  
  updateCartItem(cartData) {
    if (this.editItem.quantity == "0") {
      this.cartItems = [];
      if (this.cusToken != undefined && this.cusToken !='') {
        this.cartService.removeCustomerCartItem(this.cusToken, this.editItem.itemId).subscribe((cartResponse) => {
          this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
            this.getShippingEstimate();
            //this.deductInGrandTotal(this.useStoreCredit);  
            return this.getItemsFromcart(data);
          });
          $("#quickview_close1").click();
        });
      } else {
        this.cartService.removeCartItem(this.cardId, this.editItem.itemId).subscribe((cartResponse) => {
          this.cartService.getCartItems(this.cardId).subscribe((data) => {
            this.getShippingEstimate();
            return this.getItemsFromcart(data);
          });
          $("#quickview_close1").click();
        });
      }
      var message = "Cart item deleted successfully.";
      return this.messageService.popToastSuccess(message);
    }
    if (this.selectedProductAttribues.color == undefined) {
      this.selectedProductAttribues.color = this.editColor.valueCode;
    }
    if (this.selectedProductAttribues.size == undefined) {
      this.selectedProductAttribues.size = this.editSize.valueCode;
    }
    for (var i = 0; i < this.singleProduct.children.length; i++) {
      if ((this.singleProduct.children[i].colorValueCode == this.selectedProductAttribues.color) &&
        (this.singleProduct.children[i].sizeValueCode == this.selectedProductAttribues.size)) {

        if(this.selectedProductAttribues.size != this.editSize.valueCode || this.editQty != this.editItem.quantity || this.selectedProductAttribues.color !=this.editColor.valueCode){
        if (this.cusToken != undefined && this.cusToken !='') {
          this.cartService.removeCustomerCartItem(this.cusToken, this.editItem.itemId).subscribe((cartResponse) => {
            this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
              this.getShippingEstimate();
              this.getItemsFromcart(data);
            });
          });
        } else {
          this.cartService.removeCartItem(this.cardId, this.editItem.itemId).subscribe((cartResponse) => {
            this.cartService.getCartItems(this.cardId).subscribe((data) => {
              this.getShippingEstimate();
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
  
  getItemsFromcart(data) {
    var token = this.cardId;
    console.log("token  ------------------++++++++++" + token);
    this.cartItems = [];
    //this.cartService.getCartItems(token).subscribe((data) => {
      if (data.length == 0) {
        //this.storageService.setCartItems(this.cartItems);
        this.subTotal = 0;
        this.spinnerService.end();  
      } else {
        this.subTotal = 0;
        for (let i = 0; i < data.length; i++) {
          let stringToSplit = data[i].sku;
          var skuName = stringToSplit.substr(0, stringToSplit.indexOf(' '));
          if (skuName == "") {
            skuName = data[i].sku;
          }
          this.productService.getProduct(skuName).subscribe((product) => {
            product.quantity = data[i].qty;
            product.itemId = data[i].item_id;
            product.weight = data[i].weight;
            product.actual_price = data[i].actual_price;
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
            product.sku = data[i].sku;
            product.name = data[i].name;
            console.log("product.type_id" + product.type_id);
            this.cartItems.push(product);
            this.storageService.setCartItems(this.cartItems);
            this.subTotal = this.subTotal + product.price * data[i].qty;
          });
        }
          this.spinnerService.end();
      }
    //});
  }
  
  updateQuantity(cartData) {
    this.spinnerService.start();
    if (cartData.quantity == "0") {
      this.cartItems = [];
      if (this.cusToken != undefined && this.cusToken !='') {
        this.cartService.removeCustomerCartItem(this.cusToken, cartData.itemId).subscribe((cartResponse) => {
          this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
            this.getShippingEstimate();
            this.getItemsFromcart(data);
          });
          $("#quickview_close1").click();
        });
      } else {
        this.cartService.removeCartItem(this.cardId, cartData.itemId).subscribe((cartResponse) => {
          this.cartService.getCartItems(this.cardId).subscribe((data) => {
            this.getShippingEstimate();
            this.getItemsFromcart(data);
          });
          $("#quickview_close1").click();
        });
      }
      var message = "Cart item deleted successfully.";
      return this.messageService.popToastSuccess(message);
    }
    if (cartData.quantity == "") {
    } else {
      if(this.editQty != cartData.quantity){
      if (this.cusToken != undefined && this.cusToken !='') {
        this.cartItems = [];
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
              this.cartService.getCustomerCartItems(this.cusToken).subscribe((data) => {
                this.getItemsFromcart(data);
              });
              var message = "Quantity updated successfully.";
              this.messageService.popToastSuccess(message);
              $("#quickview_close1").click();

            },
            err => {
              console.log("Error occured");
              this.messageService.popToastError();
            });
        });
      } else {
        this.cartItems = [];
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
              this.cartService.getCartItems(this.cardId).subscribe((data) => {
                this.getItemsFromcart(data);
              });
              var message = "Quantity updated successfully.";
              this.messageService.popToastSuccess(message);
              $("#quickview_close1").click();

            },
            err => {
              console.log("Error occured");
              this.messageService.popToastError();
            });
        });
      }
      }else{
         $("#quickview_close1").click();
      }
    }
  }
  
  login() {
    if (!this.loginForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      if (this.cusToken != undefined && this.cusToken != "" && this.cusToken != null) {
        var error = "You have already login";
        return this.messageService.validationError(error);
      }
      console.log("success! success! success!");
      //console.log(this.loginForm.value);
     
      //this.loginData.password = btoa(this.loginData.password);
      this.http.post(environment.context_root + '/login', this.loginData)
        .subscribe((res) => {
          if(res.json().message == "You did not sign in correctly or your account is temporarily disabled."){
            console.log("invalid User");
            var error = "Invalid username and password";
            this.messageService.validationError(error);
          } else {
            console.log("valid user");
            this.addRememberMe();    
            this.chekoutPageLogin = true;
            this.storageService.setCartId('');
            this.storageService.setCustomerCartId(res.json());
            this.storageService.setLogout(false);
            this.cusToken = res.json();
            console.log("login user token" + res.json());
            var success = "Login successfully";
            this.messageService.popToastSuccess(success);
            this.checkOutMethodType('guest');
            this.redioButtonhide = false;
            this.loginData = {};
            this.getCustomerDetail();
            this.getGuestCartItemAssignToCustomer();
          }
        },
        err => {
          this.messageService.popToastError();
        });
    }
  }
  
  getWishList(customerId) {
    this.wishlistService.getWishListItems(this.customerId).subscribe((wishListData) => {
      this.storageService.setWishListItems(wishListData);
    });
  }

  getGuestCartItemAssignToCustomer() {
    this.menuService.initializeCustomerCart(this.cusToken).subscribe((customerId) => {
      this.storageService.setCartId(customerId);
      //this.cardId=customerId;
      this.cartService.getCartItems(this.cardId).subscribe((cartdata) => {
        this.cartItems=[];
        for (var i = 0; i < cartdata.length; i++) {
          this.http.post(environment.context_root + "/customercart/additem/" + this.cusToken, {
            "cartItem": {
              sku: cartdata[i].sku,
              qty: cartdata[i].qty,
              quote_id: customerId
            }
          })
            .subscribe(
            res => {
              console.log(res);
              this.cartService.getCustomerCartItems(this.cusToken).subscribe((custdata) => {
                this.getItemsFromcart(custdata);
              });
            },
            err => {
              console.log("Error occured");
              this.messageService.popToastError();
            });
        }
      });
    });
  }
  
   reviewCartValidateStep() {
     if (this.orderProccess) {
       $('#reviewCartDiv').attr("data-toggle", "collapse");
       $('#reviewCartDiv').attr("data-parent", "#accordion");
       $('#reviewCartDiv').attr("href", "#collapseTwo");
       let el: HTMLElement = this.reviewCartDiv.nativeElement as HTMLElement;
       el.click();
     } else {
       var errorMessage = "Please fill step 1";
       this.messageService.validationError(errorMessage);
     }
   }

   paymentValidateStep() {
     if (!this.orderProccess) {
        var errorMessage = "Please fill step 1";
        return this.messageService.validationError(errorMessage);
     }
     if (!this.reviewProccess) {
        var errorMessage = "Please fill step 2";
        return this.messageService.validationError(errorMessage);
     }
     if (this.orderProccess && this.reviewProccess) {
       $('#paymentDiv').attr("data-toggle", "collapse");
       $('#paymentDiv').attr("data-parent", "#accordion");
       $('#paymentDiv').attr("href", "#collapseThree");
       let el: HTMLElement = this.paymentDiv.nativeElement as HTMLElement;
       el.click();
     } else {
       var errorMessage = "Please fill step 1 and step 2 ";
       this.messageService.validationError(errorMessage);
     }
   }
    
   deductInGrandTotal(useStoreCredit) {
       this.spinnerService.start();
       this.useStoreCredit=useStoreCredit;
       var total = this.subTotal + this.allshippingMethodTotal + this.salesTax;
       var storeCredit = Number(this.storeCredit)
       if (this.useStoreCredit == true) {
           if (storeCredit >= total) {
               this.spentStoreCredit=storeCredit - total;
               this.http.get(environment.context_root + '/credit/addInCart/'+ this.spentStoreCredit.toFixed(2) + '/' + this.cusToken )
                   .subscribe((res) => {
                       this.grandTotal = 0;
                       this.shippingFree = true;
                       this.stripMethod = "free";
                       console.log("this.stripMethod 1  " + this.stripMethod);
                       this.availableCredit=false; 
                       this.appliedCredit=true; 
                       this.spinnerService.end();
                   },
                   err => {
                       this.messageService.popToastError();
                   });
           } else {
               this.spentStoreCredit = storeCredit;
               this.http.get(environment.context_root + '/credit/addInCart/' + this.spentStoreCredit.toFixed(2) + '/' + this.cusToken)
                   .subscribe((res) => {
                       this.grandTotal = total - storeCredit;
                       console.log("grandTotal  " + this.grandTotal);
                       this.stripMethod = "stripecreditcards";
                       this.shippingFree = false;
                       console.log("this.stripMethod 2  " + this.stripMethod);
                       this.availableCredit=false; 
                       this.appliedCredit=true; 
                       this.spinnerService.end();
                       },
                       err => {
                           this.messageService.popToastError();
                       }); 
           }     
       } else {
           this.http.get(environment.context_root + '/credit/removeInCart/'+ this.spentStoreCredit.toFixed(2) + '/' + this.cusToken)
               .subscribe((res) => {
                   if (res.json() == true) {
                       this.spentStoreCredit = 0;
                       this.grandTotal = total;
                       this.shippingFree = false;
                       this.stripMethod = "stripecreditcards";
                       console.log("this.stripMethod 3  " + this.stripMethod);
                       this.availableCredit = true;
                       this.appliedCredit = false;
                       this.spinnerService.end();
                   }else{
                       this.messageService.popToastError();
                   }
               },
               err => {
                   this.messageService.popToastError();
               });
       }
   }
   
   fadeOut() {
     $(".minicart").fadeOut(1000);
   }
    
   getrememberMe() {
      /*var flag = this.cookieService.get('cmVtZW1iZXI=');
      if (flag == "true") {
          this.loginData.username = this.cookieService.get('dXNlcm5hbWU=');
          //this.loginData.password = atob(this.cookieService.get('cGFzc3dvcmQ='));
          this.loginData.password = this.cookieService.get('cGFzc3dvcmQ=');
          this.remember=true;
      }*/
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
              //this.loginService.setRememberMe(this.loginData.username, this.loginData.password, this.remember);
              this.setRememberMe(this.loginData.username, this.loginData.password, this.remember);
          }
      }
  } 
  forgotPassword() {
      if (this.loginForm.controls.username.status == "VALID") {
          //this.loginService.resetPasswordLink(this.loginData.username);
          this.resetPasswordLink(this.loginData.username);
      } else {
          var error = "Email not found please enter valid email";
          this.messageService.validationError(error);
      }
  }
    
  setRememberMe(username, password, remember) {
      /*this.cookieService.put("dXNlcm5hbWU=", username);
      //this.cookieService.put("cGFzc3dvcmQ=", btoa(password));
      this.cookieService.put("cGFzc3dvcmQ=", password);
      this.cookieService.put("cmVtZW1iZXI=", remember);*/
  }

  resetPasswordLink(username) {
      var customer = {
          "email": username,
          "template": "email_reset",
          "websiteId": 1
      }
      this.http.put(environment.context_root + '/forgotPassword', customer)
          .subscribe((res) => {
              console.log(res);
              if (res.json() == true) {
                  var success = "Reset password link send on your mail successfully";
                  this.messageService.popToastSuccess(success);
              } else {
                  var error = "Email not found please enter valid email";
                  this.messageService.validationError(error);
              }
          },
          err => {
              console.log("Error in  forgot password");
              this.messageService.popToastError();
          });
  }      
      
  
}
export class GlobalValidator {
  public static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  public static PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!#$%&'(*+),-./:;<=>?@[\]^_`{|}~\s]).{8,}$/;
}