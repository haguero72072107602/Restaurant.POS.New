import {Pipe, PipeTransform} from '@angular/core';
import {Department} from "@models/department.model";
import {UserList} from "@models/userList";
import {Table} from "@models/table.model";


@Pipe({
  name: 'SearchTable'
})
export class SearchTablePipe implements PipeTransform {

  transform(value: Table[], ...args: any[]): Table[] {
    console.log("filter pipe user ", args[0]);
    console.log("filter value ", value);

    if (args[0] == "-99") return value;

    return value.filter((table: Table) =>
      table.posUserId?.toUpperCase() === args[0].toUpperCase());
  }

}
