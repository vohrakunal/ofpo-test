import {Component, OnInit} from '@angular/core';
import {ScrollEvent} from 'ngx-scroll-event';
import {ActivatedRoute,Router} from '@angular/router';
declare var jquery: any;
declare var $: any;

import {ProductlistService} from '../home/productlist.service';
import {MessageService} from '../message/message.service';
import {SpinnerService} from '../spinner/spinner.service';
import {ProductService} from '../product/product.service';
import {StorageService} from '../storage/storage.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent implements OnInit {
  categoryId: any = "";
  products: any = [];
  pageSize: number;
  currentPage: number;
  totalCount: number;
  brandName: string;
  productsList: any = [];
  productsIdList: any = [];
  brandFetchFlag: boolean;
  totalProduct: number;
  categoryIdLast: any = "";  

  constructor(private storageService: StorageService, private route: ActivatedRoute, private productService: ProductService, private spinnerService: SpinnerService,
    private messageService: MessageService, private productlistService: ProductlistService,private router :Router) {
     
    this.storageService.getCategoryId().subscribe((id) =>{
      this.categoryIdLast=id;
    });  
    
    this.route.paramMap.subscribe((params) => {
      if (params.get('categoryId') != null) {
        this.categoryId = params.get('categoryId');
        this.storageService.setCategoryId(this.categoryId);
      }
    });
    $('.navmenu').show();
    this.currentPage = 1;
    this.brandFetchFlag = true;
    this.totalProduct = 0;
  }

  ngOnInit() {
  }
  
  /*  
  handleScroll(event: ScrollEvent) {
    if (event.isReachingBottom) {
      console.log(`the user is reaching the bottom`);
      if (this.brandFetchFlag == true) {
        this.spinnerService.start();
        this.currentPage = this.currentPage + 1;
        if (this.brandName == '' || this.brandName == undefined || this.brandName == null) {
          this.getProducts(this.categoryId);
        }else{
          this.getBrandProducts('');
        }
      }
    }
    if (event.isWindowEvent) {
      console.log(`This event is fired on Window not on an element.`);
    }
  }*/

  getBrandProducts(name) {
    if (name != '') {
      this.brandName = name;
      this.brandFetchFlag = true;
      this.reAssign();
    }
    console.log("brand name" + this.brandName);
    //if (this.brandFetchFlag == true) {
      this.spinnerService.start();
      this.productService.getBrand(this.brandName).subscribe((data) => {
          //this.getProductPagination(data);
          if (!data.products.length) {
              var message = "Brand is not found";
              this.messageService.validationError(message);
          } else {
              this.products = data.products;
          }
          this.spinnerService.end();
      });
    //}
  }
  
  //goToHome() {
  //  this.router.navigate(['/home',this.categoryId]);
  //}    
   
  getProducts(categoryId) {
    if (this.categoryId != categoryId) {
      this.brandFetchFlag = true;
      this.reAssign();
    }
    this.categoryId = categoryId;
    if (this.brandFetchFlag == true) {
      //this.productlistService.getProducts(this.categoryId, this.currentPage).subscribe((data) => {
      //  this.getProductPagination(data);
      //});
    }
  }
  
  reAssign() {
    this.currentPage = 1;
    this.products = [];
    this.productsIdList = [];
    this.productsList = [];
  }
  
  getProductPagination(data){
    if (data.products.length) {
          var startArr = this.productsList.length;
          var endArr = this.productsList.length + data.products.length;
        } else {
          var message = "Brand is not available";
          this.messageService.validationError(message);
        }

        for (var j = 0; j < data.products.length; j++) {
          var flag = this.productsIdList.includes(data.products[j].productId);
          if (flag == false) {
            this.productsIdList.push(data.products[j].productId);
            this.productsList.push(data.products[j]);
          }
        }

        for (var i = startArr; i < endArr; i++) {
          if (i < this.productsList.length) {
            if (this.productsIdList.includes(this.productsList[i].productId)) {
              this.products.push(this.productsList[i]);
            } else {
            }
          }
        }
        this.pageSize = data.pageSize;
        this.currentPage = data.currentPage;
        this.totalCount = data.totalCount;
        this.totalProduct = this.products.length;
        if (this.products.length) {
          if (this.totalProduct < this.totalCount) {
            this.brandFetchFlag = true;
          } else {
            this.brandFetchFlag = false;
          }
        }
     this.spinnerService.end();
  }
  
   
    
    
}