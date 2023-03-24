import { Component, OnInit } from '@angular/core';
import { Vendor } from '../vendor';
import { VendorService } from '../vendor.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-casestudy',
  templateUrl: './vendor-home.component.html'
})
export class VendorHomeComponent implements OnInit {
  vendors$: Observable<Vendor[]> | null;
  msg: string | null;
  vendor: Vendor;
  hideEditForm: boolean;
  todo: string;

  constructor(public vendorService: VendorService) { 
    this.vendor = {
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
    this.msg = "";
    this.vendors$ = null;
    this.hideEditForm = true;
    this.todo = '';
  } //constructor

  ngOnInit(): void {
    this.msg = 'Vendors loaded - with Async pipe';
    this.vendors$ = this.vendorService.getAll().pipe(
      catchError(error => {
        if(error.error instanceof ErrorEvent) {
          this.msg = `Error: ${error.error.message}`;
        } else {
          this.msg = `Error: ${error.message}`;
        }
        return of([]); //empty array if error
      })
    );
  }//ngOnInit

  select(vendor: Vendor): void {
    this.todo = 'update';
    this.vendor = vendor;
    this.msg = `${vendor.vendorname} selected`;
    this.hideEditForm = !this.hideEditForm;
  }//select

  //cancelled - event handler for cancel button
  cancel(msg?: string): void{
    if(msg) {
      this.msg = 'Operation Cancelled';
    }
    this.hideEditForm = !this.hideEditForm;
  }

  //update - save changed update to service
  update(vendor: Vendor): void {
    this.vendorService.update(vendor).subscribe(payload => {
      if(payload.id > 0){
        this.msg = `Vendor ${vendor.id} updated`;
      } else {
        this.msg = 'Update Failed - server error';
      }
      this.hideEditForm = !this.hideEditForm;
    },
      err => {
        this.msg = `Error - update failed - ${err.status} - ${err.statusText}`;
      });
  }//update

  //save - determine whether we're doing add or update
  save(vendor: Vendor): void {
    (vendor.id) ? this.update(vendor) : this.add(vendor);
  }//save 

  //add - send vendor to service, receive new vendor back
  add(vendor: Vendor): void {
    vendor.id = 0;
    this.vendorService.add(vendor).subscribe(payload => {
      if(payload.id > 0){
        this.msg = `Vendor ${payload.id} added`;
      } else {
        this.msg = 'Vendor not added - servor error';
      }
      this.hideEditForm = !this.hideEditForm;
    },
    err => {
      this.msg = `Error - vendor not added - ${err.status} - ${err.statusText}`;
    });
  }//add

  //delete - send vendor to service for deletion
  delete(vendor: Vendor): void {
    this.vendorService.delete(vendor.id).subscribe(payload => {
      if(payload === 1) { // server return # of rows deleted 
        this.msg = `Vendor ${vendor.id} deleted`
      } else {
        this.msg = 'Vendor delete failed';
      }
      this.hideEditForm = !this.hideEditForm;
    }, 
    err => {
      this.msg = `Error - vendor delete faild - ${err.status} - ${err.statusText}`;
    });
  }//delete

  //newVendor - create new vendor instance
  newVendor(): void {
    this.vendor = {id: 0, address1: '', city: '', province: '', postal: '', phone: '', vendortype: '', vendorname: '', email: ''};
    this.msg = 'New Vendor';
    this.hideEditForm = !this.hideEditForm;
  }//newVendor
} //VendorHomeComponent
