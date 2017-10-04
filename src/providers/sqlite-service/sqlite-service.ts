import { FirebaseApp } from 'angularfire2';
import { FilesServiceProvider } from './../files-service/files-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SqliteServiceProvider {
  fileUrl: string;
  loading: any;

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean>;
  storageImageRef: any;
  storageAudioRef: any;

  constructor(private platform: Platform, private sqlite: SQLite, private fileService: FilesServiceProvider, private firebaseStorage: FirebaseApp,
    private loadingCtrl: LoadingController) {

    this.dbReady = new BehaviorSubject(false);
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'discovery.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.createAudioguidesTable();
        this.createPoisTable();
        this.dbReady.next(true);
      })
      .catch(error => console.log(`creating database ` +JSON.stringify(error)))

    });
  }

  createAudioguidesTable() {
    this.database.executeSql(`create table if not exists audioguides(id integer primary key autoincrement, idFirebase CHAR(20), idAuthor CHAR(20), idLocation CHAR(20), 
      title CHAR(255), description CHAR(255), duration INTEGER, pois INTEGER, lang CHAR(20), price FLOAT, image CHAR(255))`, {}).then(
      () =>  this.dbReady.next(true)
    ).catch(error => console.log(`creating table ` +error.message.toString()))
  }

  createPoisTable() {
    this.database.executeSql(`create table if not exists pois(id integer primary key autoincrement, idFirebase CHAR(20), idAudioguide char(20),
      title CHAR(20), lat CHAR(20), lon CHAR(20), image BLOB, file BLOB, duration integer)`, {}).then(
      () =>  this.dbReady.next(true)
    ).catch(error => console.log(`creating table ` + error.message.toString()))
  }

  addAudioguide(idGuide, audioguide, pois) {
    return this.database.executeSql(`INSERT INTO audioguides (idFirebase, idAuthor, idLocation, title, description, duration, pois, lang, price, image) 
          VALUES (?,?,?,?,?,?,?,?,?,?)`, [idGuide, audioguide.idAuthor, audioguide.idLocation, audioguide.title,audioguide.description, audioguide.duration, 
          pois.length, audioguide.lang, audioguide.price, audioguide.image])
      .then(result => {
        if(result.insertId){
           this.loading = this.loadingCtrl.create({
              content: 'Downloading files from the server...'
            });
            this.loading.present();
          return this.getAudioguideFiles(audioguide).then(() => {
            console.log(`audioguide.id `+ result.insertId);
            return this.addPois(pois)
         })
        }  
      })
      .catch(error => console.log("Error addAudioguide:  " + error.message.toString()))   
  }

  addPois(pois) {
    console.log(pois)
    pois.forEach(element => {
      return this.database.executeSql(`INSERT INTO pois (idFirebase, idAudioguide, title, lat, lon, image, file, duration) VALUES (?,?,?,?,?,?,?,?)`,
        [element.idFirebase, element.idAudioguide, element.title, element.lat, element.lon, element.image, element.file, element.duration])
        .then(resultPois => {
            return this.getPoiFiles(element).then(() => {
              console.log('pois id' +resultPois.insertId)
              this.loading.dismiss();
            })
          }).catch((error) => console.log("Error addingPois " + error.message.toString()))
    });
  }

  getAudioguideFiles(audioguide) {
    this.storageImageRef = this.firebaseStorage.storage().ref().child(audioguide.image);
    return this.storageImageRef.getDownloadURL().then(url => {
      this.fileUrl = url;
      return this.fileService.downloadFile(this.fileUrl, audioguide.image).then(() => {
        console.log('image downloaded');  
      });
    })
  }

  getPoiFiles(poi) {
    let audioUrl: string = '';
    let imageUrl: string = ''; 

    this.storageImageRef = this.firebaseStorage.storage().ref().child(poi.image);
    this.storageAudioRef = this.firebaseStorage.storage().ref().child(poi.file);

    return this.storageAudioRef.getDownloadURL().then(url => {
      console.log(`audio ` +url)
      audioUrl = url;
      return this.fileService.downloadFile(audioUrl, poi.file).then(() => {
        console.log('audio downloaded') 
        return this.storageImageRef.getDownloadURL().then(url => {
          console.log(`image poi ` +url)
          imageUrl = url;
          return this.fileService.downloadFile(imageUrl, poi.image).then(() => {
            console.log('image poi downloaded')              
          });
        });             
      });
    }); 
  }

  getAudioguide(idGuide:string){
      return this.database.executeSql(`SELECT * FROM audioguides WHERE idFirebase = '${idGuide}'`, [])
      .then((data)=>{
        if(data.rows.length === 1){
          return true;
        }
        return null;
      }).catch(error => console.log('getAudioguide ' +error.message.toString()))
  }

  findAll() {
    return this.database.executeSql(`SELECT * FROM audioguides`, []).then(
      (data) => {   
        let audioguidesList = [];         
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
              audioguidesList.push(data.rows.item(i));  
            }
            console.log(`this.audioguidesList.length ` + audioguidesList.length)
            return audioguidesList;
        }
    }, (error) => {
        console.log("Error findAll: " + error.message.toString());
        return [];
    });
  }

  findAllPois() {
    return this.database.executeSql(`SELECT * FROM pois`, []).then(
      (data) => {
        let poisList = [];
          console.log(data.rows.length)       
        if(data.rows.length > 0) {            
          for(var i = 0; i < data.rows.length; i++) {
            console.log(data.rows.item(i))
            poisList.push(data.rows.item(i))  
          }
          return poisList;
        }
    }, (error) => {
        console.log("Error findPois: " + error.message.toString());
    });
  }

  findPoisByAudioguide(idAudioguide: string) {
    console.log('findPois '+idAudioguide)
    return this.database.executeSql(`SELECT * FROM pois WHERE idAudioguide = '${idAudioguide}'`, []).then(
      (data) => {
        let poisList = [];     
        if(data.rows.length > 0) {            
          for(var i = 0; i < data.rows.length; i++) {
            console.log(data.rows.item(i))
            poisList.push(data.rows.item(i))  
          }
          return poisList;
        }
    }, (error) => {
        console.log("Error findPois: " + error.message.toString());
    });
  }

  deleteAudioguide(idAudioguide:string){
    this.findPoisByAudioguide(idAudioguide).then((poiList) => {
      let poisList:any = [];
      poisList = poiList;
      poisList.forEach(element => {
        console.log(element)
        this.fileService.deleteFile(element.file)
        this.fileService.deleteFile(element.image)
      });      
    })
      return this.database.executeSql(`DELETE FROM audioguides WHERE idFirebase = '${idAudioguide}'`, []).then(() => {
        return this.database.executeSql(`DELETE FROM pois WHERE idAudioguide = '${idAudioguide}'`, []).then(

        )
          .catch(
            (error) => console.log("Error deletePois: " + error.message.toString()))
      })
      .catch(
        (error) => console.log("Error deleteAudioguides: " + error.message.toString()))
  }

  findMyAudioguides() {

  }
  
  getDatabaseState() {
    return this.dbReady.asObservable();
  }
}