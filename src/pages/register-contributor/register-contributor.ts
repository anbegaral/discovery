import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AngularFireAuth } from "angularfire2/auth";
import { Storage } from '@ionic/storage';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-register-contributor',
  templateUrl: 'register-contributor.html',
})
export class RegisterContributorPage {
  @ViewChild('firstName') firstName:string;
  @ViewChild('lastName') lastName:string;
  @ViewChild('address') address:string;
  @ViewChild('city') city:string;
  @ViewChild('postcode') postcode:string;
  @ViewChild('country') country:string;
  @ViewChild('bankaccount') bankaccount:string;
  @ViewChild('email') email:string;
  @ViewChild('password') password:string;
  registerContributorForm: FormGroup;
  loader: any;
  users: FirebaseListObservable<any>
  EMAIL_PATTERN: string = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  PASSWORD_PATTERN: string = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public fireAuth: AngularFireAuth, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, 
    private storage: Storage, 
    private afDB: AngularFireDatabase,  ) {
    this.registerContributorForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      address: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      city: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      postcode: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      country: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      bankaccount: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(this.EMAIL_PATTERN), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(20), Validators.required])],
    });

    this.users = this.afDB.list('users');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterContributorPage');
  }

  registerContributor(){
    this.loader = this.loadingCtrl.create({
      content: "Creating your account..."
    });
    this.loader.present();

    this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then(
      () => {
        this.storage.set('useremail', this.email)
        this.storage.set('isLoggedin', true);
        this.storage.set('isAuthor', true);
        this.addContributor();
        this.loader.dismiss();
        this.navCtrl.pop();
      }
    ).catch(
      (error) => {
        this.loader.dismiss();
        // this.utils.handlerError(error);
      }
    )
  }

  addContributor(){
    this.users.push({
      isAuthor: true,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      city: this.city,
      postcode: this.postcode,
      country: this.country,
      bankaccount: this.bankaccount,
      email: this.email,
    });
  }
}
