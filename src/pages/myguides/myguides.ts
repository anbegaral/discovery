import { PlayGuideProvider } from './../../providers/play-guide/play-guide';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Audioguide } from './../../model/models';
import { Storage } from '@ionic/storage';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilesServiceProvider } from '../../providers/files-service/files-service';


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
  myguidesSegment: string;
  isAuthor: boolean;
  isLoggedin: boolean;
  idAuthor: string = null;
  poisList: any;
  storageDirectory: any;  
  newAudioguide: boolean = false;
  

  constructor(public navCtrl: NavController, 
      public navParams: NavParams,
      public platform: Platform,
      private file: File,
      private alertCtrl: AlertController,
      public actionSheetCtrl: ActionSheetController,
      private sqliteService: SqliteServiceProvider,
      private storage: Storage, 
      private firebaseService: FirebaseServiceProvider,
      private playService: PlayGuideProvider ) {

    this.storage.get('isLoggedin').then(isLoggedin => {
      console.log('isLoggedin' +isLoggedin)
      this.isLoggedin = isLoggedin;
      
      if(this.isLoggedin) {
        this.storage.get('isAuthor').then(isAuthor => {
          console.log('isAuthor' +isAuthor)
          this.isAuthor = isAuthor;

          if(this.isAuthor) {
            this.storage.get('idAuthor').then(idAuthor => {
              console.log('idAuthor' +idAuthor)
              this.idAuthor = idAuthor;
            })
          }
        })
      }

    })

    this.platform.ready().then(() => {
      if(this.platform.is('ios')) {
        this.storageDirectory = this.file.dataDirectory;
      } else if(this.platform.is('android')) {
        this.storageDirectory = this.file.externalDataDirectory;
      }
      console.log(this.navCtrl.getPrevious())
      // if(this.navCtrl.getPrevious() === 'RegisterContributorPage') {
        this.navCtrl.parent.select(1);
        this.myguidesSegment = 'purchased';
      // }

        
    });
  }

  listMyPurchasedAudioguides() {
    this.sqliteService.findPurchasedAudioguides(this.idAuthor).then(data => {
      this.purchasedAudioguidesList = data
    })
    .catch(error => console.log('error listAudioguides ' + error.message.toString()));
  }

  listMyCreatedAudioguides() {
    this.sqliteService.findMyAudioguides(this.idAuthor).then(data => {
      console.log(data)
      this.createdAudioguidesList = data
    })
    .catch(error => console.log('error listMyAudioguides ' + error.message.toString()));
  }

  openPois(idAudioguide) {
    this.navCtrl.push('PoisPage', idAudioguide);
  }

  // addSong(){
  //   let prompt = this.alertCtrl.create({
  //     title: 'Song Name',
  //     message: "Enter a name for this new song you're so keen on adding",
  //     inputs: [
  //       {
  //         name: 'En',
  //         placeholder: 'Country name'
  //       },
  //       {
  //         name: 'Es',
  //         placeholder: 'Country name'
  //       },{
  //         name: 'Fr',
  //         placeholder: 'Country name'
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           this.songs.push({
  //             en: "United States",
  //             es: "Estados Unidos",
  //             fr: "Etats Unis"
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }

  // showOptions(songId, songTitle) {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'What do you want to do?',
  //     buttons: [
  //       {
  //         text: 'Delete Song',
  //         role: 'destructive',
  //         handler: () => {
  //           this.removeSong(songId);
  //         }
  //       },{
  //         text: 'Update title',
  //         handler: () => {
  //           this.updateSong(songId, songTitle);
  //         }
  //       },{
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }

  // removeSong(songId: string){
  //   this.songs.remove(songId);
  // }

  // updateSong(songId, songTitle){
  //   let prompt = this.alertCtrl.create({
  //     title: 'Song Name',
  //     message: "Update the name for this song",
  //     inputs: [
  //       {
  //         name: 'title',
  //         placeholder: 'Title',
  //         value: songTitle
  //       },
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Save',
  //         handler: data => {
  //           this.songs.update(songId, {
  //             title: data.title
  //           });
  //         }
  //       }
  //     ]
  //   });
  //   prompt.present();
  // }

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
    this.newAudioguide = !this.newAudioguide;
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

 
