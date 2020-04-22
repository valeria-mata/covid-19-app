import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openShare(){
    
  }

  skipShare() {
    this.router.navigate(['recommendations']);
  }

}
