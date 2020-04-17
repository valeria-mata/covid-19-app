import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { slidesInfo } from '../constants/slides';
import { Slides } from '../models/catalogs';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss'],
})
export class SliderPage implements OnInit {

  slidesInfo : Slides[] = slidesInfo;
  disablePrevBtn: boolean = true;
  disableNextBtn: boolean = false;

  constructor(private router: Router, private database: DatabaseService) { }

  @ViewChild('slides', {static: false}) ionSlides: IonSlides;

  ngOnInit() {
    this.database.selectAll().then(data => {
      if(data.length > 0){
        console.log(data);
        this.router.navigate(['diagnose']);
      }
    }, error => {
      console.error(error);
    });
  }

  doCheck() {
    let prom1 = this.ionSlides.isBeginning();
    let prom2 = this.ionSlides.isEnd();
  
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

  nextSlide(){
    this.ionSlides.slideNext();
  }

  previousSlide(){
    this.ionSlides.slidePrev();
  }

  goToHome(){
    this.router.navigate(['home']);
  }

}
