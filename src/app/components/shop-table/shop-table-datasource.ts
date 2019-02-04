import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of, merge } from 'rxjs';
import { Item } from '../../model/item.interface';
import { ItemsService } from '../../services/items.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { UserItemsService } from '../../services/user-items.service';
import { User } from '../../model/user.interface';

/**
 * Data source for the ShopTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ShopTableDataSource extends DataSource<Item> {
  private pageSize: string;
  private pageIndex: string;
  private sortBy: string;
  private isSortAsc: string;
  actualItems: Item[];

  constructor(private paginator: MatPaginator, private sort: MatSort, private itemsService: ItemsService
              , private userItemsService: UserItemsService, private currentUserObs: Observable<User>, private inShopMode: boolean) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Item[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      of(null), // inital loading
      this.paginator.page.pipe(map((data) => {
        this.pageSize = data.pageSize.toString();
        this.pageIndex = data.pageIndex.toString();
        return data;
      })),
      this.sort.sortChange.pipe(map((data) => {
        this.sortBy = data.active;
        this.isSortAsc = (data.direction === 'asc').toString();
        return data;
      }))
    ];

    let obs = merge(...dataMutations).pipe(switchMap(() => this.itemsService.readAllCount()))
      .pipe(switchMap(count => {
        this.paginator.length = count;
        return this.itemsService.readPaged(this.pageSize, this.pageIndex, this.sortBy, this.isSortAsc);
      })).pipe(map((data) => this.actualItems = data));

    if (this.inShopMode) {
      obs = obs.pipe(switchMap(data => {
        return this.currentUserObs
          .pipe(switchMap((currentUser) => this.userItemsService.readForItemsAndUser(currentUser.id, data)))
          .pipe(map(() => data));
      }));
    }

    return obs;
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}
}
