import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import 'firebase/storage';
import { Audioguide, POI } from '../../model/models';
import { PlayGuideProvider } from '../../providers/play-guide/play-guide';

@IonicPage()
@Component({
  selector: 'page-view-guide',
  templateUrl: 'view-guide.html',
})
export class ViewGuidePage {

  audioguides: Audioguide[] = [];
  audioguide: Audioguide;
  pois: POI[] = [];
  loader: any;
  isPlaying: any = false; 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private sqliteService: SqliteServiceProvider,
    private alertCtrl: AlertController,
    private playService: PlayGuideProvider ) {
    this.audioguide = this.navParams.data;
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

  getAccount() {
    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log('isLoggedin ' + isLoggedin);
      if(isLoggedin) {
        // TODO sistema de compra
        this.sqliteService.getDatabaseState().subscribe(ready => {
          if(ready) {
            this.buyAudioguide(this.audioguide);
          }
        })        
      } else {
        this.storage.get('useremail').then(
          (data) => {
            console.log(`no logged in ` +data);
            if(data === null || data === 'undefined') {
              console.log(`no registered in ` +data);
              this.navCtrl.push('RegisterUserPage', this.audioguide);
            } else{
              console.log(`registered in ` +data)
              this.navCtrl.push('LoginPage', this.audioguide);
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
        this.sqliteService.addAudioguide(audioguide)
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
