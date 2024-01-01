import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {
private owlf:boolean = false;
@ViewChild('owl')owl:ElementRef;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewChecked(){
  	
  	if(!this.owlf){
  		this.initOwl();
  	}
  
  }

  initOwl(){

  		
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

  }



}
