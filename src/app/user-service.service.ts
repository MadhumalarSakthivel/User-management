import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './manage-user/manage-user.component';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }

  getUser(): Observable<User> {
    return this.http.get<User>("https://dummyjson.com/users");
  }
}
