import {Component, OnInit, ViewChild, ElementRef,ChangeDetectorRef} from '@angular/core';
import {NgForm, NgModel, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl} from '@angular/forms';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CMSService} from '../cms/cms.service';
import { FileUploader } from 'ng2-file-upload';
import { FileUploadModule } from 'ng2-file-upload';
import 'rxjs/add/operator/map';
import {MessageService} from '../message/message.service';
import {MyAccountService} from '../myaccount/myaccount.service';
import {TagsService} from '../tags/tags.service';
import { letProto } from 'rxjs/operator/let';

declare var jquery:any;
declare var $ :any;
const URL = '';


@Component({
  selector: 'app-myfooter',
  templateUrl: './myfooter.component.html',
  styleUrls: ['./myfooter.component.css']
})
export class MyFooterComponent{

  @ViewChild('shippingPolicy') shippingPolicy: ElementRef;
  @ViewChild('privacyPolicy') privacyPolicy: ElementRef;
  @ViewChild('taxAndDuties') taxAndDuties: ElementRef;
  @ViewChild('FAQs') FAQs: ElementRef;
  @ViewChild('sizeGuideMen') sizeGuideMen: ElementRef;
  @ViewChild('sizeGuideWomen') sizeGuideWomen: ElementRef;
  @ViewChild('termsOfUse') termsOfUse: ElementRef;
  @ViewChild('aboutCookies') aboutCookies: ElementRef;
  @ViewChild('aboutOfPoison') aboutOfPoison: ElementRef;
  @ViewChild('contact') contact: ElementRef;
  @ViewChild('career') career: ElementRef;
  @ViewChild('pressClippings') pressClippings: ElementRef;
  @ViewChild('siteNavigation') siteNavigation: ElementRef;
  
  shippingPolicyContent:any;
  privacyPolicyContent:any;
  taxAndDutiesContent:any;
  FAQsContent:any;
  sizeGuideWomenContent:any;
  sizeGuideMenContent:any;
  termsOfUseContent:any;
  aboutCookiesContent:any;
  aboutOfPoisonContent:any;
  careerOfPoisonContent:any;  
  contactContent:any;
  pressClippingsContent:any;
  siteNavigationContent:any;

  category:string;
  tags:any // List of all tags
  tagMap:any = {} // This is to store one tag as a map ( A:tag)
  tagMapList:any // List of tag maps

  currentTab:number = 1;
  previousTab:number;
  submitted;
  sellOnForm: FormGroup;
  sell = {
        brandName: '',
        mainOfficeLocation: '',
        pricePoint: [],
        brandBrief: '',
        productCategory: [],
   };
  submitAttempt: boolean = false;
  fileContents:any=[];
  file;  
  productCategoryFlag:boolean;   
  public uploader:FileUploader = new FileUploader({url: URL});
  units:any=[];
  wholesaler;
  dropship;
  pointCuteFlag:boolean;        
    
  constructor(private route : ActivatedRoute, public http: Http , private router :Router,private messageService:MessageService,private myAccountService:MyAccountService,
      private cmsService : CMSService,private formBuilder: FormBuilder , 
        private tagsService : TagsService) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.paramMap.subscribe((params) => {
          if (params.get('category') != null) {
            this.category = params.get('category');            
          }
          if (params.get('currentTab') != null) {
            this.setCurrentTab(+params.get('currentTab')); 
          }
        });

