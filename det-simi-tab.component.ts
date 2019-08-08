import { Component, OnInit } from '@angular/core';
import { RequesterService } from '../requester.service';
import { ShareDataService } from '../share-data.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-det-simi-tab',
  templateUrl: './det-simi-tab.component.html',
  styleUrls: ['./det-simi-tab.component.css']
})
export class DetSimiTabComponent implements OnInit {
  item={}
  details=[];
  ch_details=[];
  no_f=false;
  sortby=['Default','Product Name','Days Left','Price','Shopping Cost'];
  sv={};
  ord=['Ascending','Descending'];
  sortKey = new FormControl('Default');
  sortOrder= new FormControl('Ascending');
  sl_ind=5;
  sh_f=true;
  constructor(private reqService: RequesterService,private shd:ShareDataService) {
    this.shd.det_cur.subscribe(rs => {
      this.item=rs;
      if(this.item.hasOwnProperty("itemId")){
        this.shd.sim_c.subscribe(data => {
          if(data && data.hasOwnProperty('getSimilarItemsResponse') && data['getSimilarItemsResponse'].hasOwnProperty("itemRecommendations") && data['getSimilarItemsResponse']['itemRecommendations'].hasOwnProperty('item')){
            this.details=data['getSimilarItemsResponse']["itemRecommendations"]['item'];
            this.ch_details=this.details.slice(0,5);
            this.no_f=false;
            this.sortOrder.disable();
            this.sv={'Product Name':'title','Days Left':'timeLeft','Price':'buyItNowPrice','Shopping Cost':'shippingCost'};
          }
          else{
            this.details=[];
            this.ch_details=this.details;
            this.no_f=true;
          }

        });
      }
      else{
        this.details=[];
        this.ch_details=this.details;
        this.no_f=true;
      }
    });
  }

  ngOnInit() {
  }
  time_get(str){
    var c=str.indexOf('P');
    var d=str.indexOf('D');
    return str.substring(c+1,d);
  }
  show_more(){
    if(this.sl_ind==5){
      this.sl_ind=this.details.length;
      this.ch_details=this.details.slice(0,this.sl_ind);

    }
    else{
      this.sl_ind=5;
      this.ch_details=this.ch_details.slice(0,5);

    }
    this.sort_ar();
    this.sh_f=!this.sh_f;
  }

  sort_ar(){
    if(this.sortKey.value!='Default'){
      this.sortOrder.enable();
      var x=this.sv[this.sortKey.value];
      var z=0;
      if(x=='buyItNowPrice' || x=='shippingCost'){
        z=1;
      }
      if(x=='timeLeft'){
        z=2;
      }
      if(this.sortOrder.value=='Ascending'){
        this.ch_details.sort(function(a,b){
            var nameA:any;
            var nameB:any;
            if(z==0){
               nameA = a[x].toUpperCase();
               nameB = b[x].toUpperCase();
            }
            else if(z==1){
              nameA = parseFloat(a[x].__value__);
              nameB = parseFloat(b[x].__value__);
            }
            else{

              let c1=a[x].indexOf('P');
              let d1=a[x].indexOf('D');
              let c2=b[x].indexOf('P');
              let d2=b[x].indexOf('D');
              nameA = parseInt(a[x].substring(c1+1,d1));
              nameB = parseInt(b[x].substring(c2+1,d2));
            }
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      }
      else{
        this.ch_details.sort(function(a,b){
          var nameA:any;
          var nameB:any;
          if(z==0){
            nameA = b[x].toUpperCase();
            nameB = a[x].toUpperCase();
          }
          else if(z==1){
            nameA = parseFloat(b[x].__value__);
            nameB = parseFloat(a[x].__value__);
          }
          else{
            let c1=a[x].indexOf('P');
            let d1=a[x].indexOf('D');
            let c2=b[x].indexOf('P');
            let d2=b[x].indexOf('D');
            nameB = parseInt(a[x].substring(c1+1,d1));
            nameA = parseInt(b[x].substring(c2+1,d2));
          }
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      }

    }
    else{
      this.ch_details=this.details.slice(0,this.sl_ind);
      this.sortOrder.disable();
    }

  }
}
