import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conversation } from 'src/app/interfaces/Conversation';
import { ConversationRequest } from 'src/app/interfaces/ConversationRequest';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {

  private path: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  public getAllConversations(id:number): Observable<Conversation[]>{
    return this.http.get<Conversation[]>(`${this.path}/conversations/all/${id}`);
  }

  public createConversation(request: ConversationRequest): Observable<Conversation>{
    return this.http.post<Conversation>(`${this.path}/conversations/create`, request);
  }

  public getConversation(id:number): Observable<Conversation>{
    return this.http.get<Conversation>(`${this.path}/conversations/${id}`);
  }
}
