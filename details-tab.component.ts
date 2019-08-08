import { Component, OnInit,HostListener } from '@angular/core';
import { RequesterService } from '../requester.service';
import { ShareDataService } from '../share-data.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { delay } from 'q';

@Component({
  selector: 'app-details-tab',
  templateUrl: './details-tab.component.html',
  styleUrls: ['./details-tab.component.css'],
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
export class DetailsTabComponent implements OnInit {
  fl={};
  flgs={};
  title="";
  localSt={};
  it={}
  // t_url="https://www.facebook.com/dialog/share?app_id=1183569605158609&display=popup&href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F&redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer";
  url="";
  prog_bar=true;
  prog_tog='final';
  tb_fl:any;
  srch_f=false;
  tab_name=window.innerWidth>770?'Similiar Products':'Related';
  @HostListener('window:resize', ['$event'])
  onResize(event){
   ////console.log("Width: " + event.target.innerWidth);
   if (event.target.innerWidth <= 768){
     this.tab_name = 'Related';
   }else {
     this.tab_name = 'Similar Products';
   }
  }
  constructor(private reqService: RequesterService,private shd:ShareDataService) {
    // this.tab_name=this.get_name();

    this.shd.d_flag_c.subscribe(rs => this.fl=rs);
    this.shd.srch_f_c.subscribe(rs => this.srch_f=rs);
    // console.log("hghshjsdjhdg",this.fl)
    this.shd.flag_c.subscribe(rs => this.flgs=rs);
    this.shd.localSt_c.subscribe(rs => {this.localSt=rs;});
    // this.shd.ani_c.subscribe(rs => this.ani=rs);
    this.shd.tb_flag_c.subscribe(rs => this.tb_fl=rs);
    this.shd.det_cur.subscribe(rs => {
      //console.log(rs);
      this.it=rs;
      if(rs.hasOwnProperty('viewItemURL')){
        this.url+="https://www.facebook.com/dialog/share?app_id=1183569605158609&display=popup&href="+rs['viewItemURL'];
      }
      if(rs.hasOwnProperty('title')){
        this.title=rs['title'][0];
        this.url+="&quote=Buy "+rs['title'][0];
      }
      if(this.get_sellPrice(rs)!="N/A"){
        this.url+=" at "+this.get_sellPrice(rs)+" from link below";
      }
      if(this.flgs['prev']=='wishlist' && !this.srch_f){
        // console.log("in deeeeetttttaaaaiilllls")
        if(rs.hasOwnProperty('title')){
          this.reqService.findProdPhotos({"title":["title"][0]}).subscribe(data => {
            this.shd.changePhoto(data);
            //console.log(data);
          });
        }
        if(this.it.hasOwnProperty("itemId")){
          // this.shd.changeFlag('prog',true);
          this.reqService.findProdDet({"id":this.it["itemId"][0]}).subscribe(data => {
            // console.log("now only getting data for prod det")
            this.shd.changeProdDet(data);
            this.shd.changeDFlag_wk('prod',true);
            //console.log(data);
          });

          this.reqService.findSim({"id":this.it["itemId"][0]}).subscribe(data => {
            this.shd.changeSim(data);
          });
        }
      }
    });

  }
  get_sellPrice(it){
    if(it.hasOwnProperty('sellingStatus') && it['sellingStatus'][0].hasOwnProperty('currentPrice')){
      return "$"+parseFloat(it['sellingStatus'][0]['currentPrice'][0].__value__);
    }
    else{
      return "N/A";
    }
  }
  ngOnInit() {

  }
  prod(){
    var flags={'prod':true,'photos':false,'ship':false,'sell':false,'simi':false,'cart':this.fl['cart']};
    this.shd.changeDFlag(flags);
  }
  photos(){
    var flags={'prod':false,'photos':true,'ship':false,'sell':false,'simi':false,'cart':this.fl['cart']};
    this.shd.changeDFlag(flags);
  }
  ship(){
    var flags={'prod':false,'photos':false,'ship':true,'sell':false,'simi':false,'cart':this.fl['cart']};
    this.shd.changeDFlag(flags);
  }
  seller(){
    var flags={'prod':false,'photos':false,'ship':false,'sell':true,'simi':false,'cart':this.fl['cart']};
    this.shd.changeDFlag(flags);
  }
  simi_prod(){
    var flags={'prod':false,'photos':false,'ship':false,'sell':false,'simi':true,'cart':this.fl['cart']};
    this.shd.changeDFlag(flags);
  }


  async get_res(){
    this.prog_bar=false
    this.prog_tog='init'
    await delay(400)
    this.prog_bar=true;
    this.shd.changeFlag('det',false);
    this.shd.changeFlag(this.flgs['prev'],true);
  }
  toggle_cart(cart){
    if(cart=='add_shopping_cart'){
      return 'remove_shopping_cart';
    }
    else{
      return 'add_shopping_cart';
    }
  }
  get_name(){
    if(window.innerWidth<=768){
      this.tab_name= "Related"
    }
    else{
      this.tab_name= "Similiar Products"
    }
  }
  remove_wish(){
    if (Object.keys(this.localSt).length > 0 && this.it.hasOwnProperty('itemId')){
      //console.log("inrem len>0")
      var s=this.localSt['wish_pri'];
      var ps=JSON.parse(s);
      ps=ps.filter(x => x.hasOwnProperty('itemId') && x['itemId'][0]!=this.it['itemId'][0]);
      //console.log(ps)
      this.shd.changeLocalSt('wish_pri',JSON.stringify(ps));


    }
    else{
      alert("error");
    }
  }

  add_wish(){
    if(window.localStorage){
      var ct=this.fl['cart'];
      if(ct=='add_shopping_cart'){
        if (Object.keys(this.localSt).length > 0 && this.it.hasOwnProperty('itemId')){
          //console.log("inadd len>0")
          var s=this.localSt['wish_pri'];
          //console.log(typeof s);
          if(s){
            let t=JSON.parse(s);
            let ind=t.findIndex(x=> x.itemId[0]===this.it['itemId'][0]);
            if(ind==-1){
              t.push(this.it);
              var st=JSON.stringify(t);
              this.shd.changeLocalSt('wish_pri',st);
            }

          }
          else{
            //console.log("elseofs")
            var ar=[];
            ar.push(this.it)
            var st=JSON.stringify(ar);
            this.shd.changeLocalSt('wish_pri',st);
          }
        }
        else{
          //console.log("elseoflen")
          var ar=[];
          ar.push(this.it)
          var st=JSON.stringify(ar);
          // console.log(st)
          this.shd.changeLocalSt('wish_pri',st);
        }
      }
      else{
        this.remove_wish();
      }
      this.fl['cart']=this.toggle_cart(this.fl['cart'])
      this.shd.changeDFlag(this.fl);
    }
    else{
      alert("Outdated browser");
    }

  }

}
