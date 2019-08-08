import { Component, OnInit } from '@angular/core';
import { RequesterService } from '../requester.service';
import { ShareDataService } from '../share-data.service';
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalTabComponent } from '../modal-tab/modal-tab.component';

@Component({
  selector: 'app-det-prod-tab',
  templateUrl: './det-prod-tab.component.html',
  styleUrls: ['./det-prod-tab.component.css']
})
export class DetProdTabComponent implements OnInit {
  fl={};
  details={};
  item={};
  img_f=false;
  flgs={}
  no_res=false;
  tb_fl={}
  prog=true;
  constructor(private reqService: RequesterService,private shd:ShareDataService,private modalService: NgbModal) {
    this.shd.d_flag_c.subscribe(rs => this.fl=rs);
    this.shd.flag_c.subscribe(rs => this.flgs=rs);
    this.shd.md_flag_c.subscribe(rs => this.img_f=rs['img']);
    this.shd.tb_flag_c.subscribe(rs => this.tb_fl=rs);
    this.shd.det_cur.subscribe(rs => {
      this.item=rs;

      if(this.item.hasOwnProperty("itemId")){
        this.shd.changeFlag('prog',true);
        this.shd.prod_det_c.subscribe(data => {
          if(data && data.hasOwnProperty("Item")){
            this.details=data["Item"];
            this.shd.changePrDet(this.details);
            this.no_res=false;
          }
          else{
            this.no_res=true;

          }
        });
      }
      else{
        this.no_res=true;
      }
    });

  }
  nor(){
    return this.no_res;
  }
  get_price(){
    return "$"+parseFloat(this.details['CurrentPrice']['Value']);
  }
  get_returns(){
    var p=""
    if(this.details['ReturnPolicy'].hasOwnProperty('ReturnsAccepted')){
      p+=this.details['ReturnPolicy']['ReturnsAccepted'];
    }
    if(this.details['ReturnPolicy'].hasOwnProperty('ReturnsWithin')){
      p+=" within "+this.details['ReturnPolicy']['ReturnsWithin'];
    }
    return p;
  }
  get_item_spec(){
    if(this.details.hasOwnProperty('ItemSpecifics')){
      if(this.details['ItemSpecifics'].hasOwnProperty('NameValueList')){
        return this.details['ItemSpecifics']['NameValueList'];
      }
    }
    return [];
  }
  ngOnInit() {
  }
  get_prod_img(){
    this.shd.changeMDFlag({'img':true});
    this.shd.changeMDImg(this.details['PictureURL']);
    this.open();
  }
  open() {
    const modalRef = this.modalService.open(ModalTabComponent);
    modalRef.componentInstance.name = 'World';
  }

}
