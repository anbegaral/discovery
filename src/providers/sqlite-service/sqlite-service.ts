import { FirebaseApp } from 'angularfire2';
import { FilesServiceProvider } from './../files-service/files-service';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SqliteServiceProvider {
  fileUrl: string;

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);
  storageRef: any;

  audioguidesList: any[] = []; 
  poisList: any[] = [];

  constructor(private platform: Platform, private sqlite: SQLite, private fileService: FilesServiceProvider, private firebaseStorage: FirebaseApp) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'discovery.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.createAudioguidesTable();
        this.createPoisTable();
      })
      .catch(error => console.log(`creating database ` +JSON.stringify(error)))

    });
  }
  
  isReady(){
    return new Promise((resolve, reject) =>{
      //if dbReady is true, resolve
      if(this.dbReady.getValue()){
        resolve();
      }
      //otherwise, wait to resolve until dbReady returns true
      else{
        this.dbReady.subscribe((ready)=>{
          if(ready){ 
            resolve(); 
          }
        });
      }  
    })
  }

  createAudioguidesTable() {
    this.database.executeSql(`create table if not exists audioguides(id integer primary key autoincrement, idFirebase CHAR(20), idAuthor CHAR(20), idLocation CHAR(20), 
      title CHAR(255), description CHAR(255), duration INTEGER, pois INTEGER, lang CHAR(20), price FLOAT, image CHAR(255))`, {}).then(
      () =>  this.dbReady.next(true)
    ).catch(error => console.log(`creating table ` +error.message.toString()))
  }

  createPoisTable() {
    this.database.executeSql(`create table if not exists pois(id integer primary key autoincrement, idFirebase CHAR(20), idAudioguide char(20),
      title CHAR(20), lat CHAR(20), lon CHAR(20), isPreview INTEGER, image BLOB, file BLOB)`, {}).then(
      () =>  this.dbReady.next(true)
    ).catch(error => console.log(`creating table ` + error.message.toString()))
  }

  downloadAudioguideImage(url, imageName) {
    return this.fileService.downloadImageFile(url, imageName);
  }

  insertPoiImage() {

  }

  insertPoiFile() {

  }

  addAudioguide(idGuide, audioguide, pois) {
    console.log(audioguide.title)
    // console.log(pois[0].title)
    console.log(pois.length)
    
    
    return this.isReady()
      .then(()=>{
        return this.database.executeSql(`INSERT INTO audioguides (idFirebase, idAuthor, idLocation, title, description, duration, pois, lang, price, image) 
            VALUES ('${idGuide}', '${audioguide.idAuthor}', '${audioguide.idLocation}','${audioguide.title}','${audioguide.description}', '${audioguide.duration}', 
            '${pois.length}', '${audioguide.lang}', '${audioguide.price}', '${audioguide.image}')`, [])
        .then(result => {
          if(result.insertId){
            console.log(result.insertId)
            this.storageRef = this.firebaseStorage.storage().ref().child(audioguide.image);
            this.storageRef.getDownloadURL().then(url => {
              this.fileUrl = url;
              this.downloadAudioguideImage(this.fileUrl, audioguide.image);
            })
          }
    //         return this.database.executeSql(`INSERT INTO pois (idAudioguide, pois) VALUES ('${idGuide}', '${pois}')`, []).then(
    //           (resultPois) => {
    //             console.log(resultPois.insertId)
    //           }).catch((error) => console.log("Error addingPois " + error.message.toString()))
    //       }
      
        }).catch(error => console.log("Error addAudioguide:  " + error.message.toString()))    
      });
  }

  getAudioguide(idGuide:string){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * FROM audioguides WHERE idFirebase = '${idGuide}'`, [])
      .then((data)=>{
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      }).catch(error => console.log('getAudioguide ' +error.message.toString()))
    })
  }

  findAll() {
    return this.isReady()
      .then(()=>{
        return this.database.executeSql(`SELECT * FROM audioguides`, []).then(
          (data) => {       
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                  this.audioguidesList.push(data.rows.item(i));  
                }
                return this.audioguidesList;
            }
        }, (error) => {
            console.log("Error findAll: " + error.message.toString());
        });
      });
  }

  findPois(idAudioguide: string) {
    console.log('findPois '+idAudioguide)
    
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * FROM pois WHERE idAudioguide = '${idAudioguide}'`, []).then(
        (data) => {       
          if(data.rows.length > 0) {
              for(var i = 0; i < data.rows.length; i++) {
                console.log(data.rows.item(i))
                this.poisList.push(data.rows.item(i))  
              }
              return this.poisList;
          }
      }, (error) => {
          console.log("Error findPois: " + error.message.toString());
      });
    });
  }

  deleteAudioguide(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM audioguides WHERE id = ${id}`, []).then(() => {
        return this.database.executeSql(`DELETE FROM pois WHERE idAudioguide = ${id}`, []).catch(
          (error) => 
          console.log("Error deletePois: " + JSON.stringify(error))
        )
      })
      .catch(
        (error) => 
          console.log("Error deleteAudioguides: " + JSON.stringify(error))
      )
    });
  }
}
