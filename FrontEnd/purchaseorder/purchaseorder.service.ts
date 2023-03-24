import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BASEURL } from '../constants';
import { GenericHttpService } from '@app/generic-http.service';
import { Purchaseorder } from './purchaseorder';

//@ts-ignore
@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService extends GenericHttpService<Purchaseorder> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `${BASEURL}api/pos`)
  } //constructor
}//VendorService
