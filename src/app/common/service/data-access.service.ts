import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { publishLast, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export abstract class DataAccessService {

  constructor(private http: HttpClient) {

  }

  get(param: DataAccessServiceParamters) {
    //this.setOfflineQuery(param.offlineQuery);
    return this.http.get(param.url, { params: param.params });
  }

  post(param: DataAccessServiceParamters) {
    return this.http.post(param.url, param.data, { params: param.params }).pipe(publishLast(), refCount());
  }
}

export interface DataAccessServiceParamters {
  url: string,
  data?: any,
  params?: any,
  offlineQuery?: any
}
