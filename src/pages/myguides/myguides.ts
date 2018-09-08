import { Utils } from './../../providers/utils/utils';
import { CreateAudioguideComponent } from './../../components/create-audioguide/create-audioguide';
import { PlayGuideProvider } from './../../providers/play-guide/play-guide';
import { Audioguide, POI } from './../../model/models';
import { Storage } from '@ionic/storage';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { CreatePoiComponent } from '../../components/create-poi/create-poi';

@IonicPage({
  name: 'MyguidesPage'
})
@Component({
  selector: 'page-myguides',
  templateUrl: 'myguides.html',
})
export class MyguidesPage {
  purchasedAudioguidesList: Audioguide[] = [];
  createdAudioguidesList: Audioguide[] = [];
  poiListComplete: POI[] = [];
  poiList: POI[] = [];
  locationList = new Set();
  audioguidesByLocation: Audioguide[] = [];
  myguidesSegment: string;
  isAuthor: boolean;
  isLoggedin: boolean;
  idAuthor: string = '';
  storageDirectory: any;  
  newAudioguide: boolean = false;
  newPoi: boolean = false;
  hidden: boolean = true;
  
  isPlaying: any = false;

  constructor(public navCtrl: NavController, 
      public navParams: NavParams,
      public platform: Platform,
      private file: File,
      private alertCtrl: AlertController,
      public actionSheetCtrl: ActionSheetController,
      private sqliteService: SqliteServiceProvider,
      private storage: Storage, 
      private playService: PlayGuideProvider,
      private modalCtrl: ModalController,
      private utils: Utils ) {}
  
  ionViewWillEnter() {
    console.log('ionviewwillenter')
    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log('isLoggedin ' +isLoggedin)
      this.isLoggedin = isLoggedin;
      
      if(this.isLoggedin) {
        this.storage.get('isAuthor').then(isAuthor => {
          console.log('isAuthor ' +isAuthor)
          this.isAuthor = isAuthor;

          if(this.isAuthor) {
            this.storage.get('idAuthor').then(idAuthor => {
              console.log('idAuthor ' +idAuthor)
              this.idAuthor = idAuthor;
            })
          }
        })
      }

    }).then(() => {
      this.platform.ready().then(() => {
        this.platform.ready().then(() => {
          if(this.platform.is('ios')) {
            this.storageDirectory = this.file.dataDirectory;
          } else if(this.platform.is('android')) {
            this.storageDirectory = this.file.dataDirectory;
          } else {
            // exit otherwise, but you could add further types here e.g. Windows
            return false;
          }
        });
        this.listMyPurchasedAudioguides();        
        this.navCtrl.parent.select(1);
        this.myguidesSegment = 'purchased';
      }).catch(error => console.log(error));
    }).catch(error => console.log(error));   
  }


  listMyPurchasedAudioguides() {
    console.log(this.idAuthor)
    this.sqliteService.findPurchasedAudioguides(this.idAuthor).then(data => {
        console.log(data)
        if(data !== null && data !== undefined) {
            this.purchasedAudioguidesList = data;
            if(this.purchasedAudioguidesList.length > 0){
                this.purchasedAudioguidesList.forEach(audioguide => this.locationList.add(audioguide.location));
            }
        }
    }).catch(error => {
        this.utils.handlerError(error);
        console.log('error listMyPurchasedAudioguides ' + error)
      });
    this.sqliteService.findPois().then(pois => {
        if(pois !== null && pois !== undefined){
            this.poiList = pois;
            this.poiListComplete = this.poiList;
        }
    }).catch(error => this.utils.handlerError(error));
    
    // this.audioguidesByLocation = this.purchasedAudioguidesList;
  }

    initializeAudioguideList() {
        this.audioguidesByLocation = this.purchasedAudioguidesList;
        this.poiList = this.poiListComplete;
    }

  listAudioguidesByLocation(location: string) {
    this.initializeAudioguideList();
    this.audioguidesByLocation = this.audioguidesByLocation.filter(audioguide => audioguide.location === location);
    Array.from(document.querySelectorAll('.openable' + location)).forEach(element => {
        element.classList.toggle('hidden');
    });
  }

  listMyCreatedAudioguides() {
    this.sqliteService.findMyAudioguides(this.idAuthor).then(data => {
      this.createdAudioguidesList = data
      this.newAudioguide = false;
    })
    .catch(error => {
      this.utils.handlerError(error);
      console.log('error listMyCreatedAudioguides ' + error.message.toString())
    });
  }

  toggleExpanded(id: number) {
    this.initializeAudioguideList();
    this.poiList = this.poiListComplete.filter(poi => poi.idAudioguide === id);
    Array.from(document.querySelectorAll('.openable' + id)).forEach(element => {
            element.classList.toggle('hidden');
    });
  }

  delete(id: number) {
    this.alertCtrl.create({
      title: 'Delete audioguide',
      message: 'Are you sure you want to delete the selected audioguide?',
      buttons: [        
        {
          text: 'Cancel',
          handler: data => console.log('Delete canceled ' +data) 
        },
        {
          text: 'Delete',
          handler: data => {
            this.sqliteService.getDatabaseState().subscribe(ready => {
              if(ready) {
                this.sqliteService.deleteAudioguide(id).then(() => {
                  this.listMyPurchasedAudioguides();
                  this.listMyCreatedAudioguides();
                })
              }
            })
          }
        }
      ]
    }).present();
  }

  registerContributor() {
    this.navCtrl.push('RegisterContributorPage')
  }

  login() {
    this.navCtrl.push('LoginPage')
  }

  showNewAudioguide() {
    let modal = this.modalCtrl.create(CreateAudioguideComponent);
    modal.present();
  }

  showNewPoi() {
    let modal = this.modalCtrl.create(CreatePoiComponent);
    modal.present();
  }
  
  startRecordPoi(idAudioguide: string) {
    this.playService.startRecord('malaga1.mp3');
  }

  stopRecordPoi(idAudioguide: string) {
    this.playService.stopRecord();
  }

  playRecordPoi(idAudioguide: string) {
    this.playService.listen('malaga1.mp3');
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
 }
 

 
