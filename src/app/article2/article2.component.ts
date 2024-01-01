import { Component, OnInit, ViewChild, ViewChildren , QueryList , ElementRef } from '@angular/core';
declare var jquery:any;
declare var $ :any;
import {ActivatedRoute,Router} from '@angular/router';
import {ArticleService} from '../article/article.service';
import {ProductService} from '../product/product.service';
import {CartService} from '../cart/cart.service';
import {MessageService} from '../message/message.service';
import {StorageService} from '../storage/storage.service';
import {ProductUtilService} from '../util/product-util.service';
import {WishlistService} from '../wishlist/wishlist.service';
import {CMSService} from '../cms/cms.service';

@Component({
  selector: 'app-article2',
  templateUrl: './article2.component.html',
  styleUrls: ['./article2.component.css']
})
export class Article2Component implements OnInit {
    private owlf: boolean = false;
    @ViewChild('owl') owl: ElementRef;
    @ViewChild('articleBodyCopy') articleBodyCopy: ElementRef;
    @ViewChild('articleAd')articleAd:ElementRef;
    @ViewChild('productAd')productAd:ElementRef;
    @ViewChild('articleSideAd')articleSideAd:ElementRef;
    @ViewChildren('articleInlineAd')articleInlineAds : QueryList<any>;
    @ViewChildren('productInlineAd')productInlineAds : QueryList<any>;

    article: any;
    relatedProducts: any = [];
    relatedArticles: any = [];
    singleProduct: any = {};
    categoryId: any = "";
    products: Product[];
    selectedProductAttribues:any = {};
    productIndexCount: number;
    displayProductAdds: any = [];
    articleIndexCount: number;
    displayArticalAdds: any = [];       
  
    private owlf1: boolean = true;
    @ViewChild('owl1') owl1: ElementRef;
    @ViewChild('prdDesc') prdDesc: ElementRef;
  
