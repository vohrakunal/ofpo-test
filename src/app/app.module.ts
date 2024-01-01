import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpModule} from '@angular/http';
import { LocalStorageModule } from '@ngx-pwa/local-storage';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService, ToasterConfig} from 'angular2-toaster';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { Angular2SocialLoginModule } from "angular2-social-login";
import { DatePipe } from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import { ScrollEventModule } from 'ngx-scroll-event';
import { AdsenseModule } from 'ng2-adsense';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { ArticleComponent } from './article/article.component';
import { Article2Component } from './article2/article2.component';
import { ProductComponent } from './product/product.component';
import { ProductdetailComponent } from './productdetail/productdetail.component';
import { BrandsComponent } from './brands/brands.component';
import { Brands2Component } from './brands2/brands2.component';
import { CartComponent } from './cart/cart.component';
import {ThankyouComponent} from './thankyou/thankyou.component';
import {RegisterComponent} from './register/register.component';
import {MyaccountComponent} from './myaccount/myaccount.component';
import {LoginComponent} from './login/login.component';
import {MenuService} from './menu/menu.service';
import {ProductlistService} from './home/productlist.service';
import {ProductService} from './product/product.service';
import {ArticleService} from './article/article.service';
import {CheckoutService} from './checkout/checkout.service';
import {MyAccountService} from './myaccount/myaccount.service';
import {CMSService} from './cms/cms.service';
import {LoginService} from './login/login.service';
import {TagsService} from './tags/tags.service';


import {DateSuffix} from './util/datesuffix';

import {StorageService} from './storage/storage.service';
import {CartService} from './cart/cart.service';
import {WishlistService} from './wishlist/wishlist.service';
import {ProductUtilService} from './util/product-util.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { MenuComponent } from './menu/menu.component';
import { LandingComponent } from './landing/landing.component';
import { MessageService} from './message/message.service';
import { SpinnerService} from './spinner/spinner.service';
import { MyFooterComponent} from './myfooter/myfooter.component';
import {MainComponent} from './main/main.component';
import { ImageZoomComponent } from './image-zoom/image-zoom.component';
import { MoveBackgroundDirective } from './move-background.directive';



let providers = {
    "google": {
      "clientId": "658649531945-uvo7t34dm6ni1m9o8c2mosbdhmdp9065.apps.googleusercontent.com"
    },
    "facebook": {
      "clientId": "350826748907699",
      "apiVersion": "v3.2" //like v2.4
    }
  };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ArticleComponent,
    Article2Component,
    ProductComponent,
    ProductdetailComponent,
    BrandsComponent,
    Brands2Component,
    CartComponent,
    CheckoutComponent,
    ThankyouComponent,
    MenuComponent,
    LandingComponent,
    RegisterComponent,
    MyaccountComponent,
    MyFooterComponent,
    LoginComponent,
    MainComponent,
    DateSuffix,
    ImageZoomComponent,
    MoveBackgroundDirective
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpModule,
    LocalStorageModule,
    FormsModule,
    ToasterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    Angular2SocialLoginModule,
    Ng4LoadingSpinnerModule.forRoot(),
    FileUploadModule,
    ScrollEventModule,
    AdsenseModule.forRoot({
      adClient: 'ca-pub-8987806591582416',      
    })
  ],
  providers: [MenuService , ProductlistService , ProductService , 
      ArticleService , StorageService , CartService , ProductUtilService,ToasterService,MessageService,
      CheckoutService,MyAccountService,WishlistService,DatePipe,SpinnerService,
        CMSService,CookieService,TagsService , LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
Angular2SocialLoginModule.loadProvidersScripts(providers);
  
  