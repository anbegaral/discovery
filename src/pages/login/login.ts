import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms/forms';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Auth, AngularFireAuth } from "angularfire2/auth";
import { User } from "firebase/app";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  showLogin:boolean = true;
  @ViewChild('email') email:string;
  @ViewChild('password') password:string;
  name:string = '';
  loginForm: FormGroup;
  users: FirebaseListObservable<any>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private afDB: AngularFireDatabase, 
    public fireAuth: AngularFireAuth, 
    private storage: Storage, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) {

      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/'), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('(?=^.{8,20}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'), Validators.required])],
      });

      this.users = this.afDB.list('users');
  }

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

  doLogin() {

    let loader = this.loadingCtrl.create({
      content: "Logging in your account..."
    });
    loader.present();

    this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(
      (data) => {
        console.log(data)
        loader.dismiss();
        this.navCtrl.push('MyguidesPage');
      }
    ).catch(
      (error) => {
        loader.dismiss();
        this.handlerError(error)
      }
    )
  }

  handlerError(error) {
    this.alertCtrl.create({
      title: 'Error',
      message: error.message,
      buttons: [        
        {
          text: 'Close',
          handler: data => console.log(error) 
        }
      ]
    }).present();
  }
}
