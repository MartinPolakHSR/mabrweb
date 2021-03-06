import {Component, Input, OnInit} from '@angular/core';
import {ProductService} from '../shared/product.service';
import {Product} from '../product.model';
import {ProductFirestoreService} from '../shared/product-firestore.service';
import {OrderFirestoreService} from '../../order/shared/order-firestore.service';
import {ProductPerOrder} from '../../order/productPerOrder.model';
import {UserService} from '../../user/shared/user.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  @Input() product: Product;
  @Input() count: number;

  productPerOrder: ProductPerOrder;

  constructor(private productService: ProductFirestoreService, private orderFirestoreService: OrderFirestoreService,
              private userService: UserService
              ) { }

  ngOnInit() {
  }

  updateActive(isActive: boolean) {
    this.productService.updateProduct(this.product.key, {active: isActive});
  }

  deleteProduct() {
    this.productService.deleteProduct(this.product.key);
  }

  updateProduct(event, product) {

  }


  addToBasket(product) {
    this.productPerOrder = {
      productId: product.key,
      qty: product.itemcount,
      description: product.name
    };
    this.orderFirestoreService.addProductToOrder(this.productPerOrder);
    alert(product.name + ' wurde dem Warenkorb hinzugefügt. ');
  }
}
