import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/User';
import { UserResponse } from 'src/app/interfaces/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private path: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  public get(id:number): Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.path}/user/${id}`);
  }

  public getAll(): Observable<User[]>{
    return this.http.get<User[]>(`${this.path}/user`);
  }
}
