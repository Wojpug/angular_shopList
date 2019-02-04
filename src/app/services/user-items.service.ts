import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Config } from '../app.config';
import { UserItem } from '../model/user-item.interface';
import { UsersService } from './users.service';
import { Item } from '../model/item.interface';

@Injectable({
  providedIn: 'root'
})
export class UserItemsService {

  constructor(private http: HttpClient, private usersService: UsersService) { }

  create(useritem: UserItem): Observable<UserItem> {
    return this.http.post<UserItem>(Config.URL_USER_ITEMS_CREATE, useritem);
  }

  readForItemAndUser(userId: number, itemId: number) {
    let params = new HttpParams().set('itemId', itemId.toString());
    return this.http.get<UserItem[]>(Config.URL_USER_ITEMS_READ_FOR_USER_AND_ITEM + userId, {params: params});
  }

  readPagedForUser(userId: number, pageSize: string, pageIndex: string, sortBy: string, isSortAsc: string): Observable<UserItem[]> {
    let params = new HttpParams().set('pageSize', pageSize);
    params = params.set('pageIndex', pageIndex);

    if (sortBy) {
      params = params.set('isSortAsc', isSortAsc);
      params = params.set('sortBy', sortBy);
    }

    return this.http.get<UserItem[]>(Config.URL_USER_ITEMS_READ_FOR_USER_PAGED + userId, {params: params});
  }

  readAllCount(userId: number): Observable<number> {
    return this.http.get<number>(Config.URL_USER_ITEMS_READ_FOR_USER_COUNT + userId);
  }

  readForItemsAndUser(userId: number, data: Item[]) {
    return this.http.get<number>(Config.URL_USER_ITEMS_READ_FOR_USER_AND_ITEMS + userId + '/' + data.map((i) => i.id));
  }

  update(userId: number, itemId: number, userItem: UserItem) {
    return this.http.put<UserItem>(Config.URL_USER_ITEMS_UPDATE + userId + '/' + itemId, userItem);
  }

}
