import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";

@IonicPage()
@Component({
  selector: 'page-register-user',
  templateUrl: 'register-user.html',
})
export class RegisterUserPage {

  @ViewChild('email') email:string;
  @ViewChild('password') password:string;
  registerForm: FormGroup;
  users: FirebaseListObservable<any>
  EMAIL_PATTERN: string = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  PASSWORD_PATTERN: string = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
  
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private afDB: AngularFireDatabase, 
    public fireAuth: AngularFireAuth, 
    private storage: Storage, 
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, 
    private sqliteService: SqliteServiceProvider) {

      this.registerForm = formBuilder.group({
        email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(this.EMAIL_PATTERN), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(20), Validators.required])],
      });

      this.users = this.afDB.list('users');
  }


  registerUser(){
    this.loader = this.loadingCtrl.create({
      content: "Creating your account..."
    });
    this.loader.present();

    this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password).then(
      () => {
        this.storage.set('useremail', this.email);
        this.storage.set('isLoggedin', true);       
        this.addUser();
        this.loader.dismiss(); 
        this.buyAudioguide();       
      }
    ).catch(
      (error) => {
        this.loader.dismiss();
        this.handlerError(error)
      }
    )
  }

  addUser(){
    this.users.push({
      isAuthor: false,
      email: this.email,
    }).catch(
      (error) => {
        this.loader.dismiss();
        this.handlerError(error)
      }
    )
  }

  buyAudioguide() {
        // TODO sistema de compra 
        this.sqliteService.addAudioguide(this.navParams.get('idGuide'), this.navParams.get('audioguide'), this.navParams.get('pois'))
        .then(() => this.navCtrl.push('MyguidesPage')); 
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
