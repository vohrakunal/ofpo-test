import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'; 

@Injectable()
export class CMSService {


  constructor(public http : Http) {
   }

   getShipppingPolicy(){
     return this.http.get(environment.context_root + '/block/sp')
      .map(res => res.json());
   }

   getPrivacyPolicy(){
    return this.http.get(environment.context_root + '/block/pp')
     .map(res => res.json());
   }

   getTaxAndDuties(){
    return this.http.get(environment.context_root + '/block/td')
     .map(res => res.json());
   }

   getTermsOfUse(){
    return this.http.get(environment.context_root + '/block/tu')
     .map(res => res.json());
   }

   getFAQs(){
    return this.http.get(environment.context_root + '/block/faq')
     .map(res => res.json());
   }

   getSizeGuideMen(){
    return this.http.get(environment.context_root + '/block/sgm')
     .map(res => res.json());
   }

   getSizeGuideWomen(){
    return this.http.get(environment.context_root + '/block/sgw')
     .map(res => res.json());
   }

   getInfoAboutCookies(){
    return this.http.get(environment.context_root + '/block/cookies')
     .map(res => res.json());
   }

   getInfoAboutCareers(){
    return this.http.get(environment.context_root + '/block/careers')
     .map(res => res.json());
   }

   getContactInfo(){
    return this.http.get(environment.context_root + '/block/contact')
     .map(res => res.json());
   }

   getInfoAboutOfPoison(){
    return this.http.get(environment.context_root + '/block/about')
     .map(res => res.json());
   }

   getInfoForPressClippings(){
    return this.http.get(environment.context_root + '/block/pressClippings')
     .map(res => res.json());
   }

   getInfoForSiteNavigation(){
    return this.http.get(environment.context_root + '/block/siteNavigation')
     .map(res => res.json());
   }

   getAdBlock(blockId){
     return this.http.get(environment.context_root + '/block/ad/' + blockId)
     .map(res => res.json());
   }




   
}
