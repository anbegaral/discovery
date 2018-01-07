import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import 'firebase/storage';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Audioguide, POI } from '../../model/models';

@IonicPage()
@Component({
  selector: 'page-view-guide',
  templateUrl: 'view-guide.html',
})
export class ViewGuidePage {

  audioguide: Audioguide = null;
  pois: POI[] = [];
  idGuide: string;
  loader: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage,
    private sqliteService: SqliteServiceProvider,
    private firebaseService: FirebaseServiceProvider,
    private alertCtrl: AlertController ) {
      this.getGuide();
  }

  getGuide(){    
    this.idGuide = this.navParams.data;
    this.audioguide = this.firebaseService.getAudioguide(this.idGuide);
    
    this.firebaseService.getPoisList({
      orderByChild: 'idAudioguide',
      equalTo: this.idGuide
    }).subscribe(pois => {
      console.log(pois)
      this.pois = pois;
    })
  }

  getAccount() {
    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log('isLoggedin' + isLoggedin)
      if(isLoggedin) {
        // TODO sistema de compra
        this.sqliteService.getDatabaseState().subscribe(ready => {
          if(ready) {
            this.buyAudioguide();
          }
        })        
      } else {
        this.storage.get('useremail').then(
          (data) => {
            console.log(`no logged in ` +data)
            if(data === null || data === 'undefined') {
              console.log(`no registered in ` +data)
              this.navCtrl.push('RegisterUserPage', {idGuide: this.idGuide, audioguide: this.audioguide, pois: this.pois});
            } else{
              console.log(`registered in ` +data)
              this.navCtrl.push('LoginPage', {idGuide: this.idGuide, audioguide: this.audioguide, pois: this.pois});
            }
          } 
        );
      }
    });
  }

  buyAudioguide() {
    // Checks if the audioguide is already downloaded in sqlite
    this.sqliteService.getAudioguide(this.idGuide).then(data => {
      console.log(`buy ` +data)
      if(data === null) {  // it does not exist
        this.sqliteService.addAudioguide(this.idGuide, this.audioguide, this.pois)
        .then(() => {
              this.navCtrl.push('MyguidesPage');
        })
        .catch(error => console.log('error addAudioguide ' + error.toString()));
      } else{
        this.alertCtrl.create({
          title: 'Error',
          message: 'The audioguide already exists.',
          buttons: [        
            {
              text: 'Close',
              handler: () => {
                this.navCtrl.push('MyguidesPage')
              }
            }
          ]
        }).present();
      }
    }).catch (error => console.log("Error buyAudioguide:  " + error.message.toString()));
  }
}
