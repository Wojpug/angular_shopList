import { Component, OnInit, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { UserItemsTableDataSource } from './user-items-table-datasource';
import { ItemsService } from '../../services/items.service';
import { UserItemsService } from '../../services/user-items.service';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';
import { UserItem } from '../../model/user-item.interface';

@Component({
  selector: 'app-user-items-table',
  templateUrl: './user-items-table.component.html',
  styleUrls: ['./user-items-table.component.scss']
})
export class UserItemsTableComponent implements OnInit, OnDestroy {
  @Output() showDetailsEmiter = new EventEmitter<UserItem>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: UserItemsTableDataSource;
  private currUserSubscription = new Subscription();
  private createUserItemSubscription = new Subscription();
  private itemDetails: UserItem;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['item.name', 'item.id'];

  constructor(private itemsService: ItemsService, private userItemsService: UserItemsService, private userService: UsersService) {}

  ngOnInit() {
    this.dataSource = new UserItemsTableDataSource(this.paginator, this.sort, this.userItemsService, this.userService);
  }

  ngOnDestroy() {
    this.currUserSubscription.unsubscribe();
    this.createUserItemSubscription.unsubscribe();
    this.itemDetails = null;
  }

  showDetails(idx: number) {
    this.showDetailsEmiter.next(this.dataSource.actualItems[idx]);
  }
}