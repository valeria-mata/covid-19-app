import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserData } from '../models/user';
import { DataService } from '../services/data.service';
import { ActivationService } from '../services/activation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userRegistration: FormGroup;
  userPlain: UserData;

  aux : any = '';

  constructor(private fb: FormBuilder, public router: Router,
              private data: DataService, private activation: ActivationService) {

    this.userRegistration = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('^[\\d]{10}$')])],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      accept: [true, Validators.compose([Validators.requiredTrue])],
    });

  }

  sendInformation() {
    
   this.userPlain = {
      name : this.userRegistration.controls.name.value,
      phone : this.userRegistration.controls.phone.value,
      email : this.userRegistration.controls.email.value 
    };

    this.data.setUserData(this.userPlain);

    this.activation.sendEmail(this.userRegistration.controls.email.value, this.userRegistration.controls.phone.value).subscribe(res => {
      console.log(res);
      this.router.navigate(['activation']);

    }, error => {
      console.log(error);
    });
    
  }

}
