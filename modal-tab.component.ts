import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RequesterService } from '../requester.service';
import { ShareDataService } from '../share-data.service';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-tab',
  templateUrl: './modal-tab.component.html',
  styleUrls: ['./modal-tab.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalTabComponent implements OnInit {
  img_f=true;
  imgs:any;
  constructor(private shd:ShareDataService,public activeModal: NgbActiveModal) {
    //console.log("hey");
    this.shd.md_flag_c.subscribe(rs => this.img_f=rs['img']);
    this.shd.md_img_c.subscribe(rs => {
      this.imgs=rs;
    });
    //console.log(this.imgs)

  }

  ngOnInit() {
  }
  close(){
    this.shd.changeMDFlag({'img':false});
  }
  ind(x){
    // //console.log("hhfhfgfhg",this.imgs.length)
    return this.imgs.indexOf(x);
  }
}
