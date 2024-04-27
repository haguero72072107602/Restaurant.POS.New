import {Injectable, Pipe, PipeTransform} from "@angular/core";
import {Inventory} from "@models/inventory";

@Pipe({
  name: 'FilterInventory'
})
@Injectable()
export class FilterInventoryPipe implements PipeTransform {
  transform(inventories: Inventory[], args: any[]): any {
    return inventories
      .filter(inventory => inventory.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);
  }
}
