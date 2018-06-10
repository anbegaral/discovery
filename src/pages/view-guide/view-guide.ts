import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import 'firebase/storage';
import { Audioguide, POI, Location } from '../../model/models';
import { AudioguideService } from '../../providers/audioguide.service';
import { PlayGuideProvider } from '../../providers/play-guide/play-guide';

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
  isPlaying: any = false; 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage,
    private sqliteService: SqliteServiceProvider,
    private audioguideService: AudioguideService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private playService: PlayGuideProvider ) {
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
  
  listen(filename){
    this.playService.listenStreaming(filename)
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }

  pause() { 
    this.playService.pause()
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }

  stop() {
    this.playService.stop()
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }

  getAccount(idAudioguide: string) {
    let audioguide = this.audioguides.filter(audioguide => idAudioguide === audioguide.key)[0]
    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log('isLoggedin' + isLoggedin)
      if(isLoggedin) {
        // TODO sistema de compra
        this.sqliteService.getDatabaseState().subscribe(ready => {
          if(ready) {
            this.buyAudioguide(audioguide);
          }
        })        
      } else {
        this.storage.get('useremail').then(
          (data) => {
            console.log(`no logged in ` +data)
            if(data === null || data === 'undefined') {
              console.log(`no registered in ` +data)
              this.navCtrl.push('RegisterUserPage', {idGuide: idAudioguide, audioguide: audioguide, pois: audioguide.audioguidePois});
            } else{
              console.log(`registered in ` +data)
              this.navCtrl.push('LoginPage', {idGuide: idAudioguide, audioguide: audioguide, pois: audioguide.audioguidePois});
            }
          } 
        );
      }
    });
  }

  buyAudioguide(audioguide: Audioguide) {
    // Checks if the audioguide is already downloaded in sqlite
    this.sqliteService.getAudioguide(audioguide.key).then(data => {
      console.log(`buy ` +data)
      if(data === null) {  // it does not exist
        this.sqliteService.addAudioguide(audioguide.key, audioguide, audioguide.audioguidePois)
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
