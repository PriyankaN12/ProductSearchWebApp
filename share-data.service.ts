import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  flags:any={'result':false,'no_res':false,'wishlist':false,'det':false,'prev':'','sel':'','prog':false};
  private flag_s = new BehaviorSubject(this.flags);
  flag_c = this.flag_s.asObservable();

  d_flags:any={'prod':false,'photos':false,'ship':false,'sell':false,'simi':false,'cart':'add_shopping_cart'};
  private d_flag_s = new BehaviorSubject(this.d_flags);
  d_flag_c = this.d_flag_s.asObservable();

  md_flags:any={'img':false};
  private md_flag_s = new BehaviorSubject(this.md_flags);
  md_flag_c = this.md_flag_s.asObservable();

  tb_flags={'prod':false,'photos':false,'simi':false};
  private tb_flag_s = new BehaviorSubject(this.tb_flags);
  tb_flag_c = this.tb_flag_s.asObservable();

  det_v=true;
  private det_v_s = new BehaviorSubject(this.det_v);
  det_v_c = this.det_v_s.asObservable();

  wait=false;
  private wait_s = new BehaviorSubject(this.wait);
  wait_c = this.wait_s.asObservable();

  ani=true;
  private ani_s = new BehaviorSubject(this.ani);
  ani_c = this.ani_s.asObservable();

  item_id="";
  private item_id_s = new BehaviorSubject(this.item_id);
  item_id_c = this.item_id_s.asObservable();

  localSt=localStorage.getItem('wish_pri')?{'wish_pri':localStorage.getItem('wish_pri')}:{};
  private localSt_s = new BehaviorSubject(this.localSt);
  localSt_c = this.localSt_s.asObservable();

  md_img_i={}
  private md_img = new BehaviorSubject(this.md_img_i);
  md_img_c = this.md_img.asObservable();

  res_tab_i={}
  private res_tab = new BehaviorSubject(this.res_tab_i);
  res_cur = this.res_tab.asObservable();

  det_tab_i={}
  private det_tab = new BehaviorSubject(this.det_tab_i);
  det_cur = this.det_tab.asObservable();

  pr_det_tab_i={}
  private pr_det_tab = new BehaviorSubject(this.pr_det_tab_i);
  pr_det_cur = this.pr_det_tab.asObservable();

  photo_i:any;
  private photo_s = new BehaviorSubject(this.photo_i);
  photo_c = this.photo_s.asObservable();

  prod_det_i:any;
  private prod_det_s = new BehaviorSubject(this.prod_det_i);
  prod_det_c = this.prod_det_s.asObservable();

  sim_i:any;
  private sim_s = new BehaviorSubject(this.sim_i);
  sim_c = this.sim_s.asObservable();

  srch_f=false;
  private srch_f_s = new BehaviorSubject(this.srch_f);
  srch_f_c = this.srch_f_s.asObservable();


  constructor() {
    //console.log("inser");
    //console.log(this.localSt)
  }

  changeFlag(fl_k,v) {
    this.flags[fl_k]=v;
    this.flag_s.next(this.flags);
  }


  changeTbFlag(fl_k,v) {
    this.tb_flags[fl_k]=v;
    this.tb_flag_s.next(this.tb_flags);
  }

  changeDFlag(fl) {
    this.d_flag_s.next(fl);
  }

  changeDFlag_wk(k,fl) {
    this.d_flags[k]=fl
    this.d_flag_s.next(this.d_flags);
  }

  changeMDFlag(fl) {
    this.md_flag_s.next(fl);
  }
  changeWait(fl) {
    this.wait_s.next(fl);
  }
  changeAni(fl) {
    this.ani_s.next(fl);
  }
  changeDetV(f){
    this.det_v_s.next(f);
  }
  changeId(f){
    this.item_id_s.next(f);
  }
  changeRes(res){
    this.res_tab.next(res);
  }
  changeDet(res){
    // console.log("shd:::")
    // console.log(res)
    this.det_tab.next(res);
  }

  changeSrch(res){
    this.srch_f_s.next(res);
  }

  changePrDet(res){
    //console.log("shd:changePrDet")
    this.pr_det_tab.next(res);
  }

  changeProdDet(res){
    //console.log("shd:changeProdDet")
    this.prod_det_s.next(res);
  }

  changePhoto(res){
    //console.log("shd:changePhoto")
    this.photo_s.next(res);
  }

  changeSim(res){
    //console.log("shd:changeSim")
    this.sim_s.next(res);
  }

  changeMDImg(res){
    this.md_img.next(res);
  }
  changeLocalSt(k,res){
    if(res){
      localStorage.setItem(k,res);
      this.localSt_s.next({'wish_pri':res});
    }
    else{
    console.log("insev else")
    localStorage.removeItem('wish_pri')
    this.localSt_s.next({});
    }
  }
  reset(){
    this.flags={'result':false,'no_res':false,'wishlist':false,'det':false,'prev':'','sel':'','prog':false};
    this.flag_s.next(this.flags);
    this.d_flags={'prod':false,'photos':false,'ship':false,'sell':false,'simi':false,'cart':'add_shopping_cart'};
    this.d_flag_s.next(this.d_flags);
    let fl3:any={'img':false};
    this.md_flag_s.next(fl3);
    this.tb_flags={'prod':false,'photos':false,'simi':false};
    this.tb_flag_s.next(this.tb_flags);
    let det_v1=true;
    this.det_v_s.next(det_v1);
    this.item_id_s.next("");
    let local=localStorage.getItem('wish_pri')?{'wish_pri':localStorage.getItem('wish_pri')}:{};
    this.localSt_s.next(local)
    this.md_img.next({});
    this.res_tab.next({});
    this.det_tab.next({});
    this.pr_det_tab.next({});
    let ph:any;
    this.photo_s.next(ph);
    let pr:any;
    this.prod_det_s.next(pr);
    let sm:any;
    this.sim_s.next(sm);
    this.srch_f_s.next(false);
    console.log(local);
  }

}
