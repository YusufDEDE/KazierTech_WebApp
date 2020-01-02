import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';
import { ApiConfig } from "./ApiConfig";

@Injectable({
  providedIn: 'root'
})

export class AppService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public apiconfig = new ApiConfig();
  
  constructor(
    private http: HttpClient,
    private router: Router,
    ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
}

  login(username, password) {
    console.log(username, password);
        return this.http.post<any>(this.apiconfig.path+'/api/token/', {username, password})
            .pipe(map(user => {
                console.log(user.access);
                // login successful if there's a jwt token in the response
                if (user.access) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    //const currentUser = this.currentUserValue;
                }
                return user;    
            }));
            
  }

  test(){
    return this.http.get<any>(this.apiconfig.path+'/jobs/').
      subscribe( data => {
        console.log("uloo , ", data);
      }
    )
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log("logout!");
  }
}