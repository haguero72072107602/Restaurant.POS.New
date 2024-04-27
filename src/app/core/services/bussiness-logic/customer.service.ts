import {Injectable} from "@angular/core";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {Observable} from "rxjs";
import {InfoCustomer} from "@models/info-user.model";
import {Customer} from "@models/customer.model";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private dataStorage: DataStorageService) {
  }

  getAllCustomer(): Observable<Customer[]> {
    return this.dataStorage.getAllCustomer()
  }

  getCustomer(idCustomer: string): Observable<Customer> {
    return this.dataStorage.getCustomer(idCustomer)
  }

  deleteCustomer(idCustomer: string): Observable<Customer> {
    return this.dataStorage.deleteCustomerId(idCustomer)
  }

  addCustomer(customer: Customer): Observable<Customer[]> {
    return this.dataStorage.addCustomer(customer)
  }

  updateCustomer(customer: Customer): Observable<Customer[]> {
    return this.dataStorage.updateCustomer(customer);
  }

  customerSalesReport(id: string, fromDate: string, toDate: string): Observable<InfoCustomer> {
    return this.dataStorage.customerSalesReport(id, fromDate, toDate)
  }


}
