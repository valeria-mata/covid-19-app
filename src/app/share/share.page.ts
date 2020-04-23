import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharingService } from '../services/sharing.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  constructor(private router: Router, private social: SharingService) { }

  ngOnInit() {
  }

  openShare(){
    
  }

  skipShare() {
    this.router.navigate(['recommendations']);
  }

}
