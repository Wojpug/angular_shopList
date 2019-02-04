import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuOption } from '../../model/menu-option.enum';
import { UserItem } from '../../model/user-item.interface';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  private static DIODE_RED = '../../../assets/red_diode.png';
  private static DIODE_GREEN = '../../../assets/green_diode.png';
  mode = MenuOption[MenuOption.SKLEP];
  diode = MainNavComponent.DIODE_GREEN;
  inShopMode = false;
  itemDetails: UserItem;
  totalSpent = '0.00';

  constructor() {}

  navigate(mode: string) {
    this.mode = MenuOption[mode];
  }

  toggleInShopMode() {
    if (this.diode === MainNavComponent.DIODE_GREEN) {
      this.diode = MainNavComponent.DIODE_RED;
      this.inShopMode = true;
    } else {
      this.diode = MainNavComponent.DIODE_GREEN;
      this.inShopMode = false;
    }
    this.navigate(MenuOption.SKLEP.toString());
  }

  showDetailsEmiter($event: UserItem) {
    this.mode = MenuOption[MenuOption.SZCZEGOLY_PRZEDMIOTU];
    this.itemDetails = $event;
  }

  addToTotal($event: number) {
    this.totalSpent = (+this.totalSpent + $event).toFixed(2);
  }
}
