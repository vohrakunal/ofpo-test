import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArticleComponent} from './article/article.component';
import { Article2Component} from './article2/article2.component';
import { ProductComponent} from './product/product.component';
import {ProductdetailComponent} from './productdetail/productdetail.component';
import {BrandsComponent} from './brands/brands.component';
import {Brands2Component} from './brands2/brands2.component';
import {ApidataService} from './resolver/apidata.service';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {LandingComponent} from './landing/landing.component';
import {ThankyouComponent} from './thankyou/thankyou.component';
import {RegisterComponent} from './register/register.component';
import {MyaccountComponent} from './myaccount/myaccount.component';
import {MyFooterComponent} from './myfooter/myfooter.component';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';



const routes: Routes = [
  { path: 'home/:categoryId', component: HomeComponent },
  { path: 'home/:categoryId/:sercahName', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:sitemap/:stageValue/:stage', component: HomeComponent },
  { path: 'landing', component: LandingComponent },
  //{ path: '', component: MainComponent },
  

  { path: '', component: HomeComponent , data: { categoryId: '14' } },
  //{ path: 'login/:reload', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  /*{ path: 'article/:sku', 
    component: ArticleComponent ,
    resolve: { articleData : ApidataService }
  },*/
  { path: 'article/:sku/:categoryId', component: ArticleComponent },
  { path: 'article2/:sku/:categoryId', component: Article2Component },
  { path: 'product/:sku/:categoryId', component: ProductComponent },
  { path: 'productdetail', component: ProductdetailComponent },
  { path: 'brands/:categoryId', component: BrandsComponent },
  { path: 'brands2', component: Brands2Component },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'thankyou/:orderId', component: ThankyouComponent },
  { path: 'registration', component: RegisterComponent },
  { path: 'myaccount', component: MyaccountComponent },
  { path: 'myfooter/:category/:currentTab', component: MyFooterComponent }
];

@NgModule({
  imports: [
     RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [ RouterModule ],
  providers: [ApidataService]
})
export class AppRoutingModule { }
