import { Component, OnInit,ViewChild, ViewChildren , QueryList , ElementRef,ChangeDetectorRef, Inject } from '@angular/core';
import { ScrollEvent } from 'ngx-scroll-event';
import {MenuService} from '../menu/menu.service';
import {ProductlistService} from './productlist.service';
import {ProductService} from '../product/product.service';
import {StorageService} from '../storage/storage.service';
import {MessageService} from '../message/message.service';
import {CartService} from '../cart/cart.service';
import {WishlistService} from '../wishlist/wishlist.service';
import {SpinnerService} from '../spinner/spinner.service';
import {ProductUtilService} from '../util/product-util.service';
import {ActivatedRoute,Router} from '@angular/router';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {environment} from '../../environments/environment';
import {TagsService} from '../tags/tags.service';
import {CMSService} from '../cms/cms.service';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  private owlf1:boolean = true;
  @ViewChild('owl1')owl1:ElementRef;
  @ViewChild('prdDesc')prdDesc:ElementRef;
  @ViewChild('articleAd')articleAd : ElementRef;
  @ViewChild('productAd')productAd : ElementRef;
  @ViewChildren('articleInlineAd')articleInlineAds : QueryList<any>;
  @ViewChildren('productInlineAd')productInlineAds : QueryList<any>;
  menuItems:Menu[];
  //products:Product[];
  //articles:Article[];
  pageSize:number;
  currentPage:number;
  totalCount:number;cartItems:any = [];
  artPageSize:number;
  artCurrentPage:number;
  artTotalCount:number;
  singleProduct:any = {};
  selectedProductAttribues:any = {};
  categoryId:any = 14;
  cusToken;
  wishList:any=[];
  
  productPageNumber:number;
  products:any=[];
  productsList:any=[];
  productsIdList:any=[];
  totalProduct:number;
  productFetchFlag:boolean;
  
  articalPageNumber:number;
  articles:any=[];
  articlesList:any=[];
  articlesIdList:any=[];
  totalArticle:number;
  articleFetchFlag:boolean;
  
  productIndexCount:number;
  displayProductAdds:any=[];
  displayArticalAdds:any=[];
  articleIndexCount:number;
  priceFilterType:string;
  productByTagId: any = [];
  taglist:any=[];
  
  //The following attributes are used for the filter.
  tags:any // List of all tags
  tagMap:any = {} // This is to store one tag as a map ( A:tag)
  tagMapList:any // List of tag maps
  stage3Tags:any=[]; // List of all Stage3 tags that will be displayed in Filter.
  stage4Tags:any=[]; // List of all Stage4 tags that will be displayed in Filter.
  stage4aTags:any=[]; // List of all Stage4a tags that will be displayed in Filter.
  stage5Tags:any=[]; // List of all Stage5 tags that will be displayed in Filter.

  
  constructor(private menuService : MenuService ,private productlistService : ProductlistService ,private productService : ProductService ,
              private storageService : StorageService ,private cartService: CartService ,private productUtilService : ProductUtilService ,
              private route : ActivatedRoute,private messageService :MessageService,private cd : ChangeDetectorRef,
              private wishlistService:WishlistService,private router :Router,public http: Http,private spinnerService :SpinnerService ,
              private tagsService : TagsService , private cmsService : CMSService) {
    
    this.menuService.getMenu().subscribe((menuItems) =>{
        this.menuItems = menuItems;
    });

   
      
    
    
    //Call to fetch tags
    this.fetchAllTags();
    
      /*
    if (this.categoryId == "") {
        this.storageService.getCategoryId().subscribe((id) => {
            if (id != null && id != undefined) {
                this.categoryId = id;
                this.storageService.setCategoryId(this.categoryId);
            }
        });
    } */ 
    
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.productPageNumber=1;
    this.articalPageNumber=1;
    this.totalProduct=0;
    this.productFetchFlag=true;
    this.articleFetchFlag=false;
    this.totalArticle=0;
    this.productIndexCount=0;
    this.articleIndexCount=0;
    this.priceFilterType="none";  
    $(".footer-home").fadeOut(1000);  
   
    this.route.paramMap.subscribe((params) => {

      var categoryIdForBackground = params.get('categoryId');
      if(categoryIdForBackground == null){
        categoryIdForBackground = this.categoryId;
      }
      this.productService.getProduct("BackGround_"+categoryIdForBackground).subscribe((data) => {
        var image =  data.imageValue;
        $('body').css('position', 'relative');
        $('body').css('background', 'url('+ image +')');
        $('body').css('background-size', 'cover');
      });

        if (params.get('sitemap') != null && params.get('stageValue') != null && params.get('stage') != "") {
            this.getCategoryId();
            this.productlistService.searchSiteProducts(params.get('stageValue'), params.get('stage')).subscribe((productdata) => {
                this.productFetchFlag = false;
                this.products = [];
                this.products = productdata.products;              
                this.productlistService.searchSiteArticles(params.get('stageValue'), params.get('stage')).subscribe((data) => {
                    this.articleFetchFlag = false;
                    this.productFetchFlag = false;
                    var productsTemp=[];
                    if(data.articles) {
                      this.articles = data.articles;
                    }
                    if (data.length > 1 && productdata.products == 0) { // If there is no product in the results then do this
                      this.getRelatedProductandSecondaryProduct(data.articles[0].brand, this.categoryId, data.articles[0].sku, "Product" , this.products);
                    }else {
                    if (data.length == 0) {
                      if (productdata.products.length > 1  && productdata.products !=undefined) {
                        var relatedProductsList = {
                            'articles': []
                        };
                        console.log("Article ZERO. Caling related stuff ");
                        this.getRelatedProductandSecondaryProduct(this.products[0].brand, this.categoryId, this.products[0].sku, "Articles" , relatedProductsList);
                      }

                    } else {
                            if (data.articles.length == 1 && productdata.length == 0) {
                                return this.router.navigate([this.productUtilService.getPath(data.articles[0].article_detail_display), data.articles[0].sku, this.categoryId]);
                            } else {
                                this.articles = data.articles;
                                this.articleDataList(data);
                            }
                        }
                    }
                    if (this.products.length > 0) {
                        this.setConfigurableProductPrice(productdata);
                        this.productUtilService.classifyProducts(this.products);
                      }      
                });
                
            });

        }else{
     if (params.get('categoryId') != null && params.get('sercahName') != null && params.get('sercahName') != "") {
         var sercahName =params.get('sercahName');
         this.getCategoryId();
         this.menuService.getSerachProduct(sercahName.toUpperCase()).subscribe((data) => {
             this.productByTagId=[];
             this.articles=[];
             this.products = [];
             this.products = data.products;
             this.articleFetchFlag = false;
             this.productFetchFlag = false;
             this.setConfigurableProductPrice(data);
             this.productlistService.serachByTag(sercahName.toUpperCase()).subscribe((tages) => {
                 if (tages.stage2_tags.length) {
                     this.addTages(tages.stage2_tags);
                 }
                 if (tages.stage3_tags.length) {
                     this.addTages(tages.stage3_tags);
                 }
                 if (tages.stage4_tags.length) {
                     this.addTages(tages.stage4_tags);
                 }
                 if (tages.stage4a_tags.length) {
                     this.addTages(tages.stage4a_tags);
                 }
                 if (tages.stage5_tags.length) {
                     this.addTages(tages.stage5_tags);
                 }  
                     this.serachTages();
             });
         });
      } else {
        
          if (params.get('categoryId') != null) {
              this.categoryId = params.get('categoryId');
          }            
          this.storageService.setCategoryId(this.categoryId); 
          this.getProducts();
          this.getArticals();
      }

      this.cmsService.getAdBlock("AD_H_A_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.articleAd.nativeElement.insertAdjacentHTML('beforeend', data.content);
        }
        
      });

      this.cmsService.getAdBlock("AD_H_P_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.productAd.nativeElement.insertAdjacentHTML('beforeend', data.content);
        }
        
      });

      

     }




    });
    
     $('.navmenu').show();
     $('.serach2').show();
     $('.myaccount').show();
     $('.footerdisplay').show(); 
    
       
    this.storageService.getHomeDirection().subscribe((direction) => {
      if (direction) {
        setTimeout(
        function() {
            $('.productinner').css('opacity', "1");
            $('.productinner').css('background', "transparent");
        }, 5000);
        $('.articlebox').remove();
        $('.productbox').remove();
        $('.productbox1').remove();
      }
    });
    
    this.storageService.getCustomerCartId().subscribe((custoken) => {
       if (custoken != "" && custoken != null) {
          this.cusToken = custoken;
        }
    });
   }
 
  gotoProductPage(sku){
   return this.router.navigate(['/product', sku, this.categoryId]);       
  }
    
  getCategoryId(){
      this.storageService.getCategoryId().subscribe((id) => {
          if (id != null && id != undefined) {
              this.categoryId = id;
              this.storageService.setCategoryId(this.categoryId);
          }
      });
  }    
      
  setConfigurableProductPrice(data){
    // Set the price for configurable product by calling the getProduct method.
    // This method internally gets the children product and sets the price from the first child.
    for (var j = 0; j < data.products.length; j++) {
          var flag = this.productByTagId.includes(data.products[j].productId);
          if (flag == false) {
              this.productByTagId.push(data.products[j].productId);
          }            
          if(data.products[j].type_id == 'configurable'){
            this.productService.getProduct(data.products[j].sku).subscribe((configurableProduct) => {
              for (var k = 0; k < this.products.length; k++) {
                if(this.products[k].sku == configurableProduct.sku){
                  this.products[k].price = configurableProduct.price;
                }
              }
            });
          }
     }
  }
  
  addTages(Tags) {
      for (var i = 0; i < Tags.length; i++) {
          if (Tags[i].value != "" && Tags[i].attribute_code != "") {
              this.taglist.push({
                  "value": Tags[i].value,
                  "attribute_code": Tags[i].attribute_code
              });
          }
      }
  }    
    
  serachTages() {
     
      for (var i = 0; i < this.taglist.length; i++) {
          this.productlistService.serachProductsByTag(this.taglist[i].attribute_code, this.taglist[i].value).subscribe((product) => {
              for (var j = 0; j < product.products.length; j++) {
                  var flag = this.productByTagId.includes(product.products[j].productId);
                  if (flag == false) {
                      this.productByTagId.push(product.products[j].productId);
                      if (product.products[j].productType == 'A') {
                          this.articles.push(product.products[j]);
                      } else {
                          this.products.push(product.products[j]);
                      }
                  }
              }
              if (i == this.taglist.length) {
                 this.getSerachRelatedProduct();
              }
          });
      }
      if(!this.taglist.length){
         this.getSerachRelatedProduct();
      }    
  }
    
  getSerachRelatedProduct() {
      if (this.articles.length > 1 && this.products.length == 0) {
        this.getRelatedProductandSecondaryProduct(this.articles[0].brand, this.categoryId, this.articles[0].sku, "Product" , this.products);
      } else if (this.articles.length == 1 && this.products.length == 0) {
          return this.router.navigate([this.productUtilService.getPath(this.articles[0].article_detail_display), this.articles[0].sku, this.categoryId]);
      } else if (this.products.length == 1 && this.articles.length == 0) {
          return this.router.navigate(['/product', this.products[0].sku, this.categoryId]);
      } else if (this.articles.length == 0 && this.products.length > 1) {
          this.getRelatedProductandSecondaryProduct(this.products[0].brand, this.categoryId, this.products[0].sku, "Articles" , this.articles);
      }
  }    
  

  getRelatedProductandSecondaryProduct(brand, categoryId, sku, Type , productList) {

          this.productService.getRelatedProductsSecondary(brand, categoryId, sku).subscribe((relatedProduct) => {
              for (var j = 0; j < relatedProduct.length; j++) {
                  if (Type == "Product") {
                      if (relatedProduct[j].productType == 'P') {
                        var productExists = this.products.find(function(element) {
                          return element.sku == relatedProduct[j].sku;
                        });
                        if(productExists == undefined){
                          this.products.push(relatedProduct[j]);
                        }
                      }
                  } else {
                      if (relatedProduct[j].productType == 'A') {
                        var articleExists = this.articles.find(function(element) {
                          return element.sku == relatedProduct[j].sku;
                        });
                        if(articleExists == undefined){
                          this.articles.push(relatedProduct[j]);
                        }
                        
                      }
                  }
              }

              if (this.articles.length == 1 && this.products.length == 0) { // Only one article and no products then go to article page.
                return this.router.navigate([this.productUtilService.getPath(this.articles[0].article_detail_display), this.articles[0].sku, this.categoryId]);
              }
              if(this.products.length == 1 && this.articles.length ==0){ // Only one product and no articles then go to Product page.
                this.gotoProductPage(this.products[0].sku);
              }

              if (this.products.length > 0) {
                var data = {products : this.products};
                this.setConfigurableProductPrice(data);
                this.productUtilService.classifyProducts(this.products);
              }
              
              this.articleDataList(this.articles);

          });
      
      
  }   
    
    
  handleScroll(event: ScrollEvent) {
    //console.log('scroll occurred', event.originalEvent);
    if (event.isReachingBottom) {
      console.log(`the user is reaching the bottom`);
      if (this.productFetchFlag == true) {
        this.spinnerService.start();
        this.productPageNumber = this.productPageNumber + 1;
        this.getProducts();
      }
    }
    if (event.isWindowEvent) {
      console.log(`This event is fired on Window not on an element.`);
    }
  }
  
  handleScrollArtical(event: ScrollEvent){
    if (event.isReachingBottom) {
      //console.log(`the user is reaching the bottom`);
      if (this.articleFetchFlag == true) {
        this.spinnerService.start();
        this.articalPageNumber = this.articalPageNumber + 1;
        this.getArticals();
      }
    }
    if (event.isWindowEvent) {
      console.log(`This event is fired on Window not on an element.`);
    }
  }
  
  ngOnInit() {
    
  }
 
  closeModal(){
  // alert("super");
  $("#owl-demo").owlCarousel('destroy');
  // $("#myModal").modal('hide');
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

  getProductClassification = function (product:Product , index : number){
     return this.productUtilService.getProductClassification(product , index , this.products,"HOME");
  }
   
  getProductIndexForAds = function(productClassification, index: number) {
      this.productIndexCount=this.productUtilService.getProductBlockCount(productClassification,this.productIndexCount);
      
      if (this.productIndexCount > 6) {
          this.productIndexCount = this.productIndexCount - 1;
      }       
              
      if (this.productIndexCount == 6) {
          var flag = this.displayProductAdds.includes(index);
          if (flag == false) {
              this.displayProductAdds.push(index);
              this.productIndexCount = 0;
          }
          //console.log(" this.displayProductAdds" + JSON.stringify(this.displayProductAdds));
      }
  }
  
  getArticleClassification = function (article:Article , index : number){
     return this.productUtilService.getArticleClassification(article , index , this.articles);
  }  
    
  getArticalIndexForAds = function(articleClassification, index: number) {
      this.articleIndexCount=this.productUtilService.getArticalBlockCount(articleClassification,this.articleIndexCount);
      if(this.articleIndexCount > 6){
         this.articleIndexCount = this.articleIndexCount - 1;
      }    
      if (this.articleIndexCount == 6) {
          var flag = this.displayArticalAdds.includes(index);
          if (flag == false) {
              this.displayArticalAdds.push(index);
              this.articleIndexCount = 0;
          }
          //console.log(" this.displayArticalAdds" + JSON.stringify(this.displayArticalAdds));
      }
  }
  
  getProductDetails = function(sku: string,cartIconClick) {
   this.fadeOut();
   this.singleProduct={}; 
   this.productService.getProduct(sku).subscribe((data) => {
      this.singleProduct = data;
      if(cartIconClick == false || cartIconClick == undefined){
      //setTimeout(function(){this.owlf1 = false} , 1000); 
      this.prdDesc.nativeElement.innerHTML = "";
      var description = this.singleProduct.description;
      if (description != undefined) {
        this.prdDesc.nativeElement.insertAdjacentHTML('beforeend', this.singleProduct.description);
      }
      this.owlf1 = false;
     }else{
        this.addItemToCart();
     }
    });
  }

  setSelectedSize = function(valueCode : number){
    this.selectedProductAttribues.size = valueCode;
  }
    
  setSelectedColor = function(valueCode : number){
    this.selectedProductAttribues.color = valueCode;
  }

  getPath = function(article_detail_display : string){
    return this.productUtilService.getPath(article_detail_display);
  }

  addItemToCart = function(){
    if(this.singleProduct.type_id == 'configurable') {
      if (this.cartService.configurableProductValidation(this.selectedProductAttribues) == true) {
        for (var i = 0; i < this.singleProduct.children.length; i++) {
          if ((this.singleProduct.children[i].colorValueCode == this.selectedProductAttribues.color) &&
            (this.singleProduct.children[i].sizeValueCode == this.selectedProductAttribues.size)) {
            console.log("Adding item to cart " + this.singleProduct.children[i].sku);
            this.cartService.addItemToCart(this.singleProduct.children[i].sku, 1, this.singleProduct);
            this.selectedProductAttribues = {};
            $("#quickview_close").click();
          }
        }
      }
    } else {
      this.cartService.addItemToCart(this.singleProduct.sku , 1 ,  this.singleProduct);
      $("#quickview_close").click();
    }
    //$("#quickview_close").click();
  }
  
  fetchProductsForCat = function(category : number){
    //console.log("Selected category " + category);
    //this.categoryId = category;
    //this.getProducts();
  }
 
  applyPriceFilter(filterType:string) {
    this.priceFilterType=filterType;
    $("#quickview_close1").click();
    this.productPageNumber=1;  
    this.products=[];
    this.productsList=[];
    this.productsIdList=[];
    this.productFetchFlag = true;   
    this.getProducts();
  }  
    
  getProducts() {
    if(this.productFetchFlag == true){
    this.productlistService.getProducts(this.categoryId,this.productPageNumber,this.priceFilterType).subscribe((data) => {
    
      this.productUtilService.classifyProducts(data.products);
      this.products = data.products;
      for (var j = 0; j < data.products.length; j++) {      
        // Set the price for configurable product by calling the getProduct method.
        // This method internally gets the children product and sets the price from the first child.
        if(data.products[j].type_id == 'configurable'){
          this.productService.getProduct(data.products[j].sku).subscribe((configurableProduct) => {
            for (var k = 0; k < this.products.length; k++) {
              if(this.products[k].sku == configurableProduct.sku){
                this.products[k].price = configurableProduct.price;
              }
            }
          });
        }
      }     

      //this.products = data.products;
      this.pageSize = data.pageSize;
      this.currentPage = data.currentPage;
      this.totalCount = data.totalCount;
      this.totalProduct=this.products.length;
      if (this.totalProduct < this.totalCount) {
        this.productFetchFlag = true;
      } else {
        this.productFetchFlag = false;
      }
      this.productClassificationAdds();  
      this.wishlistService.productCheckInWishList(this.products);
      this.spinnerService.end();
      this.cd.detectChanges();
    });
    }
  }
    
  productClassificationAdds() {
      this.displayProductAdds = [];
      this.productIndexCount = 0;
      for (var i = 0; i < this.products.length; i++) {
          this.getProductIndexForAds(this.productUtilService.getProductClassification(this.products[i], i, this.products, "HOME"), i);
      }
      this.cmsService.getAdBlock("AD_H_P_I_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.productInlineAds.forEach(div => div.nativeElement.insertAdjacentHTML('beforeend', data.content));          
        }
        
      });    
  }  
   
  getArticals(){
    this.productlistService.getArticles(this.categoryId,this.articalPageNumber).subscribe((data) =>{
       this.articles = data.articles;
       this.articleDataList(data);       
    });
  }
    
  getArticalsByBrand(brand){
     this.productlistService.getArticlesByBrand(brand).subscribe((data) =>{
       this.articleFetchFlag=false;  
       this.articleDataList(data);
    }); 
  }    
    
  articleDataList(data){       
      //this.articles = data.articles;
      this.artPageSize = data.pageSize;
      this.artCurrentPage = data.currentPage;
      this.artTotalCount = data.totalCount;
      this.totalArticle=this.articles.length;
      if (this.totalArticle < this.artTotalCount) {
        this.articleFetchFlag = true;
      } else {
        this.articleFetchFlag = false;
      }
      this.productUtilService.classifyArticles(this.articles);
      this.articalClassificationAdds();
      this.spinnerService.end();
      this.cd.detectChanges();
   }   
    
  articalClassificationAdds() {
      this.displayArticalAdds = [];
      this.articleIndexCount = 0;
      for (var i = 0; i < this.articles.length; i++) {
          this.getArticalIndexForAds(this.productUtilService.getArticleClassification(this.articles[i], i, this.articles), i);
      }
      this.cmsService.getAdBlock("AD_H_A_I_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.articleInlineAds.forEach(div => div.nativeElement.insertAdjacentHTML('beforeend', data.content));          
        }
        
      });
  }  
  
  fetchAllTags(){

    this.tagsService.getAllTags().subscribe((data) => {
      this.tags = data;
      this.tagMap = {};
      if (this.tags) {
        for (let tag of this.tags) {
          if(tag.label != " " && tag.label != "" && tag.label){
            if(tag.stage == "stage3_tags"){
              this.stage3Tags.push(tag);
              
            }
            if(tag.stage == "stage4_tags"){
              this.stage4Tags.push(tag);              
            }
            if(tag.stage == "stage4a_tags"){
              this.stage4aTags.push(tag);              
            }
            if(tag.stage == "stage5_tags"){
              this.stage5Tags.push(tag);              
            }
            if(tag.stage == "stage2_tags"){
              let key = tag.label.charAt(0).toUpperCase();
              var tagList = this.tagMap[key];
              if(tagList){
                tagList.push(tag);
              } else {
                this.tagMap[key] = [tag];
              }

            }
          }
       }
      }
      
    });
  
  }
  
  fadeOut() {
    $(".minicart").fadeOut(1000);
  }
  
  homePageDirection(){
    this.storageService.setHomeDirection(true);
  }
  
  addItemToWishList(productId, type_id) {
    this.wishlistService.addItemToWish(productId, type_id);
  }
  
  addItemToWish(sku, product) {
    this.storageService.getCustomerId().subscribe((customer_Id) => {
      if (customer_Id != "" && customer_Id != null) {
        if ($('#wishlistname' + sku).hasClass("glyphicon glyphicon-heart") || $('#wishlistname' + sku).hasClass("glyphicon ng-star-inserted glyphicon-heart")) {
          this.storageService.getWishListItems().subscribe((list) => {
            this.wishlistService.removeConfigrableProductSelected(sku, product, customer_Id, list);
          });
        } else {
          this.getProductDetails(sku, false);
        }
      } else {
        this.getProductDetails(sku, false);
      }
    });
  }
  
  addConfigItemToWishList(productId, product) {
    this.storageService.getCustomerId().subscribe((customer_Id) => {
      if (this.cartService.configurableProductValidation(this.selectedProductAttribues) == true) {
        for (var i = 0; i < this.singleProduct.children.length; i++) {
          if ((this.singleProduct.children[i].colorValueCode == this.selectedProductAttribues.color) &&
            (this.singleProduct.children[i].sizeValueCode == this.selectedProductAttribues.size)) {
            this.selectedProductAttribues = {};
            this.productService.getProduct(this.singleProduct.children[i].sku).subscribe((data) => {
              if (customer_Id != null && customer_Id != undefined && customer_Id != "") {
                this.wishlistService.addToWishList(data.productId, customer_Id);
                this.wishlistService.wishListSelected(product.sku, product.type_id);
                this.singleProduct = {};
                $("#quickview_close").click();
              } else {
                this.storageService.setGeustWishList(data.productId);
                $("#quickview_close").click();
                this.messageService.popToastForRegister();
                this.router.navigate(['/registration']);
              }
            });
          }
        }
      }
    });
  }  

  
}



interface Menu {
  id : number;
  name : string;
  is_active : boolean;
}

interface Product {
  sku : string;
  type_id : string;
  imageValue : string;
  productClassification : string;
  price:Number;
  brand:string;
  name:string;
  productId:string;
}

interface Article {
  sku : string;
  type_id : string;
  imageValue : string;
  articleClassification : string;
  brand:string;
  name:string;
  articleDate:Date;
  magazine:string;
  article_detail_display:string;
}