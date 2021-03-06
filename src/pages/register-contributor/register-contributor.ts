import { UserService } from './../../providers/user.service';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AngularFireAuth } from "angularfire2/auth";
import { Storage } from '@ionic/storage';
import { User } from '../../model/models';
import { Utils } from '../../providers/utils/utils';

@IonicPage({
  name: 'RegisterContributorPage'
})
@Component({
  selector: 'page-register-contributor',
  templateUrl: 'register-contributor.html',
})
export class RegisterContributorPage implements OnInit {

  registerContributorForm: FormGroup;

  loader: any;
  user: User = new User();
  isLoggedin: boolean = false;
  idAuthor: string = null;


  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public fireAuth: AngularFireAuth, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, 
    private storage: Storage, 
    private userService: UserService,
    private utils: Utils ) {

    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log('isLoggedin' +isLoggedin)
      this.isLoggedin = isLoggedin;
      
      if(this.isLoggedin) {
        this.storage.get('useremail').then(useremail => {
          console.log('useremail' +useremail)
          this.registerContributorForm.value.email = useremail;

          this.userService.getUsers(useremail).subscribe(users => {
            this.user = users[0];
            this.idAuthor = this.user.key;
            console.log(this.idAuthor)
          })
        })
      }
    })    
  }

  ngOnInit() {
    this.registerContributorForm = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      address: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      city: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      postcode: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      country: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      bankaccount: ['', Validators.compose([Validators.maxLength(30)])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required])],
    });
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
    this.fireAuth.auth.createUserWithEmailAndPassword(this.registerContributorForm.value.email, this.registerContributorForm.value.password)
    .then(() => {    
        this.user.isAuthor = true;
        this.user.firstName = this.registerContributorForm.value.firstName;
        this.user.lastName = this.registerContributorForm.value.lastName;
        this.user.address = this.registerContributorForm.value.address;
        this.user.city = this.registerContributorForm.value.city;
        this.user.postcode = this.registerContributorForm.value.postcode;
        this.user.country = this.registerContributorForm.value.country;
        this.user.bankaccount = this.registerContributorForm.value.bankaccount;
        this.user.email = this.registerContributorForm.value.email;
        this.userService.addUser(this.user).then(user => {
          console.log(user);
          this.storage.set('isAuthor', true);
          this.storage.set('idAuthor', user.$key);
          this.storage.set('useremail', this.registerContributorForm.value.email);
          this.storage.set('isLoggedin', true);
        })

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
        this.utils.handlerError(error);
      }
    )
    
    this.user = new User();
  }

  // The user already exists but is not a contributor
  updateUser() {
    this.user.isAuthor = true;
    this.user.firstName = this.registerContributorForm.value.firstName;
    this.user.lastName = this.registerContributorForm.value.lastName;
    this.user.address = this.registerContributorForm.value.address;
    this.user.city = this.registerContributorForm.value.city;
    this.user.postcode = this.registerContributorForm.value.postcode;
    this.user.country = this.registerContributorForm.value.country;
    this.user.bankaccount = this.registerContributorForm.value.bankaccount;

    this.userService.updateUser(this.user).then((updatedUser) => {
      console.log(updatedUser)
      this.storage.set('isAuthor', true);
      this.storage.set('idAuthor', this.user.key);
      this.storage.set('useremail', this.registerContributorForm.value.email)
      this.storage.set('isLoggedin', true);
    });
    
    this.loader.dismiss();
    this.navCtrl.push('MyguidesPage', {
      myguidesSegment: 'created'
    })
    this.user = new User();
  }
}
