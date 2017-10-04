import { AlertController } from 'ionic-angular';

export class Utils {
        constructor(public alertCtrl: AlertController) {}

        handlerError(error) {
                this.alertCtrl.create({
                        title: 'Error',
                        message: error.message,
                        buttons: [
                                {
                                        text: 'Close',
                                        handler: data => console.log(data)
                                }
                        ]
                }).present();
        }
}