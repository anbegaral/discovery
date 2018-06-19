import { Audioguide } from './../../model/models';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { OnInit } from '@angular/core';
// import { Utils } from './../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import { User } from '../../model/models';
import { Utils } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-register-user',
  templateUrl: 'register-user.html',
})
export class RegisterUserPage implements OnInit{

  @ViewChild('email') email:string;
  @ViewChild('password') password:string;
  registerForm: FormGroup;
  users: User[];
  newUser = new User();
  audioguide: Audioguide;
  
  EMAIL_PATTERN: string = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  PASSWORD_PATTERN: string = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";
  
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public fireAuth: AngularFireAuth, 
    private storage: Storage, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, 
    private sqliteService: SqliteServiceProvider,
    private firebaseService: FirebaseServiceProvider,
    private utils: Utils,
  ) {

      this.registerForm = formBuilder.group({
        email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(this.EMAIL_PATTERN), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(20), Validators.required])],
      });

     this.audioguide = this.navParams.data;
  }

  ngOnInit() {
     this.firebaseService.getUsers({}).valueChanges().subscribe(users => this.users = users)
  }

  registerUser(){
    this.loader = this.loadingCtrl.create({
      content: "Creating your account..."
    });
    this.loader.present();

    this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then(
      () => {
        console.log('this.email '+ this.email)
        this.storage.set('useremail', this.email);
        this.storage.set('isLoggedin', true); 
        this.storage.set('isAuthor', false);      
        this.addUser();
        this.loader.dismiss(); 
        this.storage.get('useremail').then((email) => console.log(email)).catch(error => console.log(error))
        this.sqliteService.getDatabaseState().subscribe(ready => {
          if(ready) {
            this.buyAudioguide();
          }
        })  
      }
    ).catch(
      (error) => {
        this.loader.dismiss();
        this.utils.handlerError(error);
      }
    )
  }

  addUser(){
    this.newUser.isAuthor = false;
    this.newUser.email = this.email;
    this.firebaseService.addUser(this.newUser);
    this.newUser = new User(); // reset user
  }

  buyAudioguide() {
        // TODO sistema de compra 
        console.log(`buyAudioguide in register-user ` + this.audioguide )
        this.sqliteService.addAudioguide(this.audioguide)
        .then(() =>{
          this.navParams = null;
          this.navCtrl.push('MyguidesPage')
        })  
  }

  cancel() {
    this.navCtrl.pop();
  }
}
