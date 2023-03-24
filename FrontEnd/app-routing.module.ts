import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VendorHomeComponent } from './vendor/vendor-home/vendor-home.component';
import { ProductHomeComponent } from './product/product-home/product-home.component';
import { PurchaseorderGeneratorComponent } from './purchaseorder/purchaseorder-generator/purchaseorder-generator.component';
import { PurchaseorderViewerComponent } from './purchaseorder/purchaseorder-viewer/purchaseorder-viewer.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: 'vendors', component: VendorHomeComponent },
  { path: 'products', component: ProductHomeComponent },
  { path: 'generator', component: PurchaseorderGeneratorComponent },
  { path: 'viewer', component: PurchaseorderViewerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }