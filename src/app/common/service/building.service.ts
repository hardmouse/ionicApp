import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { OfflineManagerService } from 'src/app/middleware/offline-manager.service';
import { APISqlite, buildingAPIS, clientAPIS } from 'src/app/middleware/utility/offlinedataurls';
import { UrlConfig } from 'src/app/modules/core/classes/config';
import { BuildingRecord } from '../type/common.model';
import { DataAccessService } from './data-access.service';
import { LanguageService } from './language.service';

const baseUrl = UrlConfig.baseUrlRealCondition_Original + 'api/offline/';
@Injectable({
    providedIn: 'root'
})
export class BuildingService extends DataAccessService {

    constructor(http: HttpClient, 
        // private offlineManager: OfflineManagerService, 
        private languageService: LanguageService) {
        super(http);
    }

    getBuildingsForSelectedArea(latitude: number, longitude: number) {
        const url = `${baseUrl}buildings/${latitude}/${longitude}`; //+ '?sessionid={3FD801FF-A8D0-4D23-A150-CF8301B8F4B0}';
        return this.get({ url: url }).pipe(map((data: any[]) => {
            let buildings: BuildingRecord[] = [];
            for (let item of data) {
                buildings.push({
                    BuildingDesc: item.BuildingId + " - " + item.Name,
                    BuildingId: item.BuildingId,
                    ClientId: item.ClientId,
                    IsDFM: (item.IsDFM)? "Y":"N",
                    Address: item.Address
                });
            }
            if (buildings.length === 0) this.nobuildingsfound();

            return buildings;
        })).pipe(catchError(response => {
            this.nobuildingsfound();
            console.log('Error getting buildings by area');
            throw response;
        }));

    }

    private async nobuildingsfound() {
        const message = await this.languageService.translate('Buildings', 'BUILDINGSNOTFOUND');
        // this.offlineManager.presentToastWithButton(message);
    }

    async downloadData(buildingId: string, clientId: number) {
        // this.offlineManager.downloadStart();
        let body = { 'PageNumber': 1, 'DataHash': [], 'BuildingId': buildingId, 'ClientId': clientId };
        for (let item of buildingAPIS) {
            const args: APISqlite = {
                api: item.type !== 'POST' ? baseUrl + item.api + buildingId : baseUrl + item.api,
                type: item.type,
                table: item.table,
                columns: item.columns,
                upsert: item.upsert,
                body: item.type === 'POST' ? body : ''
            };
            await this.handleRequests(args);
        }
        if (clientId !== -1) {
            for (let item of clientAPIS) {
                const args: APISqlite = {
                    api: item.type !== 'POST' ? baseUrl + item.api + clientId : baseUrl + item.api,
                    type: item.type,
                    table: item.table,
                    columns: item.columns,
                    upsert: item.upsert,
                    body: item.type === 'POST' ? body : ''
                };
                await this.handleRequests(args);
            }
        }
        // await this.offlineManager.downloadComplete();
    }

    private async handleRequests(item: APISqlite) {
        if (item.type !== 'POST') {
            try {
                await this.handleGet(item);
            } catch (err) {
                // await this.offlineManager.downloadFail();
                throw err;
            }
        }
        else {
            try {
                await this.handlePost(item);
            } catch (err) {
                // await this.offlineManager.downloadFail();
                throw err;
            }
        }
    }

    private handleGet(item: APISqlite) {
        return new Promise((resolve, reject) => {
            this.get({ url: item.api }).subscribe((response: any[]) => {
                this.doInsertion(response, item);
                resolve(true);
            }, error => reject(error));
        });
    }

    private async handlePost(item: APISqlite) {
        return new Promise((resolve, reject) => {
            this.post({ url: item.api, data: item.body }).subscribe(async (response) => {
                await this.doInsertion(response.Items, item);
                let page = +response.NextResourcePage;
                if (page !== 0) {
                    this.handlePost({ ...item, body: { ...item.body, 'PageNumber': page } });
                }
                resolve(true);
            }, error => reject(error));
        });
    }

    private async doInsertion(_data: any[], args: APISqlite) {
        if (_data.length === 0) return;
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
        // return this.offlineManager.executeQuery('Insert or Replace into ' + args.table + ' (' + args.columns.join(',') + ') Values ' + params + args.upsert, values);
    }

    getLocation(query: string) {
        const options = JSON.parse(localStorage.getItem('RCMOPTIONS'))
        console.log('RCMOPTS', options);
        if (!options) {
            return;
        }

        let mapsObs = this.get({ url: `${baseUrl}googlemaps/${query}` })
            .pipe(map((response: any) => {
                if (response.results) {
                    return response.results.map(_ => { return { name: _.formatted_address, lat: _.geometry.location.lat, lng: _.geometry.location.lng }; })
                } return [];
            })).pipe(catchError(err => of([])));

        let buildingObs = this.get({ url: `${baseUrl}buildings/${query}` }).pipe(map((response: any[]) => {
            if (response && response.length > 0) {
                return response.map(_ => { return { name: _.Name, lat: _.Latitude, lng: _.Longitude }; });
            } return []
        })).pipe(catchError(err => of([])));

        return combineLatest([buildingObs, mapsObs]).pipe(map(_ => {
            let data: any[] = [];
            for (let d of _) data.push(...d);
            return data;
        }));
    }
}
