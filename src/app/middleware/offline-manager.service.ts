import { Injectable } from '@angular/core';
import { DbTransaction, SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Plugins } from '@capacitor/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { sql } from './utility/seed';
import { HttpClient } from '@angular/common/http';
import { APISqlite, API_Sqlite, buildingAPIS, clientAPIS } from './utility/offlinedataurls';
import { UrlConfig } from '../modules/core/classes/config';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { LanguageService } from '../common/service/language.service';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ConnectionStatus, NetworkService } from './network.service';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
//import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx'

const { App, BackgroundTask } = Plugins;
//const sessionid = '?sessionid={AB2E286B-30DB-4627-B99D-09F8BA5100A6}';
@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  private async checkSQLite() {
    try {
      await this.sqlite.echoTest();
      console.log('sql lite supported');
      return true;
    } catch (e) {
      console.log('sql lite not supported');
      return false;
    }
  }

  db: SQLiteObject;
  private async getDb() {
    if (await this.checkSQLite())
      await this.sqlite.create({ name: 'realsuite', location: 'default' }).then(db => this.db = db);
    else return false;
  }

  constructor(private sqlite: SQLite,
    private sqlPorter: SQLitePorter,
    public alertController: AlertController,
    public toastController: ToastController,
    private platform: Platform,
    private http: HttpClient,
    private networkService: NetworkService,
    private spinnerDialog: SpinnerDialog,
    private languageService: LanguageService) {
  }

  Initialize() {
    this.createTables();
    this.networkService.onNetworkChange().subscribe(status => {
      if (status === ConnectionStatus.Online) {
        //this.syncQueue();
      }
      else {
        if (this.downloadProgress.getValue() > 0 && this.downloadProgress.getValue() < 1) {
          this.downloadFail();
        }
      }
    })
  }

  private async createTables() {
    //const db = await this.getDb();
    if (!this.db) await this.getDb();
    this.sqlPorter.importSqlToDb(this.db, sql).then().catch(err => console.log("Error creating tables"));
  }

  baseUrl = UrlConfig.baseUrlRealCondition_Original + 'api/offline/';
  private async APIGET(item: APISqlite, db: SQLiteObject, count?: number): Promise<any> {
    this.nextPage = 0;
    const url = this.baseUrl + item.api //+ sessionid;
    var st = performance.now();
    return new Promise((resolve, reject) => {
      this.http.get(url)
        .pipe((finalize(() => {
          this.downloadProgress.next(count / API_Sqlite.length)
          resolve(true);
        })))
        .subscribe((response: any[]) => {
          this.doInsertions({ data: response, table: item.table, columns: item.columns, api: url, upsert: item.upsert }, db);
        }, error => reject(error));
    });
  }

  nextPage: number = 0;
  isPostRequest = false;
  private async APIPOST(item: APISqlite, body: any, db: SQLiteObject, count?: number) {
    var url = this.baseUrl + item.api //+ sessionid;
    return new Promise((reslove, reject) => {
      this.http.post(url, body)
        .pipe((finalize(async () => {
          if (this.nextPage === 0) {
            db.executeSql('Delete from ' + item.table + ' where SyncedOn <> ?', [moment().format('MMM DD, YYYY')]);

            if (count == API_Sqlite.length) {
              await this.downloadComplete();
            }
            this.downloadProgress.next(count / API_Sqlite.length)
          }
          else {
            this.APIPOST(item, { PageNumber: this.nextPage, DataHash: [] }, db, count);
          }
          reslove(true);
        })))
        .subscribe((response: any) => {
          this.nextPage = +response.NextResourcePage;
          this.isPostRequest = true;
          const hashesToDelete = response.HashesToDelete;
          this.doInsertions({ data: response.Items, api: url, table: item.table, columns: item.columns, upsert: item.upsert, hashesToDelete: hashesToDelete }, db);
        }, error => reject(error));
    });
  }

  awaiting = 'AWAITING';
  synced = 'SYNCED';
  failed = 'FAILED';
  async downloadComplete() {
    const completeMessage = await this.languageService.translate('DOWNLOAD', 'COMPLETED');
    this.spinnerDialog.hide();
    this.presentToastWithButton(completeMessage);
  }

  async saveRequest(url: string, type: string, data: string) {
    //const db = await this.getDb();
    if (!this.db) await this.getDb();
    if (this.db) {
      this.db.transaction((tx) => {
        tx.executeSql('INSERT INTO QUEUE (URL, TYPE, DATA, SYNCSTATUS, CREATEDON, NOTIFIED) VALUES {?,?,?,?,?,?}', [url, type, data, this.awaiting, moment().format('ll'), 0], (tx, result) => { })
      })
        .then(() => console.log(`Request ${url} added successfully to queue`))
        .catch(e => console.log(e));
    }
  }

  async executeQuery(query: string, params: any[]): Promise<any> {
    //const db = await this.getDb();
    if (!this.db) await this.getDb();
    if (this.db) {
      return this.db.executeSql(query, params);
    }
    else return false;
  }

  doInsertions(args: InsertionParameters, db: SQLiteObject) {
    db.transaction(tx => {
      if (!!args) {
        if (!args.data || 0 === args.data.length) {
          db.executeSql(`update DATASYNC set LASTSYNCEDON = ?, PageNumber = ? where TABLENAME = ?`, [moment().format('ll'), 0, args.table]);
          return;
        };
      }
      else return;

      if (!this.isPostRequest) tx.executeSql(`delete from ${args.table}`);

      let data = args.data;
      console.log('NEXTPAGE ' + this.nextPage);
      if (args.columns.length * data.length > 999) {
        let i: number, j: number, temparray: any[], chunk = Math.ceil(999 / args.columns.length);
        for (i = 0, j = data.length; i < j; i += chunk) {
          temparray = data.slice(i, i + chunk);
          this.execute(temparray, args, tx);
        }
      } else this.execute(data, args, tx);

    })
      .then(() => console.log('ENDTIME: ' + new Date().toLocaleTimeString()))
      .catch(err => {
        db.executeSql('INSERT INTO SYNCLOG (TABLENAME, ERRORMSG, CREATEDON) VALUES(?,?,?)', [args.table, err.message, moment().format('ll')])
        console.log('ERROR inserting data')
      });
  }

  execute(_data: any, args: InsertionParameters, tx: DbTransaction) {
    console.log('STARTTIME: ' + new Date().toLocaleTimeString());
    let params: string = '';
    let values = [];
    for (let index = 0; index < _data.length; index++) {
      if (index != 0) params += ',';
      const element: any = _data[index];
      params += '(';
      let itemCount = 0;
      for (let k of args.columns) {
        if (itemCount !== 0) params += ',';
        var key = k.replace(/"/g, '');
        var value = element[key];
        var isObject = typeof value === 'object' && value !== null;
        if (!isObject) values.push(element[key]);
        else values.push(JSON.stringify(value));
        params += '?';
        itemCount++;
      }
      params += ')';
    }
    tx.executeSql('Insert or Replace into ' + args.table + ' (' + args.columns.join(',') + ') Values ' + params + args.upsert, values);
    if (!!args.hashesToDelete && args.hashesToDelete.length > 0) {
      let _param = '';
      let _value = [];
      let count = 0;
      for (let _hash of args.hashesToDelete) {
        if (count != 0) _param += ',';
        _param += '?';
        _value.push(_hash);
        count++;
      }
      tx.executeSql('DELETE from ' + args.table + ' where Hash in (' + _param + ')', _value);
    }

    if (this.nextPage === 0) {
      tx.executeSql('DELETE FROM DATASYNC WHERE TABLENAME = ?', [args.table]);
      tx.executeSql('Insert into DataSync (TABLENAME, COLUMNLIST, APIURL, TYPE, UPSERT, PageNumber, LASTSYNCEDON) Values (?,?,?,?,?,?,?)', [args.table,
      args.columns.join(','),
      args.api,
      !this.isPostRequest ? 'GET' : 'POST',
      args.upsert,
        1, moment().format('ll')
      ]);
    }
    else {
      tx.executeSql('Update DATASYNC SET PageNumber = ? where TABLENAME = ?', [this.nextPage, args.table]);
    }
  }


  queueQuery = 'UPDATE QUEUE SET SYNCSTATUS = ?, CREATEDON = ? where ID = ?';
  private async syncQueue() {
    BackgroundTask.beforeExit(async taskId => {
      if (!this.db) await this.getDb();
      this.db.executeSql('Select * from QUEUE where SYNCSTATUS = ?', [this.awaiting]).then(async (data) => {
        let promises = [];
        if (data.rows.length > 0) {
          for (let index = 0; index < data.rows.length; index++) {
            const element = data.rows.item(index);
            let _promise = new Promise((resolve, reject) => {
              this.http.post(element.URL, element.data)
                .pipe((finalize(() => {
                  this.db.executeSql(this.queueQuery, [this.synced, moment().format('ll'), element.ID]);
                  resolve(true);
                })))
                .subscribe((error => {
                  this.db.executeSql(this.queueQuery, [this.failed, moment().format('ll'), element.ID]);
                  reject(error);
                }))
            });
            promises.push(_promise);
          }
        } else {
          const _ = await Promise.all(promises);
          //this.sendNotification(this.db);
          //send email.
        }
      });
      BackgroundTask.finish(taskId);
    });
  }

  async sendNotification(db: SQLiteObject) {

    db.executeSql('Select * from QUEUE where NOTIFIED = 0 and SYNCSTATUS <> ? and CREATEDON = ?', [this.awaiting, moment().format('ll')]).then(async (data) => {
      if (data.rows && data.rows.length > 0) {
        let synccount = 0, failcount = 0;
        for (let i = 0; i < data.rows.lenght; i++) {
          let item = data.rows.item(i);
          if (item.SYNCSTATUS === this.synced) synccount++;
          else if (item.SYNCSTATUS === this.failed) failcount++;
          await db.executeSql('Update QUEUE SET NOTIFIED = 1 where ID = ?', [item.ID]);
        }

        let message = '';
        if (synccount > 0) message += '<li>' + synccount + await this.languageService.translate('PROMPT', 'QUEUESYNCED') + '</li>';
        if (failcount > 0) message += '<li>' + failcount + await this.languageService.translate('PROMPT', 'QUEUESYNCEDFAIL') + '</li>';

        if (message !== '') {
          const buttonText = await this.languageService.translate('PROMPT', 'OkButton');
          const alert = await this.alertController.create({
            // cssClass: 'my-custom-class',
            //header: 'Alert',
            //subHeader: 'Subtitle',
            message: `<ul>${message}</ul>`,
            buttons: [buttonText]
          });
          await alert.present();
        }
      }
    })
  }

  downloadProgress = new BehaviorSubject<number>(0);
  isManualDownload = false;
  async downloadDataOnUserAction(clientId = -1, buildingId = '-1') {
    const startedMessage = await this.downloadStart();

    this.presentToast(startedMessage);
    //this.totalItemsToDownload = API_Sqlite.length;
    let count = 0; // 1 * 11 
    if (!this.db) await this.getDb();
    for (let item of clientAPIS) {
      count++;
      try {
        let _item = Object.assign([], item);
        await this.download(_item, count, clientId, buildingId, true);
      } catch (err) {
        throw err;
      }
    }
    for (let item of buildingAPIS) {
      count++;
      try {
        let _item = Object.assign([], item);
        await this.download(_item, count, clientId, buildingId);
      } catch (err) {
        throw err;
      }
    }
  }

  async downloadStart() {
    this.spinnerDialog.show();
    this.isManualDownload = true;
    //this.spinnerDialog.show();
    const startedMessage = await this.languageService.translate('DOWNLOAD', 'STARTED');
    return startedMessage;
  }

  private download(item: APISqlite, count: number, clientId: number, buildingId: string, isClientApi = false) {
    return new Promise<boolean>(async (resolve, reject) => {
      if (item.type === 'POST') {
        try {
          await this.APIPOST(item, { PageNumber: 1, DataHash: [], ClientId: clientId, BuildingId: buildingId }, this.db, count);
          resolve(true);
        }
        catch (err) {
          reject(false);
          throw err;
        }
      }
      else {
        try {
          const api = item.api
          item.api += (!isClientApi ? buildingId : clientId);
          await this.APIGET(item, this.db, count);
          resolve(true);
        }
        catch (err) {
          reject(false);
          throw err;
        }
      }
    })
  }

  async downloadFail() {
    //this.downloadProgress.next(0);
    this.spinnerDialog.hide();
    const failMessage = await this.languageService.translate('DOWNLOAD', 'FAIL');
    this.presentToastWithButton(failMessage);
    this.downloadProgress.next(1);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  async presentToastWithButton(message: string, handler: Function = null) {
    if (handler === null) handler = () => {
      console.log('Cancel clicked');
    }
    const buttonTxt = await this.languageService.translate('PROMPT', 'OkButton');
    const toast = await this.toastController.create({
      message: message,
      buttons: [{
        text: buttonTxt,
        role: 'cancel',
        handler: () => handler()
      }
      ]
    });
    toast.present();
  }

  LOG(url: string, type: string, error: string, data: any) {
    this.db.executeSql('INSERT INTO HTTPLOG (URL, TYPE, DATA, ERROR, OCCUREDON) VALUES (?, ?, ?, ?, ?)', [url, type, data, error, moment().format('ll')])
  }
}

export class InsertionParameters {
  data: any[] = [];
  table: string;
  columns: string[] = [];
  api: string;
  upsert: string;
  hashesToDelete?: string[];
}
