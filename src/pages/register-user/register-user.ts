import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms/forms";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private afDB: AngularFireDatabase, 
    public fireAuth: AngularFireAuth, 
    private storage: Storage, 
    public formBuilder: FormBuilder) {
      this.registerForm = formBuilder.group({
        email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/'), Validators.required])],
        password: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('(?=^.{8,20}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'), Validators.required])],
      });

      this.users = this.afDB.list('users');
  }

  emailValidator(control: FormControl): {[s: string]: boolean} {
    if (!(control.value.toLowerCase().match('/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/'))) {
      return {invalidEmail: true};
    }
  }

  passwordValidator(control: FormControl): {[s: string]: boolean} {
    if(!(control.value.match('(?=^.{8,20}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$'))) {
      return {invalidPassword: true};
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterUserPage');
  }

  registerUser(){
    this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password).then(
      (data) => {
        this.storage.set('useremail', data.email);
        this.addUser();        
      }
    ).catch(
      (error) => console.log(error)
    )
  }

  addUser(){
    this.users.push({
      isAuthor: false,
      email: this.email,
      password: this.password
    })
  }
}
