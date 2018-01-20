import { User } from './../../model/models';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
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
  user: User = new User();
  isLoggedin: boolean;
  isAuthor: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fireAuth: AngularFireAuth, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage, 
    private sqliteService: SqliteServiceProvider,
    private firebaseService: FirebaseServiceProvider) {

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
        
        this.storage.set('isLoggedin', true);
        this.isLoggedin = true;

        this.firebaseService.getUsers({
          orderByChild: 'email',
          equalTo: this.email
        }).subscribe(user => {
          this.user = user[0]
          console.log(this.user)
          this.storage.set('isAuthor', this.user.isAuthor);
          if(this.user.isAuthor) {
            this.storage.set('idAuthor', this.user.$key);
          }
          this.isAuthor = this.user.isAuthor;
        
        });

        loader.dismiss();
        
        if(this.navParams !== null) {
          this.buyAudioguide();
        } 
        
        this.navCtrl.push('MyguidesPage');
      }
    ).catch(
      (error) => {
        this.storage.set('isLoggedin', false);
        loader.dismiss();
        this.handlerError(error)
      }
    )
  }

  buyAudioguide() {
    // TODO sistema de compra
    this.sqliteService.getDatabaseState().subscribe(ready => {
      if(ready) {
        this.sqliteService.addAudioguide(this.navParams.get('idGuide'), this.navParams.get('audioguide'), this.navParams.get('pois')).catch(error => this.handlerError(error));
      }
    }) 
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