        $('.navmenu').hide();
        $('.serach2').show();
        $('.myfooter').show();
        $(".footer-home").fadeOut(1000);
        this.submitted=false;
        this.sellOnForm = formBuilder.group({
            brandName: ['', Validators.compose([Validators.required])],
            mainOfficeLocation: ['', Validators.compose([Validators.required])],
            pricePoint: ['', Validators.compose([Validators.nullValidator])],
            brandBrief: ['', Validators.compose([Validators.required])],
            productCategory: ['', Validators.compose([Validators.nullValidator])],
            //documents: ['', Validators.compose([Validators.nullValidator])]
        });
        this.productCategoryFlag=false;
        this.pointCuteFlag=false;
  }


  ngOnInit() {   
    this.fetchFAQs();
  }

  setCurrentTab(tabIndex){
    this.previousTab = this.currentTab;
    this.currentTab = tabIndex;

    $('#1').removeClass("active");
    $('#'+this.previousTab).removeClass("active");
    $('#'+tabIndex).addClass("active");

    if(this.currentTab == 1){
      this.fetchFAQs();
    }
    else if(this.currentTab == 2){
      this.fetchShippingPolicy();
    } 
    else if(this.currentTab == 3){
      this.fetchSizeGuideForMen();
      this.fetchSizeGuideForWomen();
    }
    else if(this.currentTab == 4){
      this.fetchTermsOfUse();
    }
    else if(this.currentTab == 5){
      this.fetchPrivacyPolicy();
    }
    else if(this.currentTab == 6){
      this.fetchInfoAboutCookies();
    }
    else if(this.currentTab == 7){
      this.fetchInfoAboutOfpoison();
    }else if(this.currentTab == 14){
      this.fetchInfoAboutCareer();
    }
    else if(this.currentTab == 10){
      this.fetchInfoAboutContact();
    }
    else if(this.currentTab == 11){
      this.fetchAllTags();
    }
    else if(this.currentTab == 12){
      this.fetchInfoForPressClipppings();
    }
    else if(this.currentTab == 9){
      this.fetchInfoForSiteNavigation();
    }

  }

  fetchShippingPolicy(){
    this.cmsService.getShipppingPolicy().subscribe((data) => {
      this.shippingPolicyContent = data;
      if (this.shippingPolicyContent) {
        this.shippingPolicy.nativeElement.insertAdjacentHTML('beforeend', this.shippingPolicyContent.content);
      }
    });
    this.cmsService.getTaxAndDuties().subscribe((data) => {
      this.taxAndDutiesContent = data;
      if (this.taxAndDutiesContent) {
        this.taxAndDuties.nativeElement.insertAdjacentHTML('beforeend', this.taxAndDutiesContent.content);
      }
    });
  }

  fetchPrivacyPolicy(){
    this.cmsService.getPrivacyPolicy().subscribe((data) => {
      this.privacyPolicyContent = data;
      if (this.privacyPolicyContent) {
        this.privacyPolicy.nativeElement.insertAdjacentHTML('beforeend', this.privacyPolicyContent.content);
      }
      
    });
  }

  fetchFAQs() {
      this.cmsService.getFAQs().subscribe((data) => {
          this.FAQsContent = data;
          if (this.FAQsContent) {
              this.FAQs.nativeElement.insertAdjacentHTML('beforeend', this.FAQsContent.content);
          }
      });
  }

  fetchSizeGuideForMen(){
    this.cmsService.getSizeGuideMen().subscribe((data) => {
      this.sizeGuideMenContent = data;
      if (this.sizeGuideMenContent) {
        this.sizeGuideMen.nativeElement.insertAdjacentHTML('beforeend', this.sizeGuideMenContent.content);
      }
      
    });
  }

  fetchSizeGuideForWomen(){
    this.cmsService.getSizeGuideWomen().subscribe((data) => {
      this.sizeGuideWomenContent = data;
      if (this.sizeGuideWomenContent) {
        this.sizeGuideWomen.nativeElement.insertAdjacentHTML('beforeend', this.sizeGuideWomenContent.content);
      }
      
    });
  }

  fetchTermsOfUse(){
    this.cmsService.getTermsOfUse().subscribe((data) => {
      this.termsOfUseContent = data;
      if (this.termsOfUseContent) {
        this.termsOfUse.nativeElement.insertAdjacentHTML('beforeend', this.termsOfUseContent.content);
      }
      
    });
  }

  fetchInfoAboutCookies(){
    this.cmsService.getInfoAboutCookies().subscribe((data) => {
      this.aboutCookiesContent = data;
      if (this.aboutCookiesContent) {
        this.aboutCookies.nativeElement.insertAdjacentHTML('beforeend', this.aboutCookiesContent.content);
      }
      
    });
  }

  fetchInfoAboutOfpoison(){
    this.cmsService.getInfoAboutOfPoison().subscribe((data) => {
      this.aboutOfPoisonContent = data;
      if (this.aboutOfPoisonContent) {
        this.aboutOfPoison.nativeElement.insertAdjacentHTML('beforeend', this.aboutOfPoisonContent.content);
      }
      
    });
  }
    
  fetchInfoAboutCareer(){
    this.cmsService.getInfoAboutCareers().subscribe((data) => {
      this.careerOfPoisonContent = data;
      if (this.careerOfPoisonContent) {
        this.career.nativeElement.insertAdjacentHTML('beforeend', this.careerOfPoisonContent.content);
      }
      
    });
  }  

  fetchInfoAboutContact(){
    this.cmsService.getContactInfo().subscribe((data) => {
      this.contactContent = data;
      if (this.contactContent) {
        this.contact.nativeElement.insertAdjacentHTML('beforeend', this.contactContent.content);
      }
      
    });
  }

  fetchInfoForPressClipppings(){
    this.cmsService.getInfoForPressClippings().subscribe((data) => {
      this.pressClippingsContent = data;
      if (this.pressClippingsContent) {
        this.pressClippings.nativeElement.insertAdjacentHTML('beforeend', this.pressClippingsContent.content);
      }
      
    });
  }

  fetchInfoForSiteNavigation(){
    this.cmsService.getInfoForSiteNavigation().subscribe((data) => {
      this.siteNavigationContent = data;
      if (this.siteNavigationContent) {
        this.siteNavigation.nativeElement.insertAdjacentHTML('beforeend', this.siteNavigationContent.content);
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
      
    });

  }
  
  closeFooter() {
      $(".footer-home").fadeOut(1000);
  }
    
  addIndividualUnits(units) {
      if (this.units.includes(units)) {
          var index = this.units.indexOf(units);
          if (index > -1) {
              this.units.splice(index, 1);
          }
      } else {
          this.units.push(units);
      }
      console.log("this.units" + JSON.stringify(this.units));
  }  
    
  addProductCategory(catgoryName) {
      if (this.sell.productCategory.includes(catgoryName)) {
          var index = this.sell.productCategory.indexOf(catgoryName);
          if (index > -1) {
              this.sell.productCategory.splice(index, 1);
          }
      } else {
          this.sell.productCategory.push(catgoryName);
      }
      console.log("this.sell.productCategory" + JSON.stringify(this.sell.productCategory));
  }
    
  addWholesaler(value) {
      this.wholesaler = value;
      console.log("this.wholesaler" + this.wholesaler);
  }
    
  addDropship(value){
    this.dropship = value;
    console.log("addDropship" + this.dropship);
  }
    
  sellOn() {
      if (!this.sellOnForm.valid) {
          this.submitAttempt = true;
          console.log('failed! failed! failed!');
          return;
      } else {
          if (!this.sell.productCategory.length) {
              return this.productCategoryFlag = true;
          } else {
              this.productCategoryFlag = false;
          }
          
          this.sell.pricePoint.push({
            "units" : this.units,
            "wholesaler" : this.wholesaler,
            "dropship" : this.dropship   
          });
          
          
          //if (!this.sell.pricePoint.length) {
          //    return this.pointCuteFlag = true;
          //} else {
          //    this.pointCuteFlag=false; 
          //}
          
           event.preventDefault();
           this.fileContents = [];
           for (let i = 0; i < this.uploader.queue.length; i++) {
               if (this.uploader.queue[i].file.type == 'image/jpeg' || this.uploader.queue[i].file.type == 'image/png' || this.uploader.queue[i].file.type == 'image/jpg' || this.uploader.queue[i].file.type =='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || this.uploader.queue[i].file.type =='application/vnd.openxmlformats-officedocument.wordprocessingml.document'|| this.uploader.queue[i].file.type =='application/pdf') {
                   var FileSize = this.uploader.queue[i].file.size /1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024/1024; // in MB
                   if (FileSize <= 25) {
                       this.file = this.uploader.queue[i].file.rawFile;
                       this.fileread(this.file);
                   } else {
                       var sizeError = this.uploader.queue[i].file.name + " file size is grater then 25 MB long";
                       return this.messageService.validationError(sizeError);
                   }
               } else {
                   var error = "Only JPEG, PNG or, Pdf xlsx, Doc, JPG file formats supported" + this.uploader.queue[i].file.name;
                   return this.messageService.validationError(error);
               }
           }
           setTimeout(() => {
               this.myAccountService.sellonOfposion(this.sell, this.fileContents).subscribe(() => {

               });
               var success = "Your request send to admin successfully";
               this.messageService.popToastSuccess(success);
           }, 4000);
      }
  }
    
  fileread(file) {
      this.file = file;
      var reader = new FileReader();
      reader.onloadend = (e: Event) => {
          if (file.type == 'image/jpeg'  || file.type == 'image/png' || file.type =='image/jpg') {
              this.fileContents.push({
                  "name": file.name,
                  "imageString": reader.result.replace("data:image/jpeg;base64,", ""),
              });
          }
          if (file.type == 'application/pdf') {
              this.fileContents.push({
                  "name": file.name,
                  "imageString": reader.result.replace("data:application/pdf;base64,", ""),
              });
          }
          if (file.type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
              this.fileContents.push({
                  "name": file.name,
                  "imageString": reader.result.replace("data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,", ""),
              });
          }
          if (file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
              this.fileContents.push({
                  "name": file.name,
                  "imageString": reader.result.replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", ""),
              });
          }
      }
      reader.readAsDataURL(this.file);
  }


}
 