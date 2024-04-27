import {Component} from '@angular/core';
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";
import {RestaurantService} from "@core/services/bussiness-logic/restaurant.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent extends AbstractInstanceClass {

  constructor(private restaurantService: RestaurantService) {
    super();

    this.sub$.push(this.restaurantService.sendAck().subscribe(
      next => console.log('sendAck', next), err => console.error(err)
    ));

  }
}
