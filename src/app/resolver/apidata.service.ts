import { Injectable } from '@angular/core';
import { Resolve , ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {ArticleService} from '../article/article.service';


import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';



@Injectable()
export class ApidataService implements Resolve<Observable<string>> {

  constructor(private articleService : ArticleService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.articleService.getArticle(route.paramMap.get('sku'));	
  }

}
