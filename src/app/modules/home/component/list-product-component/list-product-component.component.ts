import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductComponent} from "@models/product-component.model";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";

@Component({
  standalone: true,
  selector: 'app-list-product-component',
  templateUrl: './list-product-component.component.html',
  styleUrl: './list-product-component.component.css'
})
export class ListProductComponentComponent extends AbstractInstanceClass {

  @Input() productComponent: ProductComponent | undefined;
  @Output() evDeleteComponentProduct = new EventEmitter<ProductComponent>();

  DeleteComponent() {
    //You are sure you want to remove this component
    this.evDeleteComponentProduct!.emit(this.productComponent)

  }
}
