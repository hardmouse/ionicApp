import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, 
  CameraPhoto, CameraSource } from '@capacitor/core';
import { Photo } from '../common/type/common.model';  
import { SubscribableService } from '../services/subscribable.service'
const { Camera, Filesystem, Storage } = Plugins;
import {decode} from "base64-arraybuffer";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";
  private platform: Platform;
  constructor(platform: Platform,public subs:SubscribableService) {
    this.platform = platform;
   }
  
  
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      source: CameraSource.Camera, 
      quality: 90 
    })
    const savedImageFile = await this.savePicture(capturedPhoto);
    //const b64 = capturedPhoto.base64String;
    this.photos.unshift(savedImageFile);
     Storage.set({
       key: this.PHOTO_STORAGE,
       value: JSON.stringify(this.photos)
     });
     this.subs.photoAdded.next(true);
  }
  

  private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);
    const blob = new Blob([new Uint8Array(decode(base64Data))], {
      type: `image/${cameraPhoto.format}`,
    });
    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: 'data:image/jpeg;base64,' + base64Data,
      directory: FilesystemDirectory.Data
    });
  
    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        base64Data:'data:image/jpeg;base64,' +base64Data,
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        base64Data:base64Data,
        filepath: fileName,
        webviewPath: cameraPhoto.webPath
      };
    }
  }

  public async deletePicture(photo: Photo, position: number) {
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);
  
    // Update photos array cache by overwriting the existing photo array
     Storage.set({
       key: this.PHOTO_STORAGE,
       value: JSON.stringify(this.photos)
     });
  
    // delete photo file from filesystem
    const filename = photo.filepath
                        .substr(photo.filepath.lastIndexOf('/') + 1);
  
    await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data
    });
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }
  
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    //this.photos = JSON.parse(photoList.value) || [];
    this.photos = [];
    if (!this.platform.is('hybrid')) {
      // Display the photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
            path: photo.filepath,
            directory: FilesystemDirectory.Data
        });
  
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  // public async cleanSaved(){
  //   this.photos = [];
  //   Storage.set({
  //     key: this.PHOTO_STORAGE,
  //     value: JSON.stringify(this.photos)
  //   });
  // }
  

}
