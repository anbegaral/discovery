import { UserService } from './../../providers/user.service';
import { Audioguide } from './../../model/models';
import { Utils } from './../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import { User } from '../../model/models';

@IonicPage()
@Component({
  selector: 'page-register-user',
  templateUrl: 'register-user.html',
})
export class RegisterUserPage implements OnInit{

  registerForm: FormGroup;
  users: User[];
  newUser = new User();
  audioguide: Audioguide;
  
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public fireAuth: AngularFireAuth, 
    private storage: Storage, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, 
    private sqliteService: SqliteServiceProvider,
    private userService: UserService,
    private utils: Utils,
  ) {
     this.audioguide = this.navParams.data;
  }

  ngOnInit() {
      this.registerForm = this.formBuilder.group({
        email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        password: ['', Validators.compose([Validators.minLength(8), Validators.required])],
      });
  }

  registerUser(){
    this.loader = this.loadingCtrl.create({
      content: "Creating your account..."
    });
    this.loader.present();

    this.fireAuth.auth.createUserWithEmailAndPassword(this.registerForm.value.email, this.registerForm.value.password)
    .then(
      () => {
        this.storage.set('useremail', this.registerForm.value.email);
        this.storage.set('isLoggedin', true); 
        this.storage.set('isAuthor', false);      
        this.addUser();
        this.loader.dismiss(); 
        this.storage.get('useremail').then((email) => console.log(email)).catch(error => this.utils.handlerError(error))
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
    this.newUser.email = this.registerForm.value.email;
    this.userService.addUser(this.newUser);
    this.newUser = new User(); // reset user
  }

  buyAudioguide() {
        // TODO sistema de compra 
        console.log(`buyAudioguide in register-user ` + this.audioguide )
        this.sqliteService.addAudioguide(this.audioguide)
        .then(() =>{
          this.navParams = null;
          this.navCtrl.push('MyguidesPage')
        }).catch(error => console.log(error));
  }

  cancel() {
    this.navCtrl.pop();
  }
}
