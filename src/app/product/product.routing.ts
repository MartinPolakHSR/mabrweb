import {Routes} from '@angular/router';
import {ProductListComponent} from './product-list/product-list.component';
import {ProductDetailComponent} from './product-detail/product-detail.component';
import {ProductNewComponent} from './product-new/product-new.component';
import {AdminGuard} from '../user/guards/admin.guard';


export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {path: 'list', component: ProductListComponent},
  {path: 'detail', component: ProductDetailComponent},
  {path: 'new', component: ProductNewComponent, canActivate: [AdminGuard]},
];
