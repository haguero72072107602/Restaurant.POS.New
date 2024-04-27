import {Pipe, PipeTransform} from '@angular/core';
import {Department} from "@models/department.model";
import {UserList} from "@models/userList";
import {Table} from "@models/table.model";
import {LocalLayout} from "@models/local.layout.model";


@Pipe({
  name: 'SearchLayout'
})
export class SearchLayoutPipe implements PipeTransform {

  transform(value: LocalLayout[], ...args: any[]): LocalLayout[] {
    if (args[0] == "-99") return value;
    return value.filter((layout: LocalLayout) => layout.id === args[0].toUpperCase());
  }

}
