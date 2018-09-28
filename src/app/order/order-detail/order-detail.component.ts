import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../order.service';
import {OrderFirestoreService} from '../shared/order-firestore.service';
import {Observable} from 'rxjs';
import {ProductFirestoreService} from '../../product/shared/product-firestore.service';
import {UserService} from '../../user/shared/user.service';
import {LocalStorageService} from '../../shared/local-storage.service';
import {Order} from '../order.model';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../user/shared/auth.service';
import {ProductPerOrder} from '../productPerOrder.model';
import {NotificationService} from '../../shared/notification.service';



@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styles: []
})
export class OrderDetailComponent implements OnInit {

  productStore: any[];
  orderId: string;
  orderData: Order[];
  user: any;
  userId: string;
  //order: Observable<any>;
  order: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private orderFirestoreService: OrderFirestoreService,
    private productFireStoreService: ProductFirestoreService,
    private router: Router,
    private userService: UserService,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private notifier: NotificationService
  ) {


  }


  ngOnInit() {

    setTimeout(() => {
      this.user = this.userService.getCurrentUser();

      this.getProducts();
    }, 1000)


  }




  getProducts(){

    if (this.user) {
      this.orderFirestoreService.getUserOrder(this.user.uid).subscribe((res) =>{
        this.order = res[0];
      })
    }

    this.productStore = this.localStorageService.getData('products');


  }

  onEnterOrderData() {
    this.router.navigate(['/checkout']);
  }

  onDelete() {
    this.orderFirestoreService.clearScart(this.productStore);
    this.productStore = [];
    this.router.navigate(['/bestellung']);
  }

  onSaveScart(userId :string){
    this.orderFirestoreService.clearScartStorage(this.productStore);
    this.orderFirestoreService.saveProducts(userId, this.productStore);


  }


  onLoginWithOrder(form: NgForm) {

    this.authService.loginWithUserPassword(form.value.email, form.value.password)
      .then( userData => {

        if (userData && userData.user.emailVerified) {
          this.notifier.display('success', 'Login erfolgreich');

          setTimeout(() => {


            this.orderFirestoreService.creatNewUserOrder(userData.user.uid);
            this.orderFirestoreService.saveProducts(userData.user.uid, this.productStore);


            this.router.navigateByUrl('/bestellung');

          }, 2000);
        }

      })
      .catch( err => {
        console.log('error bs: ' + err);
      });


  }








}
