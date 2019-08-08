import { Component, OnInit } from '@angular/core';
import { ShareDataService } from '../share-data.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { delay } from 'q';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
  animations: [
    trigger('prog_slider', [
      state('init',style({transform:'translateX(0%)'})),
      state('final',style({transform:'translateX(-50%)'})),
      transition('*<=>*', [
        animate(400)
      ])
    ]),
    trigger('tab_slider', [
      state('init',style({transform:'translateX(50%)'})),
      state('final',style({transform:'translateX(0%)'})),
      transition('*<=>*', [
        animate(400)
      ])
    ])
  ]
})
export class WishlistComponent implements OnInit {
  flgs={};
  no_res=false;
  tb=[];
  localSt={};
  det_cur_o={};
  det_cur=true;
  total=0;
  prog_bar=true;
  prog_tog='final'
  srch_f=false;
  constructor(private shd:ShareDataService) {
    this.shd.srch_f_c.subscribe(rs => this.srch_f=rs);
    this.shd.flag_c.subscribe(rs => this.flgs=rs);
    this.shd.det_v_c.subscribe(rs => this.det_cur=rs);
    this.shd.localSt_c.subscribe(rs => {
      this.localSt=rs;
      //console.log("wishsub")
      // console.log(rs)
      if(localStorage.length>0){
        this.no_res=false;
        var s=this.localSt['wish_pri'];
        if(s && s!='[]'){
          //console.log("tb assigned")
          this.tb=JSON.parse(s);
          this.total=0;
          for(let i of this.tb){
            let k=this.get_sellPrice(i)
            if(k!="N/A"){
              this.total+=parseFloat(k);
            }
          }
          this.total=parseFloat(this.total.toFixed(2));
        }
      }
      else{
        this.no_res=true;
      }
      if(this.tb.length<1){
        this.no_res=true;
      }
    });
    //console.log(this.localSt)

  }

  ngOnInit() {
  }
  async show_det(it){
    this.prog_bar=false
    this.prog_tog='init'
    await delay(400)
    this.prog_tog='final'
    this.prog_bar=true
    if(this.srch_f){
      this.shd.changeDFlag_wk('prod',true);
    }

    this.shd.changeDFlag_wk('cart','remove_shopping_cart');
    this.shd.changeFlag('det',true);
    this.shd.changeFlag('wishlist',false);
    this.shd.changeFlag('prev','wishlist');
    this.det_cur=false;
    this.det_cur_o=it;
    // console.log(it)
    this.shd.changeDet(it);
    this.shd.changeDetV(false);
  }
  async get_prev_det(){
    this.prog_bar=false
    this.prog_tog='init'
    await delay(400)
    this.prog_tog='final'
    this.prog_bar=true;
    this.shd.changeDFlag_wk('prod',true);
    this.shd.changeDFlag_wk('cart','remove_shopping_cart');
    this.shd.changeFlag('det',true);
    this.shd.changeFlag('result',false);
  }
  get_title(it){
    if(it.hasOwnProperty('title')){

      if(it['title'][0].length>35){

        let tp=it['title'][0].split(" ");
        let j=0;
        var s="";

        for(var k of tp){
          // console.log("title: "+k)
          if(j+k.length>35){
            return [s+" ...",it['title'][0]];
          }
          else{
            j+=k.length;
            s+=" "+k;
          }
        }
      }
      return [it['title'][0],it['title'][0]];
    }
    else{
      return ["N/A","N/A"];
    }
  }
  get_img(it){
    if(it.hasOwnProperty('galleryURL')){
      return "<img src="+it['galleryURL'][0]+"  height=100 width=100 alt='...'>";
    }
    else{
      return "N/A";
    }
  }
  get_sellPrice(it){
    if(it.hasOwnProperty('sellingStatus') && it['sellingStatus'][0].hasOwnProperty('currentPrice')){
      return it['sellingStatus'][0]['currentPrice'][0].__value__;
    }
    else{
      return "N/A";
    }
  }
  get_shipPrice(it){
    if(it.hasOwnProperty('shippingInfo') && it['shippingInfo'][0].hasOwnProperty('shippingServiceCost'))
    {
      if(parseFloat(it['shippingInfo'][0]['shippingServiceCost'][0].__value__)>0){
        return "$"+it['shippingInfo'][0]['shippingServiceCost'][0].__value__;
      }
      else{
        return "Free Shipping";
      }
    }
    else{
      return "N/A";
    }
  }

  get_zip(it){
    if(it.hasOwnProperty('postalCode')){
      return it['postalCode'][0];
    }
    else{
      return "N/A";
    }
  }
  get_seller(it){
    if(it.hasOwnProperty('sellerInfo') && it['sellerInfo'][0].hasOwnProperty('sellerUserName')){
      return (it['sellerInfo'][0]['sellerUserName'][0]).toUpperCase();
    }
    else{
      return "N/A";
    }
  }
  remove_wish(it){
    if (localStorage.length > 0){
      var s=this.localSt['wish_pri'];
      let ps=JSON.parse(s);
      //console.log(ps);
      ps=ps.filter(x => x.itemId[0]!=it.itemId[0])
      this.shd.changeLocalSt('wish_pri',JSON.stringify(ps));
      this.tb=ps;
      //console.log(this.tb.length)
      if(this.tb.length<1){
        this.no_res=true;
      }
    }
    else{
      alert("error");
    }
  }

}
