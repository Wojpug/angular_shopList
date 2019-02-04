import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemsService } from './services/items.service';
import { UserItemsService } from './services/user-items.service';
import { UsersService } from './services/users.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { ShopTableComponent } from './components/shop-table/shop-table.component';
import { MatPaginatorModule, MatSortModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { fakeBackendProvider } from './fakeApi/fake-backend.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { UserItemsTableComponent } from './components/user-items-table/user-items-table.component';
import { ItemDetailComponent } from './components/item-detail/item-detail.component';
import { FormsModule, ReactiveFormsModule } from '../../node_modules/@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ShopTableComponent,
    UserItemsTableComponent,
    MainNavComponent,
    ItemDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCheckboxModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    ItemsService,
    UserItemsService,
    UsersService,
    // fake backend
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
