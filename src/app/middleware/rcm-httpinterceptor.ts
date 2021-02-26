import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { from, Observable, of, throwError } from 'rxjs';
import { ConnectionStatus, NetworkService } from './network.service';
import { OfflineManagerService } from './offline-manager.service';
import { get, set } from './utility/storage';
import { catchError, flatMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CacheData } from './utility/cachedata';
import { OfflineQueryService } from '../common/service/offline-query.service';


const CACHE_TIMEOUT = 60 * 60000;
@Injectable({
    providedIn: 'root'
})
export class RCMHttpInterceptor implements HttpInterceptor {
    constructor(private networkService: NetworkService,
        private offlineManager: OfflineManagerService,
        private queryService: OfflineQueryService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.setRequestHeaders(req);
        var isOnline = this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online;

        if (req.method !== 'GET' && req.method != 'OPTIONS') {
            if (!isOnline) {
                this.offlineManager.saveRequest(req.method, req.url, req.body);
                return of(new HttpResponse({ body: { ConnectionStatus: ConnectionStatus.Offline } }));
            }
            else return next.handle(req).pipe(catchError(response => this.handleError(response, req)));
        }

        else if (req.url.includes('offline')) { return next.handle(req); }

        const cacheKey = req.method + '-' + req.urlWithParams;
        const cacheObservable = from(get(cacheKey));
        const timeNow = Date.now();
        return cacheObservable.pipe(flatMap((data: CacheData) => {
            if (data != null) {
                if (!isOnline) return of(new HttpResponse(JSON.parse(data.value)));
                if (timeNow - data.timestamp < CACHE_TIMEOUT) return of(new HttpResponse(JSON.parse(data.value)));
            }

            if (!isOnline) return of(new HttpResponse({ body: { ConnectionStatus: ConnectionStatus.Offline } }));

            return next.handle(req).pipe(tap(e => {
                if (e instanceof HttpResponse) {
                    set(cacheKey, <CacheData>{
                        value: JSON.stringify(e),
                        timestamp: timeNow
                    });
                }
            }
            )).pipe(catchError(response => this.handleError(response, req)));
        }));
    }

    private setRequestHeaders(req: HttpRequest<any>) {
        if (!req.headers.has('Content-Type')) {
            req = req.clone({
                setHeaders: {
                    'content-type': 'application/json'
                }
            });
        }
        req = req.clone({
            headers: req.headers.set('Accept', 'application/json')
        });
        return req;
    }

    private handleError(response: HttpErrorResponse, req: HttpRequest<any>) {
        let errorMsg = '';

        if (response.error instanceof ErrorEvent) {
            errorMsg = JSON.stringify({ 'Status': response.status, 'StatusText': response.statusText, 'Error': response.error.message });
        }
        else {
            errorMsg = JSON.stringify({ 'Status': response.status, 'StatusText': response.statusText, 'Error': response.message });
        }
        console.log("RCMERROR: " + errorMsg);
        this.offlineManager.LOG(req.url, req.method, errorMsg, req.method === 'POST' ? JSON.stringify(req.body) : '');
        throw response;
        return throwError(errorMsg);
    }
}