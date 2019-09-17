import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductRestService } from './../../service/product-rest.service';
import { SignalRService } from './../../service/signal-r.service';
import { map, tap, filter, scan, retry, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Object;
  amountProductToCart: number = 0;
  amountProductToCartIsInvalid: boolean = false;
  errorMessage: string = '';
  availableQuantity: number = 0;
  productId: any;

  constructor(
    private route: ActivatedRoute,
    private productRest: ProductRestService,
    private signalRService: SignalRService) { }

  ngOnInit() {
    this.productId = this.route.snapshot.params.id;
    this.productRest.getProductById(this.productId).subscribe(data => {
      this.product = data;
      this.availableQuantity = (data as any).quantity;
    });

    this.signalRService.startConnection();
    this.signalRService.addProductQuantityAvailableListener(this.productId);

    this.signalRService.productSubject
      .pipe(
        filter(updatedProduct => updatedProduct.id == this.productId)
      )
      .subscribe(updatedProduct => {
        if (updatedProduct) {
          console.log("Updated Product => " + JSON.stringify(updatedProduct));

          this.availableQuantity = updatedProduct.quantity;
        }
      });
  }

  addProductToCart() {
    this.productRest.updateProductQuantity(this.productId, this.amountProductToCart).subscribe(() => {
      // this.product = data;
      // this.availableQuantity = (data as any).quantity;
    });
    // this.amountProductToChartIsInvalid = false;

    // if (this.amountProductToChart <= 0) {
    //   this.amountProductToChartIsInvalid = true;
    //   this.errorMessage = "Selected quantity must be greater than zero.";
    //   return;
    // }

    // if (this.amountProductToChart > this.product.quantityOnHand) {
    //   this.amountProductToChartIsInvalid = true;
    //   this.errorMessage = "Selected quantity is greater than available quantity."
    //   return;
    // }

    // this.shoppingCartService.addProduct(this.product, this.amountProductToChart);
    // this.amountProductToChart = 0;
  }
}
