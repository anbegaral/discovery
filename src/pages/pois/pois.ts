import { PlayGuideProvider } from './../../providers/play-guide/play-guide';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-pois',
  templateUrl: 'pois.html',
})
export class PoisPage {

  poisList: any;
  isPlaying: any = false;
  storageDirectory: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private sqliteService: SqliteServiceProvider, 
    private platform: Platform,
    private playService: PlayGuideProvider,
    private file: File) {

      this.platform.ready().then(() => {
        this.sqliteService.getDatabaseState().subscribe(ready => {
          if(ready) {
            this.getPoisList();
          }
        })
          if(this.platform.is('ios')) {
            this.storageDirectory = this.file.dataDirectory;
          } else if(this.platform.is('android')) {
            this.storageDirectory = this.file.externalDataDirectory;
          }
      })
  }

  getPoisList() {
    console.log(this.navParams.data)
    this.sqliteService.findPoisByAudioguide(this.navParams.data).then(
      (data) => {
        console.log(data);
        this.poisList = data
    }).catch(
      (error) => console.log(`Error listPois ` + error.message.toString())
    );
  }

  listen(filename) { 
    this.playService.listen(filename);
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }

  pause() {
    this.playService.pause();
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }

  stop() {
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }

  ngDestroy() {
    // this.playService.isPlaying.unsubscribe();    
  }

}
