import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';
import { MatComponentsModule } from '../mat-components/mat-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { VendorDetailComponent } from './vendor-detail/vendor-detail.component';




@NgModule({
  declarations: [
    VendorListComponent,
    VendorHomeComponent,
    VendorDetailComponent
  ],
  imports: [
    CommonModule,
    MatComponentsModule,
    ReactiveFormsModule
  ]
})
export class VendorModule { }
