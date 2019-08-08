import { Component, OnInit } from '@angular/core';
import { ShareDataService } from '../share-data.service';

@Component({
  selector: 'app-det-sell-tab',
  templateUrl: './det-sell-tab.component.html',
  styleUrls: ['./det-sell-tab.component.css']
})
export class DetSellTabComponent implements OnInit {
  details={}
  store={}
  no_res=false;
  g=false;
  seller_n="";
  constructor(private shd:ShareDataService) {
    this.shd.det_cur.subscribe(rs=>{
      if(rs && rs.hasOwnProperty('sellerInfo') && rs['sellerInfo'][0].hasOwnProperty('sellerUserName')){
        this.seller_n=rs['sellerInfo'][0]['sellerUserName'][0].toUpperCase();
      }
    })
    this.shd.pr_det_cur.subscribe(rs => {
      if(rs && rs.hasOwnProperty('Seller')){
        this.details=rs['Seller'];
        this.g=true;
      }
      else{
        this.details={};
      }
      if(rs.hasOwnProperty('Storefront')){
        this.store=rs['Storefront'];
        this.g=true;
      }
      else{
        this.store={};
      }
    });
    this.no_res=!this.g
   }
   star(){
     if(this.details.hasOwnProperty('FeedbackScore')){
       if(parseInt(this.details['FeedbackScore'])>5000){
         return 'stars';
       }
       else{
         return 'star_border';
       }
     }
   }
  ngOnInit() {
  }
  color(cl){
    var x=cl.indexOf("Shooting");
    if(x!=-1){
      return cl.substring(0,x).toLowerCase();
    }
    else{
      return cl.toLowerCase();
    }
  }

}
