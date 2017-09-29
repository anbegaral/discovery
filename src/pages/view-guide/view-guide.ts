import { PlayGuideProvider } from './../../providers/play-guide/play-guide';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import 'firebase/storage';

@IonicPage()
@Component({
  selector: 'page-view-guide',
  templateUrl: 'view-guide.html',
})
export class ViewGuidePage {

  audioguide: FirebaseObjectObservable<any[]>;
  pois: FirebaseListObservable<any[]>;
  poisToDB: any[] = [];
  idGuide: string;
  isPlaying: any = false; 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage, 
    private afDB: AngularFireDatabase,
    private sqliteService: SqliteServiceProvider,
    private playService: PlayGuideProvider,
    private alertCtrl: AlertController) {
      this.getGuide();
  }

  getGuide(){    
    this.idGuide = this.navParams.data;
    this.afDB.object(`audioguides/${this.idGuide}`).subscribe(data => this.audioguide = data);
    this.pois = this.afDB.list('poi', {
      // preserveSnapshot:true,
      query: {
        orderByChild: 'idAudioguide',
        equalTo: this.idGuide
      }
    })
    
    this.pois.subscribe(pois  => {
      pois.forEach(poi => {
        console.log(poi)
        poi.idFirebase = poi.$key;
        this.poisToDB.push(poi)
      })      
    })
    console.log(this.poisToDB)
  }

  listen(filename){
    this.playService.listenStreaming(filename)
    this.playService.isPlaying.subscribe(isPlaying => {
      console.log(`data `+isPlaying)
      this.isPlaying = isPlaying
    })
  }

  pause() {
    
    this.playService.pause()
    this.playService.isPlaying.subscribe(isPlaying => {
      console.log(`data `+isPlaying)
      this.isPlaying = isPlaying
    })
  }

  stop() {
    this.playService.stop()
    this.playService.isPlaying.subscribe(isPlaying => {
      console.log(`data `+isPlaying)
      this.isPlaying = isPlaying
    })
  }

  getAccount() {
    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log(isLoggedin)
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
              this.navCtrl.push('RegisterUserPage', {idGuide: this.idGuide, audioguide: this.audioguide, pois: this.poisToDB});
            } else{
              console.log(`registered in ` +data)
              this.navCtrl.push('LoginPage', {idGuide: this.idGuide, audioguide: this.audioguide, pois: this.poisToDB});
            }
          } 
        );
      }
    });
  }

  buyAudioguide() {
    console.log(`buyAudioguide in view-guide`)
  
    // Checks if the audioguide is already downloaded in sqlite
    this.sqliteService.getAudioguide(this.idGuide).then(data => {
      console.log(`buy ` +data)
      if(data === null) {  // it does not exist
        this.sqliteService.addAudioguide(this.idGuide, this.audioguide, this.poisToDB)
        .then(() => {
          this.sqliteService.findAll();
          this.navCtrl.pop();
          this.navCtrl.push('MyguidesPage');
        })
        .catch (error => console.log("Error addAudioguide:  " + error.message.toString()));
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

  ngOnDestroy() {
    console.log(`ngDestroy`)
    this.playService.isPlaying.unsubscribe();
    this.idGuide = null;
    this.audioguide = null;
    this.poisToDB = null;    
  }
}
