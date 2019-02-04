import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ShopTableDataSource } from './shop-table-datasource';
import { ItemsService } from '../../services/items.service';
import { UserItemsService } from '../../services/user-items.service';
import { UsersService } from '../../services/users.service';
import { User } from '../../model/user.interface';
import { Subscription, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Input } from '@angular/core';

@Component({
  selector: 'app-shop-table',
  templateUrl: './shop-table.component.html',
  styleUrls: ['./shop-table.component.scss']
})
export class ShopTableComponent implements OnInit, OnDestroy {
  @Input()
  inShopMode: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: ShopTableDataSource;
  private createUserItemSubscription = new Subscription();
  private pageUserItemsSubscription = new Subscription();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'id'];

  constructor(private itemsService: ItemsService, private userItemsService: UserItemsService, private userService: UsersService) {}

  ngOnInit() {
    this.dataSource = new ShopTableDataSource(this.paginator, this.sort, this.itemsService, this.userItemsService
      , this.userService.readCurrentUserObs(), this.inShopMode)

  }

  ngOnDestroy() {
    this.createUserItemSubscription.unsubscribe();
  }

  addUserItem(idx: number) {
    const currentUser = this.userService.readCurrentUser();
    const chosenItem = this.dataSource.actualItems[idx];
    this.createUserItemSubscription = this.userItemsService.readForItemAndUser(currentUser.id, chosenItem.id)
      .pipe(switchMap((user => {
        if (user) {
          return of(null);
        } else {
          return this.userItemsService.create({user: currentUser, item: chosenItem, inShopSearched: false, quantity: 0});
        }
      }))).subscribe();
  }

  isAddedToList(idx: number) {

  }
}
