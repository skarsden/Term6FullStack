import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vendor } from '@app/vendor/vendor';
import { Product } from '@app/product/product';
import { PurchaseorderLineitem } from '@app/purchaseorder/purchaseorder-lineitem';
import { Purchaseorder } from '@app/purchaseorder/purchaseorder';
import { BASEURL, PDFURL } from '@app/constants';
import { VendorService } from '@app/vendor/vendor.service';
import { ProductService } from '@app/product/product.service';
import { PurchaseorderService } from '@app/purchaseorder/purchaseorder.service';
@Component({
  templateUrl: './purchaseorder-generator.component.html'
})
export class PurchaseorderGeneratorComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  quantity: FormControl;
  // data
  subscription?: Subscription;
  products$?: Observable<Product[]>; // everybody's products
  vendors$?: Observable<Vendor[]>; // all vendors
  vendorproducts$?: Observable<Product[]>; // all products for a particular vendor
  items: Array<PurchaseorderLineitem>; // product items that will be in purchasorder
  selectedproducts: Product[]; // products that being displayed currently in app
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  pono: number = 0;
  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  generated: boolean;
  hasProducts: boolean;
  hasQty: boolean;
  msg: string;
  sub: number;
  tax: number;
  total: number;
  url: string;
  constructor(private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private purchaseorderService: PurchaseorderService) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.generated = false;
    this.url = BASEURL + 'pos';
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.quantity = new FormControl('');
    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      quantity: this.quantity
    });
    this.selectedProduct = {
      id: '', vendorid: 0, name: '',
      costprice: 0.0, msrp: 0.0, rop: 0, eoq: 0, qoh: 0, qoo: 0,
      qrcode: '', qrcodetxt: ''
    };
    this.selectedVendor = {
      id: 0,
      address1: '',
      city: '',
      province: '',
      postal: '',
      phone: '',
      vendortype: '',
      vendorname: '',
      email: ''
    };
    this.items = new Array<PurchaseorderLineitem>();
    this.selectedproducts = new Array<Product>();
    this.hasProducts = false;
    this.hasQty = false;
    this.sub = 0.0;
    this.tax = 0.0;
    this.total = 0.0;
  } // constructor
  ngOnInit(): void {
    this.onPickVendor();
    this.onPickProduct();
    this.onPickQuantity();
    this.msg = 'loading vendors and products from server...';
    this.vendors$ = this.vendorService.getAll().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]); // returns an empty array if there's a problem
      })
    );
    this.products$ = this.productService.getAll().pipe(
      catchError(error => {
        if (error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]);
      })
    );
    this.msg = 'server data loaded';
  } // ngOnInit
  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  } // ngOnDestroy
  /**
  * onPickVendor - Another way to use Observables, subscribe to the select change event
  * then load specific vendor products for subsequent selection
  */
  onPickVendor(): void {
    this.subscription = this.generatorForm.get('vendorid')?.valueChanges.subscribe(val => {
      this.selectedProduct = {
        id: '', vendorid: 0, name: '',
        costprice: 0.0, msrp: 0.0, rop: 0, eoq: 0, qoh: 0, qoo: 0,
        qrcode: '', qrcodetxt: ''
      };
      this.selectedVendor = val;
      this.loadVendorProducts();
      this.pickedProduct = false;
      this.hasProducts = false;
      this.msg = 'choose product for vendor';
      this.pickedVendor = true;
      this.generated = false;
      this.items = []; // array for the purchase order
      this.selectedproducts = []; // array for the details in app html
    });
  } // onPickVendor
  /**
  * onPickProduct - subscribe to the select change event then
  * update array containing items.
  */
  onPickProduct(): void {
    const xSubscr = this.generatorForm.get('productid')?.valueChanges.subscribe(val => {
      this.selectedProduct = val;
      const item: PurchaseorderLineitem = { id: 0, poid: 0, productid: this.selectedProduct?.id, qty: this.selectedProduct.qoo, price: this.selectedProduct.msrp };
      if (this.items.find(it => it.productid === this.selectedProduct?.id)) { // ignore entry
      } else { // add entry
        // this.items.push(item);
        // this.selectedproducts.push(this.selectedProduct);
        this.hasProducts = true;
      }
      // if (this.items.length > 0) {
      //   this.hasProducts = true;
      // }
    });
    this.subscription?.add(xSubscr); // add it as a child, so all can be destroyed together
  } // onPickProduct

  /**
   * onPickQuantity() - notify that a quantity has been chosen
   */
  onPickQuantity() {
    const qSubscr = this.generatorForm.get('quantity')?.valueChanges.subscribe(val => {
      if (val === -1) {
        this.selectedProduct.qoo = this.selectedProduct.eoq;
        this.hasQty = true;
        this.msg = "";
        const item: PurchaseorderLineitem = { id: 0, poid: 0, productid: this.selectedProduct?.id, qty: this.selectedProduct.qoo, price: this.selectedProduct.msrp };
        if (this.items.find(it => it.productid === this.selectedProduct?.id)) { // ignore entry
        } else { // add entry
          this.items.push(item);
          this.selectedproducts.push(this.selectedProduct);
          this.msg = `${this.selectedProduct.qoo} ${this.selectedProduct.name}(s) Added`
        }
      } else if (val === 0 && this.items.length > 0) {
        this.items.pop();
        this.selectedproducts.pop();
        this.msg = `All ${this.selectedProduct.name}s removed`;
        if (this.selectedproducts.length === 0) {
          this.hasQty = false;
          this.msg = "No items";
        }
      } else {
        this.selectedProduct.qoo = val;
        this.hasQty = true;
        this.msg = "";
        const item: PurchaseorderLineitem = { id: 0, poid: 0, productid: this.selectedProduct?.id, qty: this.selectedProduct.qoo, price: this.selectedProduct.msrp };
        if (this.items.find(it => it.productid === this.selectedProduct?.id)) { // ignore entry
        } else { // add entry
          this.items.push(item);
          this.selectedproducts.push(this.selectedProduct);
          this.msg = `${this.selectedProduct.qoo} ${this.selectedProduct.name}(s) Added`
        }
      }
      this.sub = 0.0;
      this.tax = 0.0;
      this.total = 0.0;
      this.selectedproducts.forEach(prd => this.sub += prd.costprice * prd.qoo);
      this.tax = this.sub * 0.13;
      this.total = this.tax + this.sub;
      console.log(this.items);
    });
    this.subscription?.add(qSubscr); //add as child, so all is destroyed together
  }

  /**
  * loadVendorProducts - filter for a particular vendor's products
  */
  loadVendorProducts(): void {
    this.vendorproducts$ = this.products$?.pipe(
      map(products =>
        // map each product in the array and check whether or not it belongs to selected vendor
        products.filter(product => product.vendorid === this.selectedVendor?.id)
      )
    );
  } // loadVendorProducts
  /**
  * createPurchaseOrder - create the client side purchase order
  */
  createPurchaseOrder(): void {
    this.generated = false;
    const po: Purchaseorder = { id: 0, items: this.items, vendorid: this.selectedProduct.vendorid, amount: this.total };
    const pSubscr = this.purchaseorderService.add(po).subscribe(
      (payload: any) => { // server should be returning new id
        if (typeof payload === 'number') {
          this.msg = `Purchase Order ${payload} added!`;
          this.pono = payload;
          this.generated = true;
        } else {
          this.msg = 'Purchase Order not added! - server error';
        }
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.hasQty = false;
      },
      (err: { status: any; statusText: any; }) => {
        this.msg = `Error - product not added - ${err.status} - ${err.statusText}`;
      });
    this.subscription?.add(pSubscr); // add it as a child, so all can be destroyed together
  } // createPurchaseOrder

  /**
   * viewPdf - view pdf of created order
   */
  viewPdf(): void {
    window.open(`${PDFURL}${this.pono}`, '');
  }// viewPdf

} // PurchaseOrderGeneratorComponent