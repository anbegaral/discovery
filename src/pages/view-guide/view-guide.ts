import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
  isLoggedin: false;

  audioguide: FirebaseObjectObservable<any[]>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private afDB: AngularFireDatabase) {
  }

  ngOnInit() {
    this.getGuide();
  }

  getGuide(){    
    let idGuide = this.navParams.data;
    this.afDB.object(`audioguides/${idGuide}`).subscribe(data => this.audioguide = data);
  }

  getAccount() {
    if(this.isLoggedin) {
      this.navCtrl.push('MyGuidesPage');
    } else {
      this.storage.get('useremail').then(
        (data) => {
          if(data === null || data === 'undefined') {
            this.navCtrl.push('RegisterUserPage');
          } else{
            this.navCtrl.push('LoginPage');
          }
        } 
      );
    }
  }
}
