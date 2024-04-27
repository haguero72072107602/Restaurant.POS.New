import {Pipe, PipeTransform} from '@angular/core';
import {Product} from "@models/product.model";


@Pipe({
  name: 'SearchProducts'
})
export class SearchProductsPipe implements PipeTransform {

  transform(products: Product[], args: any[]): any {
    return products
      .filter(product => product.description!.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);

  }

}
