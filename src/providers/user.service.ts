import { map } from 'rxjs/operators';
import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from "../model/models";

@Injectable({
  providedIn: "root"
})
export class UserService {

  constructor(private firebase : AngularFireDatabase ) { }

  getUsers(email: string): Observable<User[]> {
    return this.firebase.list('users', query => query.orderByChild('email').equalTo(email)).snapshotChanges().pipe(map(actions => actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
  }

  addUser(user: User) {
    return this.firebase.list('users').push(user).then(user => {
      console.log(user);
      return user 
    });
  }

  updateUser(user: User) {
    return this.firebase.list('users').update(user.key, user).then(user => {
      console.log(user);
      return user 
    });
  }
}