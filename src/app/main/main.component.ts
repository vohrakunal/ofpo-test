import {Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {NgForm, NgModel, FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, FormControl} from '@angular/forms';
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/map';

import { MessageService} from '../message/message.service';
import { environment } from '../../environments/environment';  

declare var jquery:any;
declare var $ :any;


@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    mainForm: FormGroup;
    mainData: any = {};
    submitAttempt: boolean = false;
    submitted: boolean = false;

    constructor(private formBuilder: FormBuilder,public http: Http,private messageService :MessageService) {
        this.mainForm = formBuilder.group({
            dob: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
            email: ['', Validators.compose([Validators.required, Validators.pattern(GlobalValidator.EMAIL_REGEX)])],
            userType: ['', Validators.compose([Validators.nullValidator])],
        }); 
    }

    ngOnInit() {
        $('.serach2').hide();
        $('.myaccount').hide();
        $('.navmenu').hide();
        $('.footerdisplay').hide();
    }   

    register(userType) {
        if (!this.mainForm.valid) {
            this.submitAttempt = true;
            console.log('failed! failed! failed!');
            return;
        } else {
            event.preventDefault();
            this.mainData.userType = userType;
            console.log('success! success! success!');
            console.log(this.mainForm.value);
            $('.landing_outer').hide();
            $('.landing_outer1').show();
            $('.animate').css('margin-right', '200%').fadeOut(function() {
                $('.animation_outer').hide();
            });
            if (screen.width < 900) {
                $('.animate1').css('margin-right', '-200%').fadeOut(function() {
                    $('.animation_outer').hide();
                });

            }
            this.http.post(environment.context_root + '/newCustomerRequest', this.mainData).subscribe((res) => {
                var success = "Request send to admin";
                this.messageService.popToastSuccess(success);
            },
                err => {
                    this.messageService.popToastError();
                });
        }
    } 
    
}    
export class GlobalValidator {
    public static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
}