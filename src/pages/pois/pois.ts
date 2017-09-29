import { PlayGuideProvider } from './../../providers/play-guide/play-guide';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { Component, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pois',
  templateUrl: 'pois.html',
})
export class PoisPage {

  poisList: any;
  isPlaying: any = false;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private sqliteService: SqliteServiceProvider, 
    private platform: Platform,
    private playService: PlayGuideProvider) {
      this.platform.ready().then(() => {
        this.sqliteService.getDatabaseState().subscribe(ready => {
          if(ready) {
            this.getPoisList();
          }
        })
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
    console.log(`pause`)
    this.playService.pause();
    this.playService.isPlaying.subscribe(isPlaying => {
      console.log(`data `+isPlaying)
      this.isPlaying = isPlaying;
    })
  }

  stop() {
    this.playService.stop();
    this.playService.isPlaying.subscribe(isPlaying => {
      console.log(`data `+isPlaying)
      this.isPlaying = isPlaying;
    })
  }

  ngDestroy() {
    this.playService.isPlaying.unsubscribe();    
  }

}
