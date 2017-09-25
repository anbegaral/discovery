import { Subject } from 'rxjs/Subject';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Media, MediaObject } from '@ionic-native/media';
import { SqliteServiceProvider } from "../../providers/sqlite-service/sqlite-service";
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@IonicPage()
@Component({
  selector: 'page-view-guide',
  templateUrl: 'view-guide.html',
})
export class ViewGuidePage {
  fileUrl: string;
  storageRef: any;
  isPlaying: boolean = false;
  position: number = 0;

  audioguide: FirebaseObjectObservable<any[]>;
  pois: FirebaseListObservable<any[]>;
  poisToDB: any[] = [];
  idGuide: string;
  file: MediaObject;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage, 
    private afDB: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private sqliteService: SqliteServiceProvider,
    private media: Media,
    private firebaseStorage: FirebaseApp,
    private loadingCtrl: LoadingController,
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
    
    console.log(this.pois)
    // this.pois = new Subject().asObservable();
    this.pois.subscribe(pois  => {
      // this.poisToDB.push(pois)
      pois.forEach(poi => {
        console.log(poi)
        this.poisToDB.push(poi)
      })
      
    })
  }

  getAccount() {
    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log(isLoggedin)
      if(isLoggedin) {
        // TODO sistema de compra
        this.buyAudioguide();
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
    // this.sqliteService.addAudioguide(this.idGuide, encodeURI(JSON.stringify(this.audioguide)), encodeURI(JSON.stringify(this.poisToDB))).then(
    // Checks if the audioguide is already downloaded in sqlite
    this.sqliteService.getAudioguide(this.idGuide).then(data => {
      console.log(`buy ` +data)
      if(data === null) {  // it does not exist
        this.sqliteService.addAudioguide(this.idGuide, this.audioguide, this.poisToDB)
        .then(() => {
          this.navCtrl.push('MyguidesPage')
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
                return null;
              }
            }
          ]
        }).present();
      }
    }).catch (error => console.log("Error buyAudioguide:  " + error.message.toString()));
  }

  listen(fileName) { 
    let loading = this.loadingCtrl.create({
      content: 'Loading the audioguide from the server...'
    });
    loading.present(); 
    
    this.storageRef = this.firebaseStorage.storage().ref().child(fileName);
    this.storageRef.getDownloadURL().then(url => {
      this.fileUrl = url;
      this.file = this.media.create(this.fileUrl);

      this.file.onStatusUpdate.subscribe(status => {

        if(this.media.MEDIA_RUNNING === status){
          this.file.seekTo(this.position*1000);
        }

        if(this.media.MEDIA_STOPPED === status){        
          this.isPlaying = false;
        }
      }); // fires when file status changes
      
      this.file.onSuccess.subscribe(() => {
        console.log('Action is successful')
      });
      
      this.file.onError.subscribe(error => console.log('Error!', error));
      loading.dismiss();      
      this.file.play();
      this.isPlaying = true;      
    }).catch(err =>
    {
      loading.dismiss();      
      this.handlerError(err);
    });
  }

  pause() {
    this.file.pause();
    this.file.getCurrentPosition().then(position => this.position = position)
    this.isPlaying = false;
    
  }

  stop() {
    this.file.stop();
    this.file.release();
    this.position = 0;
    this.isPlaying = false;
  }

  handlerError(error) {
    this.alertCtrl.create({
      title: 'Error',
      message: error.message,
      buttons: [        
        {
          text: 'Close',
          handler: data => console.log(error) 
        }
      ]
    }).present();
  }
  

  ngOnDestroy() {
    console.log(`ngDestroy`)
    this.idGuide = null;
    this.audioguide = null;
    this.poisToDB = null;    
  }
}
