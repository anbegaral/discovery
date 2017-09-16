import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from "@angular/forms/forms";
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the RegisterContributorPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-contributor',
  templateUrl: 'register-contributor.html',
})
export class RegisterContributorPage {
  @ViewChild('email') email:string;
  @ViewChild('password') password:string;
  registerContributorForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fireAuth: AngularFireAuth, private storage: Storage, public formBuilder: FormBuilder) {
    this.registerContributorForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: [''],
      password: ['']
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterContributorPage');
  }

}
