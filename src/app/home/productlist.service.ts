import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';


@Injectable()
export class ProductlistService {

    constructor(public http: Http) { }

    getProducts(categoryId: number, pageNumber: number, priceFilterType: string) {
        return this.http.get(environment.context_root + '/products/' + categoryId + '/' + pageNumber + '/' + priceFilterType)
            .map(res => res.json());
    }

    getArticles(categoryId: number, pageNumber: number) {
        return this.http.get(environment.context_root + '/articles/' + categoryId + '/' + pageNumber)
            .map(res => res.json());
    }

    getArticlesByBrand(brand) {
        return this.http.get(environment.context_root + '/articlesByBrand/' + brand)
            .map(res => res.json());
    }

    searchSiteProducts(stageValue, stage: string) {
        return this.http.get(environment.context_root + '/sitemapProducts/'+ stageValue + '/' + stage)
            .map(res => res.json());
    }

    searchSiteArticles(stageValue,stage: string) {
        return this.http.get(environment.context_root + '/sitemapArticles/' + stageValue + '/' + stage)
            .map(res => res.json());
    }
    
    
    searchSiteBrandProduct(brandName: string) {
        return this.http.get(environment.context_root + '/sitemapProducts/' + brandName)
            .map(res => res.json());
    }
    
    serachByTag(tag) {
        return this.http.get(environment.context_root + '/searchByTag/' + tag)
            .map(res => res.json());
    }
    
    serachProductsByTag(satge,tag) {
        return this.http.get(environment.context_root + '/productsByTag/' + satge + '/' + tag)
            .map(res => res.json());
    }

}