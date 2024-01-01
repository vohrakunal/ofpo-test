import { Component , OnDestroy } from '@angular/core';
import { ToasterConfig } from 'angular2-toaster';
import {Router , NavigationEnd} from '@angular/router';
import {NgForm, NgModel, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl} from '@angular/forms';
import {MessageService} from './message/message.service';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {MyAccountService} from './myaccount/myaccount.service';
import {environment} from 'environments/environment';
import { Subscription } from 'rxjs/Subscription';



declare var jquery: any;
declare var $: any;

import {StorageService} from './storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ofpoison';
  public config: ToasterConfig = new ToasterConfig({timeout: 3000,limit: 1});
  subscribeForm: FormGroup;
  subscribeEmail;
  submitAttempt: boolean = false;
  submitted: boolean = false;
  cusToken;
  updateLetter={}; 
  customerData={
    firstname: '',
    lastname: '',
    email: '',    
  }; 
  subscription: Subscription;
  showNewsLetter:boolean;
 
  constructor(private router: Router, private formBuilder: FormBuilder, private storageService: StorageService, public http: Http, private messageService: MessageService, private myAccountService: MyAccountService) {
    
    this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            console.log("Inside router event" + event); 
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
      })
    
    
    this.subscribeForm = formBuilder.group({
          subscribeEmail: ['', Validators.compose([Validators.required, Validators.pattern(GlobalValidator.EMAIL_REGEX)])],
      });
      this.showNewsLetter = false;

      this.subscription = this.storageService.getNewsLetterAsync().subscribe(value => {
          this.showNewsLetter = value.subscribed;
          console.log("Value changed for NewsLetter " + value.subscribed);
      });

      this.storageService.getCustomerCartId().subscribe((custoken) => {
          if (custoken != "" && custoken != null && custoken != undefined) {
              this.cusToken = custoken;
              this.storageService.getNewsLetter().subscribe((value) => {
                  if (value == true) {
                      this.showNewsLetter = true;
                  }
                  this.getDetails();
              });

          }
      });

  }
  getDetails() {
      if (this.cusToken != "" && this.cusToken != null && this.cusToken != undefined) {
          this.myAccountService.getCustomerAllInfo(this.cusToken).subscribe((data) => {
              this.customerData = {
                  firstname: data.customer.firstname,
                  lastname: data.customer.lastname,
                  email: data.customer.email,
              }
              this.subscribeEmail = data.customer.email;
          });
      }
  }
    
    
  jointoSubscribe() {
    if (!this.subscribeForm.valid) {
      this.submitAttempt = true;
      console.log('failed! failed! failed!');
      return;
    } else {
      console.log("success! success! success!");
      console.log(this.subscribeForm.value);
      $('.footer_hide_show').hide();
      this.storageService.getCustomerCartId().subscribe((custoken) => {
        if (custoken != "" && custoken != null && custoken != undefined) {
          this.updateNewsLetter();
        } else {
          this.subscribeEmail='';
          this.router.navigate(['/login']);
        }
      });
    }
  }
    
  
  updateNewsLetter() {
      if(this.showNewsLetter == false){
          this.showNewsLetter=true;
      }else{
          this.showNewsLetter=false;
      }
      this.updateLetter = {
          customer: {
              firstname: this.customerData.firstname,
              lastname: this.customerData.lastname,
              email: this.customerData.email,
              websiteId: 1,
              "extension_attributes": {
                  "is_subscribed": this.showNewsLetter
              },
          }
      }
      this.http.put(environment.context_root + '/updateDetail/' + this.cusToken, this.updateLetter)
          .subscribe((res) => {
              console.log(res);
              var success = "News letter updated successfully";
              this.messageService.popToastSuccess(success);
              this.storageService.setNewsLetter(this.showNewsLetter);
              this.getDetails();
          },
          err => {
              console.log("Error in  user newsletter ");
              this.messageService.popToastError();
          });
  }
  
}
export class GlobalValidator {
  public static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}