import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SqliteServiceProvider {

  private database: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  audioguidesList: any[]; 

  constructor(private platform: Platform, private sqlite: SQLite) {
    this.platform.ready().then(()=>{
      this.sqlite.create({
        name: 'discovery.db',
        location: 'default'
      })
      .then((db:SQLiteObject)=>{
        this.database = db;

        this.createAudioguideTable().then(()=>{  
          this.dbReady.next(true);
        });
      })
      .catch(error => alert(error.message))

    });
  }

  createAudioguideTable(){
    return this.database.executeSql(`create table if not exists audioguides(
        id integer primary key,
        jsonFile BLOB
    ))`, {});            
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

  addAudioguide(audioguide) {
    return this.isReady()
      .then(()=>{
        return this.database.executeSql(`INSERT INTO audioguides (jsonFile) VALUES ('${audioguide}')`, []).then((result) => {
          alert("Success");
          if(result.insertId){
            return this.getList(result.insertId);
          }
        }, (e) => {
            alert("Error :  " + JSON.stringify(e.message));
        });
      });
  }

  getList(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`SELECT * FROM list WHERE id = ${id}`, [])
      .then((data)=>{
        if(data.rows.length){
          return data.rows.item(0);
        }
        return null;
      })
    })
  }

  findAll() {
    return this.isReady()
      .then(()=>{
        return this.database.executeSql(`SELECT * FROM audioguides`, []).then((data) => {
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    this.audioguidesList.push(JSON.parse(data.rows.item(i)));
                }
                return this.audioguidesList;
            }
        }, (error) => {
            alert("Error: " + JSON.stringify(error));
        });
      });
  }

  deleteList(id:number){
    return this.isReady()
    .then(()=>{
      return this.database.executeSql(`DELETE FROM list WHERE id = ${id}`, [])
    })
  }
}
