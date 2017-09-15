import { TranslateService } from '@ngx-translate/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage({
  name:'GuidesPage'
})
@Component({
  selector: 'page-view-guide',
  templateUrl: 'view-guide.html',
})
export class ViewGuidePage implements OnInit {

  title: string;
  text: string;
  password:string;
  cancel: string;
  facebook: string;

  audioguide: FirebaseObjectObservable<any[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private afDB: AngularFireDatabase, private alertCtrl: AlertController, private translate: TranslateService) {
    translate.get('login.signin').subscribe(value => this.title = value);
    translate.get('login.signText').subscribe(value => this.text = value);
    translate.get('login.password').subscribe(value => this.password = value);
    translate.get('login.cancel').subscribe(value => this.cancel = value);
    translate.get('login.facebook').subscribe(value => this.facebook = value);
  }

  ngOnInit() {
    this.getGuide();
  }

  getGuide(){    
    let idGuide = this.navParams.data;
    this.afDB.object(`audioguides/${idGuide}`).subscribe(data => this.audioguide = data);
  }

  getAccount() {
    let prompt = this.alertCtrl.create({
      title: this.title,
      message: this.text,
      inputs: [
        {
          name: 'email',
          placeholder: 'Email',
          type: 'email'
        },
        {
          name: 'password',
          placeholder: this.password,
          type: 'password'
        },
      ],
      buttons: [
        {
          text: this.cancel,
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ok',
          handler: data => {
            
          }
        },
        {
          text: this.facebook,
          handler: data =>{
            this.signInWithFacebook()
          }
        }
      ]
    });
    prompt.present();
  }

  signInWithFacebook(){

  }
}
