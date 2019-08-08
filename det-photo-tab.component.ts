import { Component, OnInit } from '@angular/core';
import { RequesterService } from '../requester.service';
import { ShareDataService } from '../share-data.service';

@Component({
  selector: 'app-det-photo-tab',
  templateUrl: './det-photo-tab.component.html',
  styleUrls: ['./det-photo-tab.component.css']
})
export class DetPhotoTabComponent implements OnInit {
  photos:any;
  title:any;
  no_res=false;
  ch_photos=[];
  constructor(private reqService: RequesterService,private shd:ShareDataService) {
    this.shd.det_cur.subscribe(rs => {
      if(rs && rs.hasOwnProperty('title')){
        this.title=rs['title'][0];
        this.shd.photo_c.subscribe(data => {
          if(data && data.hasOwnProperty("items")){
            this.photos=data["items"];
            this.arrange(this.photos);
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

  ngOnInit() {
  }
  arrange(arr){
    // let x=Math.ceil(arr.length/3);
    for(let i=0;i<3;i++){
      var j=i;
      while(j<8){
        if(j<arr.length){
          this.ch_photos.push(arr[j]);
        }
        else{
          this.ch_photos.push('');
        }

        j+=3;
      }

    }
  }

}
