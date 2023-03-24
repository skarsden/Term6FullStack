import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenericHttpService } from '@app/generic-http.service';
import { BASEURL } from '../constants';
import { Product } from './product';

//@ts-ignore
@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericHttpService<Product> {
  constructor(httpClient: HttpClient) {
    super(httpClient, `${BASEURL}api/products`)
  }//constructor
}//ProductService
