import { Component, Input,Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Vendor } from '@app/vendor/vendor';
import { ValidatePhone } from '@app/validators/phone.validator';
import { ValidatePostal } from '@app/validators/postal.validator';

@Component({
  selector: 'app-vendor-detail',
  templateUrl: './vendor-detail.component.html'
})
export class VendorDetailComponent implements OnInit {
  @Input() selectedVendor: Vendor = {
    id: 0,
    address1: '',
    city: '',
    province: '',
    postal: '',
    phone: '',
    vendortype: '',
    vendorname: '',
    email: ''
  }
  @Output() cancelled = new EventEmitter();
  @Output() deleted = new EventEmitter();
  @Output() saved = new EventEmitter();

  vendorForm: FormGroup;
  address1: FormControl;
  city: FormControl;
  province: FormControl;
  postal: FormControl;
  phone: FormControl;
  vendortype: FormControl;
  vendorname: FormControl;
  email: FormControl;
  originalname: string;

  constructor(private builder: FormBuilder) {
    this.address1 = new FormControl('', Validators.compose([Validators.required]));
    this.city = new FormControl('', Validators.compose([Validators.required]));
    this.province = new FormControl('', Validators.compose([Validators.required]));
    this.postal = new FormControl('', Validators.compose([Validators.required, ValidatePostal]));
    this.phone = new FormControl('', Validators.compose([Validators.required, ValidatePhone]));
    this.vendortype = new FormControl('', Validators.compose([Validators.required]));
    this.vendorname = new FormControl('', Validators.compose([Validators.required]));
    this.email = new FormControl('', Validators.compose([Validators.email]));
    this.originalname = '';

    this.vendorForm = new FormGroup({
      address1: this.address1,
      city: this.city,
      province: this.province,
      postal: this.postal,
      phone: this.phone,
      vendortype: this.vendortype,
      vendorname: this.vendorname,
      email: this.email
    });
   }//constructor

  ngOnInit(): void {
    //patchValue doesn't care if all values present
    this.vendorForm.patchValue({
      address1: this.selectedVendor.address1,
      city: this.selectedVendor.city,
      province: this.selectedVendor.province,
      postal: this.selectedVendor.postal,
      phone: this.selectedVendor.phone,
      vendortype: this.selectedVendor.vendortype,
      vendorname: this.selectedVendor.vendorname,
      email: this.selectedVendor.email
    });
  }//ngOnInit

  updateSelectedVendor(): void {
    this.selectedVendor.address1 = this.vendorForm.value.address1;
    this.selectedVendor.city = this.vendorForm.value.city;
    this.selectedVendor.province = this.vendorForm.value.province;
    this.selectedVendor.postal = this.vendorForm.value.postal;
    this.selectedVendor.phone = this.vendorForm.value.phone;
    this.selectedVendor.vendortype = this.vendorForm.value.vendortype;
    this.selectedVendor.vendorname = this.vendorForm.value.vendorname;
    this.selectedVendor.email = this.vendorForm.value.email;
    this.saved.emit(this.selectedVendor);
  }// update selected vendor

}//VendorDetailComponent
