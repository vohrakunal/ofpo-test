import { CookieService } from 'ngx-cookie-service';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import {MessageService} from '../message/message.service';

@Injectable()
export class LoginService {
    constructor(private cookieService: CookieService, public http: Http, private messageService: MessageService) {
    }
    setRememberMe(username, password, remember) {
        this.cookieService.set("dXNlcm5hbWU=", username);
        //this.cookieService.put("cGFzc3dvcmQ=", btoa(password));
        this.cookieService.set("cGFzc3dvcmQ=", password);
        this.cookieService.set("cmVtZW1iZXI=", remember);
    }

    resetPasswordLink(username) {
        var customer = {
            "email": username,
            "template": "email_reset",
            "websiteId": 1
        }
        this.http.put(environment.context_root + '/forgotPassword', customer)
            .subscribe((res) => {
                console.log(res);
                if (res.json() == true) {
                    var success = "Reset password link send on your mail successfully";
                    this.messageService.popToastSuccess(success);
                } else {
                    var error = "Email not found please enter valid email";
                    this.messageService.validationError(error);
                }
            },
            err => {
                console.log("Error in  forgot password");
                this.messageService.popToastError();
            });
    }
}