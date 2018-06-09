import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import 'firebase/storage';
import { Audioguide, POI, Location } from '../../model/models';
import { AudioguideService } from '../../providers/audioguide.service';

@IonicPage()
@Component({
  selector: 'page-view-guide',
  templateUrl: 'view-guide.html',
})
export class ViewGuidePage {

  location: Location = null;
  locationName: string;
  audioguides: Audioguide[] = [];
  pois: POI[] = [];
  loader: any;
  showPois = false;
  changeArrow = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage,
    // private sqliteService: SqliteServiceProvider,
    private audioguideService: AudioguideService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController ) {
    this.location = this.navParams.data;
    this.locationName = this.location.locationName;
    this.getAudioguides();
  }

  getAudioguides() {
    let idLocation = this.location.key;
    
    this.loader = this.loadingCtrl.create({
      content: `Loading audioguides...`
    });
    this.loader.present();
    this.audioguideService.getAudioguideListByLocation(idLocation).subscribe(audioguides => {
      this.audioguides = audioguides
      this.audioguides.forEach(audioguide => {
        this.audioguideService.getPoiList(audioguide.key).subscribe(pois => {
          audioguide.audioguidePois = pois;
        });
      })
    });
    this.loader.dismiss();
  }

  viewPois() {
    this.showPois = !this.showPois;
    this.changeArrow = !this.changeArrow;
  }
  
  // getAccount() {
  //   this.storage.get('isLoggedin').then(isLoggedin => {
  //     console.log('isLoggedin' + isLoggedin)
  //     if(isLoggedin) {
  //       // TODO sistema de compra
  //       this.sqliteService.getDatabaseState().subscribe(ready => {
  //         if(ready) {
  //           this.buyAudioguide();
  //         }
  //       })        
  //     } else {
  //       this.storage.get('useremail').then(
  //         (data) => {
  //           console.log(`no logged in ` +data)
  //           if(data === null || data === 'undefined') {
  //             console.log(`no registered in ` +data)
  //             this.navCtrl.push('RegisterUserPage', {idGuide: this.audioguide.$key, audioguide: this.audioguide, pois: this.pois});
  //           } else{
  //             console.log(`registered in ` +data)
  //             this.navCtrl.push('LoginPage', {idGuide: this.audioguide.$key, audioguide: this.audioguide, pois: this.pois});
  //           }
  //         } 
  //       );
  //     }
  //   });
  // }

  // buyAudioguide() {
  //   // Checks if the audioguide is already downloaded in sqlite
  //   this.sqliteService.getAudioguide(this.audioguide.$key).then(data => {
  //     console.log(`buy ` +data)
  //     if(data === null) {  // it does not exist
  //       this.sqliteService.addAudioguide(this.audioguide.$key, this.audioguide, this.pois)
  //       .then(() => {
  //             this.navCtrl.push('MyguidesPage');
  //       })
  //       .catch(error => console.log('error addAudioguide ' + error.toString()));
  //     } else{
  //       this.alertCtrl.create({
  //         title: 'Error',
  //         message: 'The audioguide already exists.',
  //         buttons: [        
  //           {
  //             text: 'Close',
  //             handler: () => {
  //               this.navCtrl.push('MyguidesPage')
  //             }
  //           }
  //         ]
  //       }).present();
  //     }
  //   }).catch (error => console.log("Error buyAudioguide:  " + error.message.toString()));
  // }
}
