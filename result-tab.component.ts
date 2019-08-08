import { Component, OnInit } from '@angular/core';
import { ShareDataService } from '../share-data.service';
import { RequesterService } from '../requester.service';
import {  trigger, state, style, animate, transition } from '@angular/animations';
import { delay } from 'q';
@Component({
  selector: 'app-result-tab',
  templateUrl: './result-tab.component.html',
  styleUrls: ['./result-tab.component.css'],
  animations:[
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
export class ResultTabComponent implements OnInit {
  tb:any;
  fl={}
  fl_d={}
  pageSize=10;
  page=1;
  det_cur_o={};
  det_cur=true;
  localSt={};
  cart=[];
  tst=['app','a','f']
  prog_bar=true;
  prog_tog='final'
  it:any;
  srch_f=false;
  constructor(private shd:ShareDataService,private reqService: RequesterService) {
    this.shd.srch_f_c.subscribe(rs => this.srch_f=rs);
    this.shd.res_cur.subscribe(rs => {
      this.tb=rs;
      if(this.check(this.tb)){
        for(let i=0;i<this.tb.length;i++){
          this.cart.push(this.get_cart(this.tb[i]));
        }
      }
    });
    this.shd.flag_c.subscribe(rs => this.fl=rs);
    this.shd.d_flag_c.subscribe(rs => this.fl_d=rs);
    this.shd.det_v_c.subscribe(rs => this.det_cur=rs);
    // this.shd.wait_c.subscribe(rs => this.prog_bar=rs);
    this.shd.localSt_c.subscribe(rs => {this.localSt=rs;});


    //console.log(this.localSt)

  }
  check(a){
    return Array.isArray(a)
  }
  get_det(rs){
      //console.log(rs);
      this.it=rs;
      if(rs.hasOwnProperty('title')){
        this.reqService.findProdPhotos({"title":rs["title"][0]}).subscribe(data => {
          this.shd.changePhoto(data);
          //console.log(data);
        });
      }
      if(this.it.hasOwnProperty("itemId")){
        // this.shd.changeFlag('prog',true);
        this.reqService.findProdDet({"id":this.it["itemId"][0]}).subscribe(data => {
          //console.log("now only getting data for prod det")
          this.shd.changeProdDet(data);
          //console.log(data);
        });
        this.reqService.findSim({"id":this.it["itemId"][0]}).subscribe(data => {
          this.shd.changeSim(data);
        });
      }
  }
  ngOnInit() { }
  get_title(it){
    if(it.hasOwnProperty('title')){

      if(it['title'][0].length>35){

        let tp=it['title'][0].split(" ");
        var j=0;
        var s="";
        for(var k of tp){
          // //console.log("title: "+k)
          // //console.log(s,j,k.length,j+k.length)
          if(j+k.length>35){
            return [s+" ...",it['title'][0]];
          }
          else{
            j+=k.length+1;
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
      return "$"+parseFloat(it['sellingStatus'][0]['currentPrice'][0].__value__);
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

  ht(it){
    
    if(it.itemId[0]==this.fl['sel']){
      return true;
    }
    return false;
  }

  async show_det(it){
    //console.log("is this before???")
    this.prog_bar=false
    this.prog_tog='init'
    this.get_det(it);
    await delay(400)
    this.prog_tog='final'
    // //console.log("pbres",this.prog_bar)
    this.prog_bar=true
    this.shd.changeFlag('result',false);
    this.shd.changeDFlag_wk('prod',true);
    this.shd.changeFlag('det',true);
    this.shd.changeFlag('prev','result');
    this.shd.changeFlag('sel',it.itemId[0]);
    //console.log("it came here");
    this.fl_d['cart']=this.get_cart(it);
    this.shd.changeDFlag(this.fl_d);
    this.det_cur=false;
    this.det_cur_o=it;
    this.shd.changeDet(it);
    this.shd.changeDetV(false);
    // this.del();

  }
  async get_prev_det(){
    this.prog_bar=false
    this.prog_tog='init'
    await delay(400)
    this.prog_tog='final'
    // //console.log("pbres",this.prog_bar)
    this.prog_bar=true
    this.shd.changeDFlag_wk('prod',true);
    this.shd.changeFlag('det',true);
    this.shd.changeFlag('result',false);
  }

  get_cart(it){
    if(window.localStorage){
      if (Object.keys(this.localSt).length > 0){
        var s=this.localSt.hasOwnProperty('wish_pri')?this.localSt['wish_pri']:"";
        // //console.log("in get_cart")
        // //console.log(s)
        if(s){
          let t=JSON.parse(s);
          let ind=t.findIndex(x=> x.itemId[0]===it.itemId[0]);
          //console.log("ind:::",ind)
          if(ind!=-1){
            return 'remove_shopping_cart';
          }
        }
      }
    }
    return 'add_shopping_cart';

  }
  remove_wish(it,k){
    if (Object.keys(this.localSt).length > 0){
      //console.log("inrem len>0")
      var s=this.localSt['wish_pri'];
      var ps=JSON.parse(s);

      ps=ps.filter(x => x.itemId[0]!=it.itemId[0])
      //console.log(ps)
      this.shd.changeLocalSt('wish_pri',JSON.stringify(ps));
      // this.tb=nt;
    }
    else{
      alert("error");
    }
    // this.cart[k]=this.get_cart(it);
  }
  add_wish(it,k){
    if(window.localStorage){
      var ct=this.get_cart(it);
      if(ct=='add_shopping_cart'){
        if (Object.keys(this.localSt).length > 0){
          //console.log("inadd len>0")
          var s=this.localSt['wish_pri'];
          //console.log(typeof s);
          if(s){
            let t=JSON.parse(s);
            let ind=t.findIndex(x=> x.itemId[0]===it.itemId[0]);
            if(ind==-1){
              t.push(it);
              var st=JSON.stringify(t);
              this.shd.changeLocalSt('wish_pri',st);
            }

          }
          else{
            //console.log("elseofs")
            var ar=[];
            ar.push(it)
            var st=JSON.stringify(ar);
            this.shd.changeLocalSt('wish_pri',st);
          }
        }
        else{
          //console.log("elseoflen")
          var ar=[];
          ar.push(it)
          var st=JSON.stringify(ar);
          // //console.log(st)
          this.shd.changeLocalSt('wish_pri',st);

        }
      }
      else{
        this.remove_wish(it,k);
      }
      //console.log(this.cart[k],this.get_cart(it))
      this.cart[k]=this.get_cart(it);
    }
    else{
      alert("Outdated browser");
    }

  }

}
