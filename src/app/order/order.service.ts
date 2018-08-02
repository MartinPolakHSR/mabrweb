import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from 'angularfire2/database';

import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private dbListPath = '/orders';
  private dbProductsPerOrderPath = '/productsPerOrder';

  ordersRef: AngularFireList<Order> = null;
  orderRef: AngularFireObject<Order> = null;
  productsPerOrderRef: AngularFireObject<any> = null;


  constructor(private db: AngularFireDatabase) {
    this.ordersRef = db.list(this.dbListPath);
  }


  createOrder(order: Order): void {
    this.ordersRef.push(order);
  }

  getOrderList(): AngularFireList<Order> {
    return this.ordersRef;
  }

  updateOrder(key: string, value: any): void {
    this.ordersRef
      .update(key, value)
      .then( () => this.handleLog('Update successful'))
      .catch(error => this.handleError(error));
  }

  deleteOrder(key: string): void {
    this.ordersRef
      .remove(key)
      .then( () => this.handleLog('Delete successful'))
      .catch(error => this.handleError(error));
  }

  deleteAllOrders(): void {
    this.ordersRef.remove()
      .then( () => this.handleLog('deleteAll successful'))
      .catch(error => this.handleError(error));
  }


  getOrder(id) {
    const dbOrderPath = '/orders/' + id;
    console.log(dbOrderPath);
    return this.orderRef = this.db.object<Order>(dbOrderPath);

  }
  getProductsPerOrder(id) {
    const dbProductsPerOrderPath = '/productsPerOrder/' + id;
    return this.productsPerOrderRef = this.db.object(dbProductsPerOrderPath);

  }

  getOrderListByName(): AngularFireList<Order> {
    const ordersRef = this.db.list<Order>(this.dbListPath,
      ref => ref.orderByChild('name')
    );
    return ordersRef;
  }


  private handleError(error) {
    console.error(error);
  }

  private handleLog(msg) {
    console.log(msg);
  }

}
