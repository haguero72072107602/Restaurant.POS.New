import {Component} from '@angular/core';
import {OperationsService} from "@core/services/bussiness-logic/operations.service";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent {
  constructor(private operationService: OperationsService) {
  }
}
