import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from "../model/models";

@Injectable()
export class UserService {
  selectedUser: User = new User();

  constructor(private firebase : AngularFireDatabase ) { }

  getUsers(email: string): Observable<any[]> {
    return this.firebase.list('users', query => query.orderByChild('email').equalTo(email)).snapshotChanges();
  }

  addUser(user: User) {
    return this.firebase.list('users').push(user).then(user => {
      console.log(user);
      return user 
    });
  }

  updateUser(user: User) {
    return this.firebase.object('users').update(user);
  }
}