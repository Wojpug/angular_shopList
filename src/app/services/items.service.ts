import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../model/item.interface';
import { Config } from '../app.config';
import { HttpParams } from '@angular/common/http';
import { UserItem } from '../model/user-item.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  constructor(private http: HttpClient) {}

  create(item: Item): Observable<void> {
    throw new Error('Not implemented, yet');
  }

  readPaged(pageSize: string, pageIndex: string, sortBy: string, isSortAsc: string): Observable<Item[]> {
    let params = new HttpParams().set('pageSize', pageSize);
    params = params.set('pageIndex', pageIndex);

    if (sortBy) {
      params = params.set('isSortAsc', isSortAsc);
      params = params.set('sortBy', sortBy);
    }

    return this.http.get<Item[]>(Config.URL_ITEMS_READ_PAGED, {params: params});
  }

  readAllCount(): Observable<number> {
    return this.http.get<number>(Config.URL_ITEMS_READ_ALL_COUNT);
  }

  update(item: Item): Observable<Item> {
    throw new Error('Not implemented, yet');
  }

  delete(item: Item): Observable<void> {
    throw new Error('Not implemented, yet');
  }
}
