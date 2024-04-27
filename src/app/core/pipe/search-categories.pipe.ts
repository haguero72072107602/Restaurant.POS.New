import {Pipe, PipeTransform} from '@angular/core';
import {Department} from "@models/department.model";


@Pipe({
  name: 'SearchCategories'
})
export class SearchCategoriesPipe implements PipeTransform {

  transform(value: Department[], ...args: any[]): Department[] {
    console.log()
    let search = value.filter((dept: Department) =>
      dept.name.toUpperCase().includes(args[0].trim().toUpperCase()));

    return args[0].trim().isEmpty ? value : search;
  }

}


