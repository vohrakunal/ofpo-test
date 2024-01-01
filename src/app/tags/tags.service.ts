import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class TagsService {

  constructor(public http: Http) { }

  getAllTags() {
    return this.http.get(environment.context_root + '/tags/')
        .map(res => res.json());
}

}
