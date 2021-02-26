import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertCtrler:AlertController
  ) { }

  async backAlert(buttons){
    const alert = await this.alertCtrler.create({
      header:'Are you sure?',
      message:'<p>You\'ll lose any unsaved changes.</p>',
      buttons,
      cssClass: 'alert-back-popup'
    });

    await alert.present();
  }
  // New equipment is added successfully!
  async goToRequestListAlert(buttons,msg){
    const alert = await this.alertCtrler.create({
      header:'Success!',
      message:'<p>' + msg + '</p>',
      buttons,
      cssClass: 'alert-back-popup'
    });

    await alert.present();
  }

  async addEqFailedAlert(buttons,error){
    const alert = await this.alertCtrler.create({
      header:'Failed!',
      message:'<p>Please contact with Administrator!</p><p>' + error + '</p>',
      buttons,
      cssClass: 'alert-back-popup'
    });

    await alert.present();
  }
  
}
