import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerService } from 'src/app/interfaces/CustomerService';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  private path: string = "http://localhost:8080/api";

  constructor(private http: HttpClient) { }

  public getAll(): Observable<CustomerService[]>{
    return this.http.get<CustomerService[]>(`${this.path}/customer_service`);
  }
}
