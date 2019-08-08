import { Component, OnInit } from '@angular/core';
import { RequesterService } from '../requester.service';
import { ShareDataService } from '../share-data.service';

@Component({
  selector: 'app-det-ship-tab',
  templateUrl: './det-ship-tab.component.html',
  styleUrls: ['./det-ship-tab.component.css']
})
export class DetShipTabComponent implements OnInit {
  details={};
  item={}
  no_res=false;
  constructor(private reqService: RequesterService,private shd:ShareDataService) {
    this.shd.det_cur.subscribe(rs => {
      this.item=rs;
      if(rs.hasOwnProperty("shippingInfo")){
        this.details=rs['shippingInfo'][0];
      }
      else{
        this.details={}
        this.no_res=true;
      }
    });
  }

  ngOnInit() {
  }
  get_time(it){
    if(parseInt(it)<=1){
      return it+" Day";
    }
    return it+" Days";
  }
  get_shipPrice(it){

      if(parseFloat(it['shippingServiceCost'][0].__value__)>0){
        return "$"+it['shippingServiceCost'][0].__value__;
      }
      else{
        return "Free Shipping";
      }
    }



}