  constructor(private route : ActivatedRoute, private articleService : ArticleService,private productService : ProductService,private cartService: CartService,
      private productUtilService: ProductUtilService, 
      private wishlistService: WishlistService, 
      private messageService: MessageService,
      private storageService: StorageService, 
      private router: Router, private cmsService : CMSService) {
      this.route.paramMap.subscribe((params) => {
          if (params.get('categoryId') != null) {
              this.categoryId = params.get('categoryId');
          }

          // This is for the background image change based on the category.
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
      

      this.cmsService.getAdBlock("AD_A_A_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.articleAd.nativeElement.insertAdjacentHTML('beforeend', data.content);
        }
        
      });
  
      this.cmsService.getAdBlock("AD_A_P_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.productAd.nativeElement.insertAdjacentHTML('beforeend', data.content);
        }
        
      });

      this.cmsService.getAdBlock("AD_A_S_"+this.categoryId).subscribe((data) => {
      
        if (data.content) {
          this.articleSideAd.nativeElement.insertAdjacentHTML('beforeend', data.content);
        }
        
      });

  }

  ngOnInit() {
	  this.initAd();
	  this.route.paramMap.subscribe((params) => {
        this.relatedProducts = [];
        this.relatedArticles = [];
        this.products=[];
		    this.articleService.getArticle(params.get('sku')).subscribe((data) =>{
        this.article = data;
        this.productService.getRelatedProducts(this.article.brand , params.get('categoryId') , this.article.sku).subscribe((relatedProducts) =>{
          for(var i = 0; i < relatedProducts.length; i++){
            if(relatedProducts[i].productType == 'P'){
              this.relatedProducts.push(relatedProducts[i]);
              this.products.push(relatedProducts[i]);
              this.wishlistService.productCheckInWishList(this.products);  
                //console.log("this.relatedProducts" + JSON.stringify(this.relatedProducts));
            }
            if(relatedProducts[i].productType == 'A'){
              this.relatedArticles.push(relatedProducts[i]);
            } 
          }
          // fecth related products for the different brand
          this.productService.getRelatedProductsSecondary(this.article.brand , params.get('categoryId') , this.article.sku).subscribe((relatedProducts) =>{
            for(var i = 0; i < relatedProducts.length; i++){
              if(relatedProducts[i].productType == 'P'){
                this.relatedProducts.push(relatedProducts[i]);
                this.products.push(relatedProducts[i]);
                this.wishlistService.productCheckInWishList(this.products);  
                //console.log("this.relatedProducts" + JSON.stringify(this.relatedProducts));  
              }
              if(relatedProducts[i].productType == 'A'){
                this.relatedArticles.push(relatedProducts[i]);
              }
            }
            this.productUtilService.classifyProducts(this.relatedProducts);
            this.productUtilService.classifyArticles(this.relatedArticles);
            
            this.articalClassificationAdds();
            this.productClassificationAdds();  
          });
            this.articalClassificationAdds();
            this.productClassificationAdds();
        });
      });	
    });	
  }

  initAd(){
  	var fixmeTop = $('.fixme').offset().top;
	$('.inner').scroll(function() {
	    var currentScroll = $('.inner').scrollTop();
	    if (currentScroll >= fixmeTop) {
	        $('.fixme').css({
	            position: 'fixed',
	            top: '0',
	            left: '25px',
	            width:'14.6%',
	        });
	    } else {
	        $('.fixme').css({
	            position: 'static',
	            width:'100%',
	        });
	    }
	});
  }

  initOwl(){
  		// alert("once");
  		$(this.owl.nativeElement).owlCarousel({
	    loop:true,
	    margin:10,
	    // nav:true,
	    items: 1,
	    nav:true,
	    singleItem:true,
	    dots: false,
	    navText:['prev','adsf']
	  
		});

		$( ".owl-prev").html('<i class="fa fa-arrow-left back_btn"></i>');
		$( ".owl-next").html('<i class="fa fa-arrow-right next_btn"></i>');
		this.owlf = true;

  }

  ngAfterViewInit() {
      if (this.article.description != undefined) {
          this.articleBodyCopy.nativeElement.insertAdjacentHTML('beforeend', this.article.description);
      }
  }
  
  ngAfterViewChecked(){ 
    if(!this.owlf){     
      this.initOwl();
    }
    if(!this.owlf1){
      this.initOwlProd();
    }  
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

  fadeOut(){
    
  }
  
  getProductDetails = function(sku:string,cartIconClick) {
     this.singleProduct={};     
     this.productService.getProduct(sku).subscribe((data) =>{
        this.singleProduct = data;
       if(cartIconClick == false || cartIconClick == undefined){
        this.prdDesc.nativeElement.innerHTML = "";
        var description= this.singleProduct.description;
        if( description != undefined){
          this.prdDesc.nativeElement.insertAdjacentHTML('beforeend', this.singleProduct.description);
        }
          this.owlf1 = false;  
       }else{
          this.addItemToCart();
       }
      });
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
            this.cartService.addItemToCart(this.singleProduct.children[i].sku, 1, this.singleProduct);
            $("#quickview_close").click();
          }
        }
      }
    } else {
      this.cartService.addItemToCart(this.singleProduct.sku, 1, this.singleProduct);
      $("#quickview_close").click();
    }
  }
    
  getArticleClassification = function(article: any, index: number) {
      return this.productUtilService.getArticleClassification(article, index, this.relatedArticles);
  }
    
  getPath = function(article_detail_display: string) {
    return this.productUtilService.getPath(article_detail_display);
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
      this.cmsService.getAdBlock("AD_A_A_I_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.articleInlineAds.forEach(div => div.nativeElement.insertAdjacentHTML('beforeend', data.content));          
        }
        
      });
  }  
    
  getProductClassification = function (product:Product , index : number){
    return this.productUtilService.getProductClassification(product , index , this.relatedProducts,"HOME");
  }
      
  productClassificationAdds() {
      this.displayProductAdds = [];
      this.productIndexCount = 0;
      for (var i = 0; i < this.relatedProducts.length; i++) {
          this.getProductIndexForAds(this.productUtilService.getProductClassification(this.relatedProducts[i], i, this.relatedProducts, "HOME"), i);
      }
      this.cmsService.getAdBlock("AD_A_P_I_"+this.categoryId).subscribe((data) => {
        
        if (data.content) {
          this.productInlineAds.forEach(div => div.nativeElement.insertAdjacentHTML('beforeend', data.content));          
        }
        
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