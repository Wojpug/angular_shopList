import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { UserItemsTableDataSource } from './user-items-table-datasource';

describe('ShopTableComponent', () => {
  let component: UserItemsTableDataSource;
  let fixture: ComponentFixture<UserItemsTableDataSource>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserItemsTableDataSource ],
      imports: [
        NoopAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserItemsTableDataSource);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
