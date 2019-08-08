import { Component,Input } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ValidateKey,ValidateZip } from './validators/key_val';
import { RequesterService } from './requester.service';
import { ShareDataService } from './share-data.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { delay } from 'q';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'hw8';
  options=[];
  zipcode="";
  s_f=false;
  flgs={};
  prog_bar=false;
  prog_bar_f=false;
  tst="false";
  det_cur=false;
  srch_f=false;
  rest=true;
  d_flgs={}
  constructor(public fb: FormBuilder,private reqService: RequesterService,private shd:ShareDataService){
    // localStorage.clear();
    this.shd.flag_c.subscribe(rs => this.flgs=rs);
    this.shd.d_flag_c.subscribe(rs => this.d_flgs=rs);
    this.shd.srch_f_c.subscribe(rs => this.srch_f=rs);
    this.shd.det_v_c.subscribe(rs => this.det_cur=rs);
    this.shd.wait_c.subscribe(rs => this.prog_bar=rs);

  }
  fm=this.fb.group({
    key:['',[Validators.required, ValidateKey]],
    cat:['all'],
    cond:this.fb.group({
      c_new:false,
      c_used:false,
      c_un:false
    }),
    ship:this.fb.group({
      s_loc:[false],
      s_fr:[false]
    }),
    dist:[''],
    loc:['here'],
    zip:this.fb.control({value: '', disabled: true},[Validators.required,ValidateZip])
    // zip:['',ValidateZip]
  })
    // this.fm.controls.zip.disable();
  ct=this.fm.controls;
  reset(){
    this.options=[];
    this.zipcode="";
    this.s_f=false;
    this.flgs={};
    this.prog_bar=false;
    this.prog_bar_f=false;
    this.tst="false";
    this.det_cur=false;
    this.srch_f=false;
    this.rest=true;
    this.fm=this.fb.group({
      key:['',[Validators.required, ValidateKey]],
      cat:['all'],
      cond:this.fb.group({
        c_new:false,
        c_used:false,
        c_un:false
      }),
      ship:this.fb.group({
        s_loc:[false],
        s_fr:[false]
      }),
      dist:[''],
      loc:['here'],
      zip:this.fb.control({value: '', disabled: true},[Validators.required,ValidateZip])
      // zip:['',ValidateZip]
    })
    this.shd.reset();
  }
  key_ch(){
    if((this.fm.controls['key'].invalid || (this.fm.controls['key'].errors && this.fm.controls['key'].errors.keyVal)) && (this.fm.controls['key'].touched )){
      return true;
    }
    return false;
  }
  zip_ch(){
    var v=this.fm.controls['zip'].value.trim();
    if(!this.fm.controls['zip'].disabled && !(v.length>0) && this.fm.controls['zip'].touched ){

      return true;
    }
    return false;
  }
  zip_en(){
        // //console.log(this.fm.controls.loc.value)
    if(this.fm.controls.loc.value=="here"){
      // this.fm.controls.zip.value='';
      this.fm.controls.zip.disable();
    }
    else{
      this.fm.controls.zip.enable();
    }
  }
  search_en_ch(){
    let z=this.fm.controls['zip'];
    if(this.fm.controls['key'].invalid || (this.fm.controls['key'].errors && this.fm.controls['key'].errors.keyVal)){
      return true;
    }
    if(!z.disabled){
      if (z.errors && this.fm.controls['zip'].errors.zipVal){
        return true;
      }
    }
    return false;
  }

  autoComp(){
    // //console.log("in ac");

    var z=this.fm.controls['zip'].value.trim();
    if (z.length>=3){
      this.reqService.getSugg(z).subscribe(data => {
        // //console.log("autocomp:"+JSON.stringify(data));
        if(data && data["postalCodes"]){
          this.options=[];
          var p=data["postalCodes"]
          for(var i=0;i<p.length;i++){
            if(p[i]["postalCode"]){
              this.options.push(p[i]["postalCode"]);
            }
          }
        }
        // //console.log(this.options);
    });
    }
    else{
      this.options=[];
    }

  }
  get_loc(){
    this.reqService.getIP().subscribe(data => {
      //console.log(data);
      if(data && data.hasOwnProperty("zip")){
        this.zipcode=data["zip"];
        this.s_f=false;
        //console.log(this.zipcode);
        this.findAPI();
      }
    })
  }
  search_p(){
    this.shd.reset();
    if(this.fm.controls.loc.value=='here'){
      this.s_f=true;
      this.get_loc();
    }
    else{
      this.zipcode=this.fm.controls.zip.value;
      this.findAPI();
    }
    this.shd.changeSrch(true);
  }
  findAPI(){
    var q={}
    q['keyword']=this.ct.key.value;
    q['category']=this.ct.cat.value;
    q["new"]=String(this.ct.cond.value.c_new);
    q["used"]=String(this.ct.cond.value.c_used);
    q["unspecified"]=String(this.ct.cond.value.c_un);
    q["local"]=String(this.ct.ship.value.s_loc);
    q["free"]=String(this.ct.ship.value.s_fr);
    if(this.ct.dist.value){
      q["dist"]=this.ct.dist.value;
    }
    else{
      q["dist"]="10";
    }
    q["zip"]=this.zipcode;
    this.prog_bar_f=true;
    this.reqService.findProd(q).subscribe(data => {
      this.prog_bar_f=false;

      if(data && data.hasOwnProperty('findItemsAdvancedResponse') && data.findItemsAdvancedResponse[0].hasOwnProperty('searchResult') && data.findItemsAdvancedResponse[0].searchResult[0].hasOwnProperty('item')){

        this.shd.changeFlag('result',true);
        this.shd.changeFlag('no_res',false);
        // console.log("should change res",this.prog_bar)

        this.shd.changeRes(data.findItemsAdvancedResponse[0].searchResult[0].item);
      }
      else{
        this.shd.changeFlag('result',true);
        this.shd.changeFlag('no_res',true);
      }
      console.log(data);
      this.prog_bar_f=false;
      // console.log("done",this.prog_bar)
    },
    (err) => {
      this.shd.changeFlag('result',true);
      this.shd.changeFlag('no_res',true);
      this.prog_bar_f=false;
    }
  )
  }
  restab(){
    this.rest=true;
    this.shd.changeFlag('result',true);
    this.shd.changeFlag('det',false);
    this.shd.changeFlag('wishlist',false);


  }
  wishtab(){
    this.rest=false;
    this.shd.changeFlag('result',false);
    this.shd.changeFlag('det',false);
    this.shd.changeFlag('wishlist',true);
  }

}
