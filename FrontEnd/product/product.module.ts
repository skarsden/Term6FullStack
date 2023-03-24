import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductHomeComponent } from './product-home/product-home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@NgModule({
  declarations: [
    ProductHomeComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule, MatComponentsModule, ReactiveFormsModule
  ]
})
export class ProductModule { }
