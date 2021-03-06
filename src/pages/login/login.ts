import { UserService } from './../../providers/user.service';
import { User, Audioguide } from './../../model/models';
import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import { Utils } from '../../providers/utils/utils';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  user: User = new User();
  audioguide: Audioguide;
  isLoggedin: boolean;
  isAuthor: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fireAuth: AngularFireAuth, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private storage: Storage, 
    private sqliteService: SqliteServiceProvider,
    private userService: UserService,
    private utils: Utils,
  ) {
      this.audioguide = this.navParams.data;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required])],
    });
  }

  doLogin() {

    let loader = this.loadingCtrl.create({
      content: "Logging in your account..."
    });
    loader.present();

    this.fireAuth.auth.signInWithEmailAndPassword(this.loginForm.value.email, this.loginForm.value.password).then(
      (data) => {   
        console.log(data)     
        this.storage.set('isLoggedin', true);
        this.isLoggedin = true;

        this.userService.getUsers(this.loginForm.value.email).subscribe(user => {
          console.log(user)
          this.user = user[0];
          this.isAuthor = this.user.isAuthor;
          this.storage.set('isAuthor', this.user.isAuthor);
            if(this.user.isAuthor) {
              console.log(this.user.key)            
              this.storage.set('idAuthor', this.user.key);
            }        
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
        this.utils.handlerError(error);
      }
    )
  }

  buyAudioguide() {
    // TODO sistema de compra
    this.sqliteService.getDatabaseState().subscribe(ready => {
      if(ready) {
        this.sqliteService.addAudioguide(this.audioguide).catch(error => this.utils.handlerError(error));
      }
    }) 
  }
}
