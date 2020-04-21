import { Component, OnInit } from '@angular/core';
import { recommendations } from '../constants/recommendations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.page.html',
  styleUrls: ['./recommendations.page.scss'],
})
export class RecommendationsPage implements OnInit {

  recommendations = recommendations; 

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToHome() {
    this.router.navigate(['home']);
  }

}
