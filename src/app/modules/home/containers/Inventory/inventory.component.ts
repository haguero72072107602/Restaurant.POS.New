import {Component} from '@angular/core';
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";
import {SearchService} from "@core/services/bussiness-logic/search.service";

@Component({
  selector: 'app-Inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent {
  selectOption: number = 0;

  constructor(
    private searchService: SearchService
  ) {
    this.searchService.setActivePage(PageSidebarEnum.INVENTORY)
  }
}
