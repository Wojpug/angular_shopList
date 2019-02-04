import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Item } from '../model/item.interface';
import { Config } from '../app.config';
import { User } from '../model/user.interface';
import { UserItem } from '../model/user-item.interface';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  private fakeSequence = 10000;
  private items: Item[] = [
    { id: 1, name: 'Bulaj', quantity: 2, price: 20.0 },
    { id: 2, name: 'Knaga', quantity: 3, price: 10.0 },
    { id: 3, name: 'Pagaj', quantity: 3, price: 80.0 },
    { id: 4, name: 'Kabestan', quantity: 3, price: 200.0 },
    { id: 5, name: 'Korba', quantity: 7, price: 250.0 },
    { id: 6, name: 'Szekla', quantity: 2, price: 10.0 },
    { id: 7, name: 'Kausza', quantity: 3, price: 15.0 },
    { id: 8, name: 'Szoty', quantity: 100, price: 80.0 },
    { id: 9, name: 'Stoper', quantity: 100, price: 280.0 },
    { id: 10, name: 'Wantownik', quantity: 5, price: 10.0 },
    { id: 11, name: 'Rolka', quantity: 10, price: 15.0 },
    { id: 12, name: 'Zawleczka', quantity: 5, price: 5.0 }
  ];
  private currentUser: User = { id: 1, login: 'admin', inShopMode: false };
  private usersItems: UserItem[] = [];

  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(
        mergeMap(() => {
          if (request.url.startsWith(Config.URL_USER_ITEMS_CREATE)) {
            const userItems: UserItem = request.body;
            this.usersItems.push(JSON.parse(JSON.stringify(userItems)));
            return of(new HttpResponse({ status: 200, body: userItems }));
          } else if (request.url.startsWith(Config.URL_ITEMS_READ_ALL_COUNT)) {
            return of(
              new HttpResponse({ status: 200, body: this.items.length })
            );
          } else if (request.url.startsWith(Config.URL_ITEMS_READ_PAGED)) {
            const pageSize = +(request.params.get('pageSize')
              ? request.params.get('pageSize')
              : 10);
            const pageIndex = +(request.params.get('pageIndex')
              ? request.params.get('pageIndex')
              : 0);
            const isSortAsc = request.params.get('isSortAsc') === 'true';
            const sortBy = request.params.get('sortBy');
            const itemsSorted = this.getSortedData(
              [...this.items],
              sortBy,
              isSortAsc
            );
            const itemsPaged = this.getPagedData(
              itemsSorted,
              pageSize,
              pageIndex
            );

            return of(new HttpResponse({ status: 200, body: itemsPaged }));
          } else if (
            request.url.startsWith(Config.URL_USER_ITEMS_READ_FOR_USER_COUNT)
          ) {
            const userId = +request.url.split(
              Config.URL_USER_ITEMS_READ_FOR_USER_PAGED
            )[1];
            const userItems = this.usersItems.filter(
              ui => ui.user.id === userId
            );

            return of(
              new HttpResponse({ status: 200, body: userItems.length })
            );
          } else if (
            request.url.startsWith(Config.URL_USER_ITEMS_READ_FOR_USER_PAGED)
          ) {
            const pageSize = +(request.params.get('pageSize')
              ? request.params.get('pageSize')
              : 10);
            const pageIndex = +(request.params.get('pageIndex')
              ? request.params.get('pageIndex')
              : 0);
            const isSortAsc = request.params.get('isSortAsc') === 'true';
            const sortBy = request.params.get('sortBy');
            const userId = +request.url.split(
              Config.URL_USER_ITEMS_READ_FOR_USER_PAGED
            )[1];
            const userItems = this.usersItems.filter(
              ui => ui.user.id === userId
            );
            const itemsSorted = this.getSortedData(
              userItems,
              sortBy,
              isSortAsc
            );
            const itemsPaged = this.getPagedData(
              itemsSorted,
              pageSize,
              pageIndex
            );

            return of(new HttpResponse({ status: 200, body: itemsPaged }));
          } else if (request.url.startsWith(Config.URL_USERS_READ_CURRENT)) {
            return of(
              new HttpResponse({ status: 200, body: this.currentUser })
            );
          } else if (
            request.url.startsWith(Config.URL_USER_ITEMS_READ_FOR_USER_AND_ITEM)
          ) {
            const userId = +request.url.split(
              Config.URL_USER_ITEMS_READ_FOR_USER_AND_ITEM
            )[1];
            const itemId = +request.params.get('itemId');
            const userItems = this.usersItems.find(
              ui => ui.user.id === userId && ui.item.id === itemId
            );

            return of(
              new HttpResponse({
                status: 200,
                body: userItems ? userItems : ''
              })
            );
          } else if (request.url.startsWith(Config.URL_USER_ITEMS_DELETE)) {
            const urlParams = request.url.split(
              Config.URL_USER_ITEMS_DELETE
            )[1];
            const userId = +urlParams.split('/')[0];
            const itemId = +urlParams.split('/')[1];
            this.usersItems = this.usersItems.filter(
              ui => ui.user.id !== userId && ui.item.id !== itemId
            );

            return of(new HttpResponse({ status: 200, body: 'OK' }));
          } else if (request.url.startsWith(Config.URL_USER_ITEMS_UPDATE)) {
            const urlParams = request.url.split(
              Config.URL_USER_ITEMS_UPDATE
            )[1];
            const userId = +urlParams.split('/')[0];
            const itemId = +urlParams.split('/')[1];
            const userItems: UserItem = request.body;
            this.usersItems = this.usersItems.filter(
              ui => ui.user.id === userId && ui.item.id === itemId
            );
            this.usersItems.push(JSON.parse(JSON.stringify(userItems)));

            return of(new HttpResponse({ status: 200, body: userItems }));
          } else if (
            request.url.startsWith(
              Config.URL_USER_ITEMS_READ_FOR_USER_AND_ITEMS
            )
          ) {
            const urlParams = request.url.split(
              Config.URL_USER_ITEMS_READ_FOR_USER_AND_ITEMS
            )[1];
            const userId = +urlParams.split('/')[0];
            const itemIds = +urlParams.split('/')[1];
            // this.usersItems = this.usersItems.filter(ui => ui.user.id === userId && ui.item.id === itemIds);
            // this.usersItems.push(JSON.parse(JSON.stringify(userItems)));

            return of(new HttpResponse({ status: 200, body: null }));
          }

          // pass through any requests not handled above
          return next.handle(request);
        })
      )
      .pipe(materialize())
      .pipe(delay(150))
      .pipe(dematerialize());
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Item[], pageSize: number, pageIndex: number) {
    const startIndex = pageIndex * pageSize;
    return data.splice(startIndex, pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: any[], sortBy: string, isSortAsc: boolean) {
    if (!sortBy) {
      return data;
    }

    return data.sort((a, b) => {
      return (a[sortBy] < b[sortBy] ? -1 : 1) * (isSortAsc ? 1 : -1);
    });
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
