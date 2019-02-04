import { Injectable } from '@angular/core';
import { Config } from '../app.config';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.interface';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private currentUser: User;

  constructor(private http: HttpClient) {
    this.http.get<User>(Config.URL_USERS_READ_CURRENT).subscribe((user) => this.currentUser = user);
  }

  public readCurrentUser(): User {
    return this.currentUser;
  }

  public readCurrentUserObs(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    } else {
      return this.http.get<User>(Config.URL_USERS_READ_CURRENT).pipe(map((user) => this.currentUser = user));
    }
  }
}
