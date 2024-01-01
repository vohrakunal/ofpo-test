import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment'; 


@Injectable()
export class ArticleService {

  constructor(public http : Http) { }

  getArticle(sku) {
    return this.http.get(environment.context_root + '/article/'+sku)
      .map(res => res.json());

    } 
}
