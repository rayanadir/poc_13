import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chat } from 'src/app/interfaces/Chat';
import { ChatRequest } from 'src/app/interfaces/ChatRequest';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private path: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  public get(id:number): Observable<Chat[]>{
    return this.http.get<Chat[]>(`${this.path}/chat/${id}`);
  }

  public send(request: ChatRequest): Observable<Chat>{
    return this.http.post<Chat>(`${this.path}/chat`,request);
  }
}
