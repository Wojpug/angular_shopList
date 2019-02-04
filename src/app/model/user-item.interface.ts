import { Item } from './item.interface';
import { User } from './user.interface';

export interface UserItem {
  user: User;
  item: Item;
  quantity: number;
  inShopSearched: boolean;
}
