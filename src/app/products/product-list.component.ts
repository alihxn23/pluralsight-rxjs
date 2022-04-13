import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';

import {
  Observable,
  Subscription,
  EMPTY,
  of,
  combineLatest,
  Subject,
  BehaviorSubject,
} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductCategory } from '../product-categories/product-category';
import { ProductCategoryService } from '../product-categories/product-category.service';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  // errorMessage = '';
  // errorMessage$: undefined | Observable<string>;
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // products: Product[] = [];
  // sub!: Subscription;

  // products$ = this.productService.productsWithCategory$.pipe(
  //   catchError((err) => {
  //     this.errorMessage$ = of(err);
  //     console.log(`%c${err}`, `background: blue; color: white`);
  //     return EMPTY;
  //   })
  // );

  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$,
  ]).pipe(
    map(([products, selectedCategoryId]) =>
      products.filter((product) =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      console.log(`there is some problem with the categories`);
      return EMPTY;
    })
  );

  // productsSimpleFilter$ = this.productService.productsWithCategory$.pipe(
  //   map((item) =>
  //     item.filter((product) =>
  //       product.categoryId
  //         ? product.categoryId === this.selectedCategoryId
  //         : true
  //     )
  //   )
  // );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    // this.selectedCategoryId = +categoryId;
    // console.log(categoryId, this.selectedCategoryId);
    this.categorySelectedSubject.next(+categoryId);
  }
}
