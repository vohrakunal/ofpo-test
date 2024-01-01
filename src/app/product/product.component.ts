import { Component, OnInit, ViewChild, ViewChildren , QueryList , ElementRef } from '@angular/core';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {ActivatedRoute,Router} from '@angular/router';
import {ProductService} from './product.service';
import {ProductUtilService} from '../util/product-util.service';
import {ArticleService} from '../article/article.service';
import {MessageService} from '../message/message.service';
import {CartService} from '../cart/cart.service';
import {WishlistService} from '../wishlist/wishlist.service';
import {StorageService} from '../storage/storage.service';
import {environment} from '../../environments/environment';
import {CMSService} from '../cms/cms.service';


declare var jquery:any;
declare var $ :any;

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
    /*********/
    srcImage: string;
    srcImageZoom: string;
    showZoom: boolean;
    xPos: number;
    yPos: number;
    zoomableImg: string = "";
    /*******/
    private owlf: boolean = false;
    private owlf1: boolean = false;
    private owlf2: boolean = false;
    @ViewChild('owl') owl: ElementRef;
    @ViewChild('owl1') owl1: ElementRef;
    @ViewChild('owl2') owl2: ElementRef;
    @ViewChild('prdDesc') prdDesc: ElementRef;
    @ViewChild('sizeGuide') sizeGuide: ElementRef;
    @ViewChild('deliveryReturns') deliveryReturns: ElementRef;
    @ViewChild('articleAd')articleAd:ElementRef;
    @ViewChild('productAd')productAd:ElementRef;
    @ViewChildren('articleInlineAd')articleInlineAds : QueryList<any>;
    @ViewChildren('productInlineAd')productInlineAds : QueryList<any>;
    

    product: any;
    selectedProductAttribues: any = {};
    relatedProducts: any = [];
    relatedArticles: any = [];
    singleProduct: any = {};
    categoryId: any = "";
    quantity: number;
    wishList: any = [];

    productIndexCount: number;
    displayProductAdds: any = [];
    articleIndexCount:number; 
    displayArticalAdds :any = [];

  constructor(private route : ActivatedRoute, private productService : ProductService ,private productUtilService : ProductUtilService ,
		private articleService : ArticleService,private messageService : MessageService,private cartService :CartService,private storageService : StorageService,
    private wishlistService:WishlistService,
    private router :Router,public http: Http , 
    private cmsService : CMSService) { 
    /**********/

      this.showZoom = false;
      this.srcImage = "https://ofpoison.com/magento2/pub/media/catalog/product/l/o/louis-vuitton-pochette-cle-monogram-other-canvas-small-leather-goods--m44487_pm1_back_view.jpg";
      this.srcImageZoom = "https://ofpoison.com/magento2/pub/media/catalog/product/l/o/louis-vuitton-pochette-cle-monogram-other-canvas-small-leather-goods--m44487_pm1_back_view.jpg";

    /**********/
	  this.quantity=1;
    this.productIndexCount = 0;
    this.articleIndexCount = 0; 
      
      
    this.route.paramMap.subscribe((params) => {
      if (params.get('categoryId') != null) {
        this.categoryId = params.get('categoryId');
      }

      var categoryIdForBackground = params.get('categoryId');
      if(categoryIdForBackground == null){
        categoryIdForBackground = this.categoryId;
      }

    this.productService.getProduct("BackGround_"+categoryIdForBackground).subscribe((data) => {
      var image = data.imageValue;
      $('body').css('position', 'relative');
      $('body').css('background', 'url(' + image + ')');
      $('body').css('background-size', 'cover');
    });

    });

     

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.storageService.getProductDirection().subscribe((direction) => {
      if (direction) {
        console.log("Product page " + direction);
        $('.articlebox1').remove();
      }
    });
    $(".minicart").fadeOut(1000);

    this.cmsService.getAdBlock("AD_P_A_"+this.categoryId).subscribe((data) => {
        
      if (data.content) {
        this.articleAd.nativeElement.insertAdjacentHTML('beforeend', data.content);
      }
      
    });

    this.cmsService.getAdBlock("AD_P_P_"+this.categoryId).subscribe((data) => {
      
      if (data.content) {
        this.productAd.nativeElement.insertAdjacentHTML('beforeend', data.content);
      }
      
    });


  }


  /**********/
 openZoom(event: any, show: boolean, img: string) {
    console.log("called")
    event.preventDefault();
    this.showZoom = show;
    if (show) {
      this.zoomableImg = img;
      this.positionZoom(event);
    }
  }

  positionZoom(event) {
    console.log("called");
    console.log(event);
    // this.showZoom = true;
    let xPos = event.offsetX - event.target.offsetLeft
    let yPos = event.offsetY - event.target.offsetTop;
    let xMax = event.target.clientWidth;
    let yMax = event.target.clientHeight;

    this.xPos = this.validPercent(Math.round(xPos * 100 / xMax));
    this.yPos = this.validPercent(Math.round(yPos * 100 / yMax));
    console.log(this.xPos, this.yPos)
  }

  validPercent(value) {
    if (value < 0) {
      this.showZoom = false;
      return 0;
    };
    if (value > 100) {
      this.showZoom = false;
      return 100
    };
    return value;
  }

  /**********/
  
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.relatedProducts = [];
      this.relatedArticles = [];
      this.productService.getProduct(params.get('sku')).subscribe((data) => {
        this.product = data;
        
        // fecth related products for the same brand
        this.productService.getRelatedProducts(this.product.brand, params.get('categoryId'), this.product.sku).subscribe((relatedProducts) => {
          for (var i = 0; i < relatedProducts.length; i++) {
            if (relatedProducts[i].productType == 'P') {
              this.relatedProducts.push(relatedProducts[i]);
              this.wishlistService.productCheckInWishList(this.relatedProducts);
            }
            if (relatedProducts[i].productType == 'A') {
              this.relatedArticles.push(relatedProducts[i]);
            }
          }
          
           
          // fecth related products for the different brand
           this.productService.getRelatedProductsSecondary(this.product.brand, params.get('categoryId'), this.product.sku).subscribe((relatedProducts) => {
            for (var i = 0; i < relatedProducts.length; i++) {
              if (relatedProducts[i].productType == 'P') {
                this.relatedProducts.push(relatedProducts[i]);
                this.wishlistService.productCheckInWishList(this.relatedProducts);
              }
              if (relatedProducts[i].productType == 'A') {
                this.relatedArticles.push(relatedProducts[i]);
              }
            }

            this.productUtilService.classifyProducts(this.relatedProducts);
            this.productUtilService.classifyArticles(this.relatedArticles);
            
            for (var j = 0; j < this.relatedProducts.length; j++) {
              console.log("Iterating for relatedProducts ");
              if(this.relatedProducts[j].type_id == 'configurable'){
                console.log("Found configurable ");
                this.productService.getProduct(this.relatedProducts[j].sku).subscribe((configurableProduct) => {
                  for (var k = 0; k < this.relatedProducts.length; k++) {
                    if(this.relatedProducts[k].sku == configurableProduct.sku){
                      console.log("Price " + configurableProduct.price);
                      this.relatedProducts[k].price = configurableProduct.price;
                    }
                  }
                });
              }
          }
              this.articalClassificationAdds(); 
              this.productClassificationAdds();  
          }); 
              this.articalClassificationAdds();
              this.productClassificationAdds(); 
        });
      });
      
      this.owlf2 = false;
    });
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
  
  productClassificationAdds() {
      this.displayProductAdds = [];
      this.productIndexCount = 0;
      for (var i = 0; i < this.relatedProducts.length; i++) {
          this.getProductIndexForAds(this.productUtilService.getProductClassification(this.relatedProducts[i], i, this.relatedProducts, "Product"), i);
      }
      this.cmsService.getAdBlock("AD_P_P_I_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.productInlineAds.forEach(div => div.nativeElement.insertAdjacentHTML('beforeend', data.content));          
        }
        
      });

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
    
  articalClassificationAdds() {
      this.displayArticalAdds = [];
      this.articleIndexCount = 0;
      for (var i = 0; i < this.relatedArticles.length; i++) {
          this.getArticalIndexForAds(this.productUtilService.getArticleClassification(this.relatedArticles[i], i, this.relatedArticles), i);
      }
      this.cmsService.getAdBlock("AD_P_A_I_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.articleInlineAds.forEach(div => div.nativeElement.insertAdjacentHTML('beforeend', data.content));          
        }
        
      });
  }      
    
  initOwl(){
  		//alert("once");
  		$(this.owl.nativeElement).owlCarousel({
	    loop:true,
	    margin:10,
	    // nav:true,
	    items: 1,
	    nav:true,
	    singleItem:true,
	    dots: true,
	    navText:['prev','adsf']
		});
		$( ".owl-prev").html('<i class="fa fa-arrow-left back_btn"></i>');
		$( ".owl-next").html('<i class="fa fa-arrow-right next_btn"></i>');
		this.owlf = true;
   // magnify('slider_img',3)
    // var el = $('.slider_img');
     //      var pz = new PinchZoom(el, options);
 }
 initOwlRel(){
  $(this.owl2.nativeElement).owlCarousel({
         nav:true,
         items:1,
        navigation:true,
        navigationText:['<i class="fa fa-chevron-left"></i>','<i class="fa fa-chevron-right"></i>'],
        itemsMobile:true,
        });
    this.owlf2 = true;
 }

  initOwlProd(){
  		// alert("once");
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
    if(!this.owlf){
      this.initOwl();
    }
    if(!this.owlf2){
      this.initOwlRel();
    }

    if(!this.owlf1){
      this.initOwlProd();
    }
  } 
  
 ngAfterViewInit() {
   var description = this.product.description;
   var sizeGuide = this.product.sizeGuide;
   var deliveryReturns = this.product.deliveryReturns;

   if (description != undefined) {
     this.prdDesc.nativeElement.insertAdjacentHTML('beforeend', this.product.description);
   }

   if (sizeGuide != undefined) {
    this.sizeGuide.nativeElement.insertAdjacentHTML('beforeend', this.product.sizeGuide);
   }

   if (deliveryReturns != undefined) {
    this.deliveryReturns.nativeElement.insertAdjacentHTML('beforeend', this.product.deliveryReturns);
   }


  }

  getProductClassification = function (product:any , index : number){
    return this.productUtilService.getProductClassification(product , index , this.relatedProducts,"Product");
  }
  
  getArticleClassification = function (article:any , index : number){
     return this.productUtilService.getArticleClassification(article , index , this.relatedArticles);
  } 
     
  getPath = function(article_detail_display : string){
    return this.productUtilService.getPath(article_detail_display);
  }
 
  getProductDetails = function(sku: string) {
    this.singleProduct = {};
    this.productService.getProduct(sku).subscribe((data) => {
      this.singleProduct = data;
      this.prdDesc.nativeElement.innerHTML = "";
      var description = this.singleProduct.description;
      if (description != undefined) {
        this.prdDesc.nativeElement.insertAdjacentHTML('beforeend', this.singleProduct.description);
      }
      this.owlf1 = false;
    });
  } 
  
    getProductDetail = function(sku: string) {
      this.singleProduct = {};
      this.singleProduct =this.product;
      this.addItemToCart();
    } 
  
   closeModal() {
     $("#owl-demo").owlCarousel('destroy');
   }
   
  setSelectedSize = function(valueCode : number){
    this.selectedProductAttribues.size = valueCode;
  }
    
  setSelectedColor = function(valueCode : number){
    this.selectedProductAttribues.color = valueCode;
  }
  
  addItemToCart = function() {
    if (this.singleProduct.type_id == 'configurable') {
      if (this.cartService.configurableProductValidation(this.selectedProductAttribues) == true) {
        for (var i = 0; i < this.singleProduct.children.length; i++) {
          if ((this.singleProduct.children[i].colorValueCode == this.selectedProductAttribues.color) &&
            (this.singleProduct.children[i].sizeValueCode == this.selectedProductAttribues.size)) {
            console.log("Adding item to cart " + this.singleProduct.children[i].sku);
            this.cartService.addItemToCart(this.singleProduct.children[i].sku, this.quantity, this.singleProduct);
            $("#quickview_close").click();
            this.quantity = 1;
            this.selectedProductAttribues = {};
          }
        }
      }
    } else {
      this.cartService.addItemToCart(this.singleProduct.sku, this.quantity, this.singleProduct);
      this.quantity = 1;
      $("#quickview_close").click();
    }
  }
 
  productPageDirection() {
    this.storageService.setProductDirection(true);
  }
  
  fadeOut() {
    $(".minicart").fadeOut(1000);
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
          this.getProductDetails(sku);
        }
      } else {
        this.getProductDetails(sku);
      }
    });
  }
  
  addConfigItemToWishList(productId, product) {
    this.storageService.getCustomerId().subscribe((customer_Id) => {
      if (this.cartService.configurableProductValidation(this.selectedProductAttribues) == true) {
        for (var i = 0; i < this.singleProduct.children.length; i++) {
          if ((this.singleProduct.children[i].colorValueCode == this.selectedProductAttribues.color) &&
            (this.singleProduct.children[i].sizeValueCode == this.selectedProductAttribues.size)) {
            console.log("Adding item to wishlist " + this.singleProduct.children[i].sku);
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
  
  addConfigrableProductToWishList(productId, product) {
    if (this.cartService.configurableProductValidation(this.selectedProductAttribues) == true) {
      this.storageService.getCustomerId().subscribe((customer_Id) => {
        this.productService.getProduct(product.sku).subscribe((data) => {
          this.singleProduct = data;
          for (var i = 0; i < this.singleProduct.children.length; i++) {
            if ((this.singleProduct.children[i].colorValueCode == this.selectedProductAttribues.color) &&
              (this.singleProduct.children[i].sizeValueCode == this.selectedProductAttribues.size)) {
              console.log("Adding item to wishlist " + this.singleProduct.children[i].sku);
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
        });
      });
    }
  }
  
}