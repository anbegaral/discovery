import { FilesServiceProvider } from './../../providers/files-service/files-service';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { Component, ViewChild, Input } from '@angular/core';
import { POI, Upload } from '../../model/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Component({
  selector: 'create-poi',
  templateUrl: 'create-poi.html'
})
export class CreatePoiComponent {
  currentUpload: any;
  poi: POI = new POI();
  @Input('idAudioguide') idAudioguide: string;
  @ViewChild('title') title: string;
  @ViewChild('lat') lat: string;
  @ViewChild('lon') lon: string;
  @ViewChild('isPreview') isPreview: boolean;
  @ViewChild('image') image: File;

  createPoiForm: FormGroup;

  constructor(private sqliteService: SqliteServiceProvider,     
    public formBuilder: FormBuilder,
    private filesService: FilesServiceProvider,
    private navCtrl: NavController) {
      this.createPoiForm = formBuilder.group({
        title: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        lat: ['', Validators.compose([Validators.maxLength(250), Validators.pattern('^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)'), Validators.required])],
        lon: ['', Validators.compose([Validators.maxLength(250), Validators.pattern('^-?((([1]?[0-7][0-9]|[1-9]?[0-9])\.{1}\d{1,6}$)|[1]?[1-8][0]\.{1}0{1,6}$)'), Validators.required])],
        isPreview: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        image: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      });
  }

  detectFile(event) {
    this.image = event.target.files[0];
  }

  uploadFile() {
    this.currentUpload = new Upload(this.image);
    return this.filesService.uploadFile('images', this.currentUpload).then(url => {
      console.log(url)
      return this.poi.imageUrl = url
    }).catch(error => {
      console.log('Error ' + error)
      return error
    })
  }

  createPoi() {
    this.poi.idAudioguide = this.idAudioguide;
    this.poi.title = this.title;
    this.poi.lat = this.lat;
    this.poi.lon = this.lon;
    this.poi.isPreview = this.isPreview;    
    this.poi.image = 'images/'+this.image.name;
    this.poi.imageUrl = this.image.name;
    this.sqliteService.createPoi(this.poi).then(() => {
      console.log(new Upload(this.image))
      this.filesService.downloadFile(this.image.name, this.image.name)
        .then(() => {
          alert('Poi created succesfully');
          this.navCtrl.push('MyguidesPage', {
            myguidesSegment: 'created'
          })
        }).catch(error => console.log(error))
      })
  }
}
