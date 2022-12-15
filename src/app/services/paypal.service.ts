import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, PaypalCaptureResponse, PaypalOrderResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

private baseURL = 'http://localhost:8080/checkout';

  constructor(private httpClient: HttpClient) { }

  createOrder(): Observable<PaypalOrderResponse>{
    return this.httpClient.post<PaypalOrderResponse>(`${this.baseURL}/create`,{});
  }

  captureOrder(orderId: string): Observable<PaypalCaptureResponse>{
    return this.httpClient.post<PaypalCaptureResponse>(`${this.baseURL}/capture/${orderId}`, null);
  }

  getOrders(): Observable<Order[]>{
    return this.httpClient.get<Order[]>(`${this.baseURL}/list-orders`);
  }

}
