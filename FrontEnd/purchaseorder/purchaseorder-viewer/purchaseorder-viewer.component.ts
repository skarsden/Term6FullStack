import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BASEURL, PDFURL } from '@app/constants';
import { Vendor } from '@app/vendor/vendor';
import { Product } from '@app/product/product';
import { PurchaseorderLineitem } from '@app/purchaseorder/purchaseorder-lineitem';
import { Purchaseorder } from '@app/purchaseorder/purchaseorder';
import { VendorService } from '@app/vendor/vendor.service';
import { ProductService } from '@app/product/product.service';
import { PurchaseorderService } from '@app/purchaseorder/purchaseorder.service';

@Component({
  selector: 'app-purchaseorder-viewer',
  templateUrl: './purchaseorder-viewer.component.html'
})
export class PurchaseorderViewerComponent implements OnInit {
  //Forms
  viewerForm: FormGroup;
  vendorid: FormControl;
  poid: FormControl;
  //Data
  subscription?: Subscription;
  products$?: Observable<Product[]>;
  vendors$?: Observable<Vendor[]>;
  vendorpos$?: Observable<Purchaseorder[]>;
  items: Array<PurchaseorderLineitem>;
  selectedVendor: Vendor;
  selectedPO: Purchaseorder;
  selectedLineItems: Array<PurchaseorderLineitem>;
  selectedProducts: Array<Product>;
  sub: number;
  tax: number;
  total: number;
  //Misc
  pickedVendor: boolean;
  pickedPO: boolean;
  msg: string;

  constructor(private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private poService: PurchaseorderService) {
    this.vendorid = new FormControl;
    this.poid = new FormControl;
    this.viewerForm = this.builder.group({
      vendorid: this.vendorid,
      poid: this.poid
    });
    this.items = new Array<PurchaseorderLineitem>();
    this.selectedVendor = { id: 0, address1: '', city: '', province: '', postal: '', phone: '', vendortype: '', vendorname: '', email: '' };
    this.selectedPO = { id: 0, vendorid: 0, items: [], amount: 0, podate: '' };
    this.selectedLineItems = [];
    this.selectedProducts = [];
    this.sub = 0.0;
    this.tax = 0.0;
    this.total = 0.0;
    this.pickedVendor = false;
    this.pickedPO = false;
    this.msg = '';
  }//Constructor

  ngOnInit(): void {
    this.onPickVendor();
    this.onPickPO();
    this.msg = 'Loading data from server...';
    this.vendors$ = this.vendorService.getAll().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );
    this.products$ = this.productService.getAll().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return ([]);
      })
    );
    this.msg = 'Server data loaded'
  }//onInit

  ngonDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }//onDestroy

  onPickVendor(): void {
    this.subscription = this.viewerForm.get('vendorid')?.valueChanges.subscribe(val => {
      this.selectedVendor = val
      this.vendorpos$ = this.poService.getById(this.selectedVendor.id).pipe(
        catchError(error => {
          if (error.error instanceof ErrorEvent) {
            this.msg = `Error: ${error.error.message}`;
          } else {
            this.msg = `Error: ${error.message}`;
          }
          return of([]);
        })
      );
      this.pickedVendor = true;
    })
  }//onPickVendor

  onPickPO(): void {
    const xSubscr = this.viewerForm.get('poid')?.valueChanges.subscribe(val => {
      this.selectedPO = val;
      this.selectedLineItems = [];
      this.selectedProducts = [];
      this.sub = 0.0;
      this.selectedPO.items.map(item => {
        this.selectedLineItems.push(item);
      });
      this.selectedLineItems.map(item => {
        this.products$?.pipe(map(products => products.find(product => product.id === item.productid))).subscribe(pro => {
          if (pro !== undefined) {
            this.selectedProducts.push(pro);
            this.sub += pro.costprice * pro.qoo;
            this.tax = this.sub * 0.13;
            this.total = this.sub + this.tax;
          }
        })
      })
      this.pickedPO = true;
      this.msg = `Purchase Order ${this.selectedPO.id} selected`;
    });
    this.subscription?.add(xSubscr);
  }//onPickPO

  viewPdf(): void {
    window.open(`${PDFURL}${this.selectedPO.id}`, '');
  }//viewPdf

}
