import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AngularFireAuth } from "angularfire2/auth";
import { Storage } from '@ionic/storage';
import { User } from '../../model/models';

@IonicPage({
  name: 'RegisterContributorPage'
})
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
  user: User = new User();
  isLoggedin: boolean = false;
  idAuthor: string = null;

  EMAIL_PATTERN: string = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
  PASSWORD_PATTERN: string = "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public fireAuth: AngularFireAuth, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, 
    private storage: Storage, 
    private firebaseService: FirebaseServiceProvider  ) {
    this.registerContributorForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      address: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      city: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      postcode: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      country: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      bankaccount: ['', Validators.compose([Validators.maxLength(30)])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.pattern(this.EMAIL_PATTERN), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(20), Validators.required])],
    });

    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log('isLoggedin' +isLoggedin)
      this.isLoggedin = isLoggedin;
      
      if(this.isLoggedin) {
        this.storage.get('useremail').then(useremail => {
          console.log('useremail' +useremail)
          this.email = useremail;

          this.firebaseService.getUsers({
            orderByChild: 'email',
            equalTo: useremail
          }).subscribe(idAuthor => {
            console.log(idAuthor)
            console.log(idAuthor[0].$key)
            this.idAuthor = idAuthor[0].$key
          })
        })
      }
    })    
  }

  registerContributor(){
    this.loader = this.loadingCtrl.create({
      content: "Creating your account..."
    });
    this.loader.present();
    
    if(this.idAuthor && this.isLoggedin) {
      this.updateUser();
    } else{
      this.addContributor();
    }
    
  }

  //The user is totally new
  addContributor(){
    this.fireAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then(() => {    
        this.user.isAuthor = true;
        this.user.firstName = this.firstName;
        this.user.lastName = this.lastName;
        this.user.address = this.address;
        this.user.city = this.city;
        this.user.postcode = this.postcode;
        this.user.country = this.country;
        this.user.bankaccount = this.bankaccount;
        this.user.email = this.email;
        this.firebaseService.addUser(this.user).then((idAuthor) => {
          console.log(idAuthor)
          
          this.storage.set('isAuthor', true);
          this.storage.set('idAuthor', idAuthor);
          this.storage.set('useremail', this.email)
          this.storage.set('isLoggedin', true);
        });

        this.loader.dismiss();
        // this.navCtrl.pop();
        this.navCtrl.push('MyguidesPage', {
            myguidesSegment: 'created'
        })
      }
    ).catch(
      (error) => {
        this.loader.dismiss();
        console.log(error)
        // this.utils.handlerError(error);
      }
    )
    
    this.user = new User();
  }

  // The user already exists but is not a contributor
  updateUser() {
    this.user.isAuthor = true;
    this.user.firstName = this.firstName;
    this.user.lastName = this.lastName;
    this.user.address = this.address;
    this.user.city = this.city;
    this.user.postcode = this.postcode;
    this.user.country = this.country;
    this.user.bankaccount = this.bankaccount;

    this.firebaseService.updateUser(this.idAuthor, this.user).then((idAuthor) => {
      this.storage.set('isAuthor', true);
      this.storage.set('idAuthor', idAuthor);
      this.storage.set('useremail', this.email)
      this.storage.set('isLoggedin', true);
    });
    
    this.loader.dismiss();
    this.navCtrl.push('MyguidesPage', {
      myguidesSegment: 'created'
    })
    this.user = new User();
  }
}
