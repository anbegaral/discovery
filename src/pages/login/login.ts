import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FormGroup, FormBuilder,Validators } from "@angular/forms";
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild('email') email:string;
  @ViewChild('password') password:string;
  loginForm: FormGroup;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fireAuth: AngularFireAuth, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage, 
    private sqliteService: SqliteServiceProvider) {

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
        this.sqliteService.getDatabaseState().subscribe(ready => {
          if(ready) {
            this.buyAudioguide();
          }
        })  
        
        this.navCtrl.push('MyguidesPage');
      }
    ).catch(
      (error) => {
        loader.dismiss();
        this.handlerError(error)
      }
    )
  }

  buyAudioguide() {
          // TODO sistema de compra
    this.sqliteService.addAudioguide(this.navParams.get('idGuide'), this.navParams.get('audioguide'), this.navParams.get('pois'));
  }

  handlerError(error) {
    this.alertCtrl.create({
      title: 'Error',
      message: error.message,
      buttons: [        
        {
          text: 'Close',
          handler: data => console.log(data) 
        }
      ]
    }).present();
  }
}
