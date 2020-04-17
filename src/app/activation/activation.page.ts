import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { bindNodeCallback } from 'rxjs';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.page.html',
  styleUrls: ['./activation.page.scss'],
})
export class ActivationPage implements OnInit {

  @ViewChild('field1', { static: false }) field1;
  @ViewChild('field2', { static: false }) field2;
  @ViewChild('field3', { static: false }) field3;
  @ViewChild('field4', { static: false }) field4;
  @ViewChild('field5', { static: false }) field5;
  @ViewChild('field6', { static: false }) field6;

  smsCode: any = { first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' };

  code = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  constructor(private router: Router) { }

  ngOnInit() {
  }

  generateCode() {
    this.code.setValue(`${this.smsCode.first}${this.smsCode.second}${this.smsCode.third}${this.smsCode.fourth}${this.smsCode.fifth}${this.smsCode.sixth}`);
  }

  eventIonChange(next, before, event) {
    const valueInput = event.target.value;
    if (valueInput === '') {
      switch (before) {
        case 1:
          this.field1.setFocus();
          break;
        case 2:
          this.field2.setFocus();
          break;
        case 3:
          this.field3.setFocus();
          break;
        case 4:
          this.field4.setFocus();
          break;
        case 5:
          this.field4.setFocus();
          break;
      }
    } else {
      switch (next) {
        case 2:
          this.field2.setFocus();
          break;
        case 3:
          this.field3.setFocus();
          break;
        case 4:
          this.field4.setFocus();
          break;
        case 5:
          this.field5.setFocus();
          break;
        case 6:
          this.field6.setFocus();
          break;
      }
    }
  }

  validateActivationCode() {
    console.log(this.code.value);
    this.router.navigate(['diagnose']);
  }

  sendAgain(){
    this.router.navigate(['home']);
  }

}
