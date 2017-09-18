import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('email') email:string;
  @ViewChild('password') password:string;
  loginForm: FormGroup;
  
  constructor(public navCtrl: NavController,
    private afDB: AngularFireDatabase, 
    public fireAuth: AngularFireAuth, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage) {

      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(20), Validators.required])],
      });
  }

  doLogin() {

    let loader = this.loadingCtrl.create({
      content: "Logging in your account..."
    });
    loader.present();

    this.fireAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(
      (data) => {
        console.log(data)
        this.storage.set('isLoggedin', true);
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
