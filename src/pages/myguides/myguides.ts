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
  poiList: POI[] = [];
  myguidesSegment: string;
  isAuthor: boolean;
  isLoggedin: boolean;
  idAuthor: string = '';
  storageDirectory: any;  
  newAudioguide: boolean = false;
  newPoi: boolean = false;  
  expanded: boolean = false;


  constructor(public navCtrl: NavController, 
      public navParams: NavParams,
      public platform: Platform,
      private file: File,
      private alertCtrl: AlertController,
      public actionSheetCtrl: ActionSheetController,
      private sqliteService: SqliteServiceProvider,
      private storage: Storage, 
      private playService: PlayGuideProvider,
      private modalCtrl: ModalController ) {}
  
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
      this.purchasedAudioguidesList = data
    })
    .catch(error => console.log('error listMyPurchasedAudioguides ' + error.message.toString()));
  }

  listMyCreatedAudioguides() {
    this.sqliteService.findMyAudioguides(this.idAuthor).then(data => {
      this.createdAudioguidesList = data
      this.newAudioguide = false;
    })
    .catch(error => console.log('error listMyCreatedAudioguides ' + error.message.toString()));
  }

  getPoisByAudioguide(idAudioguide: string) {
    this.sqliteService.findPoisByAudioguide(idAudioguide).then(data => {
      this.poiList = data;
    }).then(()=> this.expanded = true)
    .catch(error => console.log('error getPoisByAudioguide ' + error.message.toString()));
  }

  delete(id: string) {
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
 }

 
