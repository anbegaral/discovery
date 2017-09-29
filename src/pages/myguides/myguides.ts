import { Storage } from '@ionic/storage';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, ActionSheetController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-myguides',
  templateUrl: 'myguides.html',
})
export class MyguidesPage {
  // songs: FirebaseListObservable<any[]>;
  audioguidesList: any;
  guides: string;
  isAuthor: boolean;
  poisList: any;
  storageDirectory: any;  

  constructor(public navCtrl: NavController, 
      public navParams: NavParams,
      public platform: Platform,
      private file: File,
      private alertCtrl: AlertController,
      public actionSheetCtrl: ActionSheetController,
      private sqliteService: SqliteServiceProvider,
      private storage: Storage ) {
    // this.songs = this.afDB.list('countries');
    this.platform.ready().then(() => {
      if(this.platform.is('ios')) {
        this.storageDirectory = this.file.dataDirectory;
      } else if(this.platform.is('android')) {
        this.storageDirectory = this.file.externalDataDirectory;
      }
      
      this.sqliteService.getDatabaseState().subscribe(ready => {
        if(ready) {
          this.listAudioguides();
        }
      })
      this.navCtrl.parent.select(1);
      this.guides = 'purchased';
      this.storage.get('isAuthor').then(isAuthor => this.isAuthor = isAuthor)
    });
  }

  listAudioguides() {
    console.log(`llamado`)
    this.sqliteService.findAll().then(data => this.audioguidesList = data)
    .catch(error => console.log('error listAudioguides ' + error.message.toString()));
  }

  openPois(idAudioguide) {
    console.log(idAudioguide)
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

  delete(id: number) {
    console.log(`delete `+id)
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
            console.log(`myguides 173 ` + data)
            this.sqliteService.getDatabaseState().subscribe(ready => {
              if(ready) {
                this.sqliteService.deleteAudioguide(id).then(() => {
                  this.listAudioguides();
                })
              }
            })
          }
        }
      ]
    }).present();
  }

 }
