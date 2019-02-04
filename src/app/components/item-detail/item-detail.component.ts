import { Component, Input, OnInit, Output } from '@angular/core';
import { UserItem } from '../../model/user-item.interface';
import { UserItemsService } from '../../services/user-items.service';
import { FormControl, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';
import { FormGroupDirective } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  @Input()
  userItem: UserItem;
  @Output()
  totalCountEmit = new EventEmitter<number>();
  quantity: FormControl;
  totalprice = '0.00';
  matcher = new MyErrorStateMatcher();
  private updateUserItemSubscription = new Subscription();

  constructor(private userItemsService: UserItemsService) {}

  ngOnInit() {
    this.quantity = new FormControl('', [
      Validators.required,
      Validators.max(this.userItem.item.quantity),
      Validators.min(0),
      Validators.pattern('\\d*')
    ]);
    this.quantity.setValue(1);
    this.totalprice = (
      +this.quantity.value * +this.userItem.item.price
    ).toFixed(2);
  }

  ngOnDestroy() {
    this.updateUserItemSubscription.unsubscribe();
  }

  saveUserItem() {
    const oldQuantity = this.userItem.quantity;
    this.userItem.quantity = this.quantity.value;
    this.updateUserItemSubscription = this.userItemsService
      .update(this.userItem.user.id, this.userItem.item.id, this.userItem)
      .subscribe(newUserItem => {
        if (oldQuantity !== newUserItem.quantity) {
          this.totalCountEmit.emit(
            (newUserItem.quantity - oldQuantity) * +newUserItem.item.price
          );
        }
      });
  }

  onlinePriceCount() {
    if (this.quantity.valid) {
      this.totalprice = (
        +this.quantity.value * +this.userItem.item.price
      ).toFixed(2);
    }
  }

  getQuantityErrorMessage() {
    return this.quantity.hasError('required')
      ? 'Liczba przedmiotów jest konieczna'
      : this.quantity.hasError('max')
      ? 'Nie ma tylu przedmiotów w sklepie'
      : this.quantity.hasError('min')
      ? 'Minimalna liczba przedmiotów to 0'
      : this.quantity.hasError('pattern')
      ? 'Liczba przedmiotów powinna być liczbą całkowitą'
      : '';
  }
}

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
