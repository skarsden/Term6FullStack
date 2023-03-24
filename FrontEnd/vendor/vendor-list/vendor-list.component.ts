import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vendor } from '../vendor';

@Component({
  selector: 'app-vendor-list',
  template: `
    <mat-list-item *ngFor="let vendor of vendors" layout="row" class="pad-xs mat-title" (click)="selected.emit(vendor)">
      {{ vendor.id }} - {{ vendor.vendorname }}
    </mat-list-item>
  `
})
export class VendorListComponent {
  @Input() vendors: Vendor[] | null = []; //add | null for strict type adherence
  @Output() selected = new EventEmitter();
}//VendorListComponent
