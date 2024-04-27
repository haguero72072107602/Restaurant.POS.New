import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {Invoice} from "@models/invoice.model";
import {UserrolEnum} from "@core/utils/userrol.enum";
import {AuthService} from "@core/services/api/auth.service";
import {NgClass} from "@angular/common";
import {ETXType} from "@core/utils/delivery.enum";

@Component({
  selector: 'app-scroll-earring',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './scroll-earring.component.html',
  styleUrl: './scroll-earring.component.css'
})
export class ScrollEarringComponent implements OnInit, AfterViewInit {
  @Output() evOpenInvoice = new EventEmitter<Invoice>();


  currentScrollPosition = 0;
  scrollAmount = 100;
  maxScroll: number = 0;

  sCont?: HTMLElement;
  hScroll?: HTMLElement;

  pendientInvoice: Invoice[] = [];

  constructor(
    private invoiceService: InvoiceService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.setDataPendingInvoice();
    this.ngAfterViewInit();
  }

  ngAfterViewInit(): void {
    this.sCont = document.querySelector<HTMLElement>(".storys-container")!;
    this.hScroll = document.querySelector<HTMLElement>(".horizontal-scroll")!;

    //this.maxScroll = -this.sCont!.offsetWidth + this.hScroll!.offsetWidth - 20;
    this.maxScroll = -this.sCont!.clientWidth + this.hScroll!.clientWidth;
    this.onClickHorizontal(2);
  }

  onClickHorizontal(number: number) {
    this.currentScrollPosition += (number * this.scrollAmount);

    console.log("Maximun scroll -> ", this.maxScroll);
    console.log("Position scroll -> ", this.currentScrollPosition)


    if (this.currentScrollPosition < 0) {
      this.currentScrollPosition = 0;
    }

    if (this.currentScrollPosition > this.maxScroll) {
      this.currentScrollPosition = this.maxScroll;
    }

    this.sCont!.style.left = this.currentScrollPosition + 'px';
  }

  onClickInvoice(invoice: Invoice) {
    console.log("Invoice pendient ", invoice);
    this.evOpenInvoice.emit(invoice);
  }

  getTableName(invoice: Invoice) {
    let nameTable = invoice?.labelTable?.replace("-", "") + "-"

    return invoice.labelTable === null ? "" : nameTable;
  }

  getNumberInvoice(invoice: Invoice) {
    const sigla = invoice.status === InvoiceStatus.IN_HOLD ? "H-" :
      invoice.status === InvoiceStatus.IN_PROGRESS ? "P-" : "C-";
    return sigla + this.getTableName(invoice) + invoice.receiptNumber.slice(-6);
  }

  getStylesInvoice(invoice: Invoice) {
    let strClass: string = "";

    switch (invoice.type) {
      case ETXType.DINEIN:
        strClass = "border-gray-500 bg-[#E0E6E9]"
        break;
      case ETXType.DELIVERY:
        strClass = "border-gray-500 bg-[#E0E6E9]"
        break;
      case ETXType.FAST_FOOD:
        strClass = "border-emerald-500 bg-emerald-500"
        break;
      case ETXType.PICKUP:
        strClass = "border-blue-500 bg-blue-250"
        break;
      case ETXType.RETAIL:
        strClass = "border-gray-500 bg-[#E0E6E9]"
        break;
    }
    return strClass;
  }

  setDataPendingInvoice() {
    this.invoiceService.pendingInvoice([InvoiceStatus.IN_PROGRESS, InvoiceStatus.IN_HOLD, InvoiceStatus.CREATED])
      .subscribe((next: Invoice[]) => {
        console.log("Pendient invoice", next);

        const roles: UserrolEnum[] = [UserrolEnum.ADMIN, UserrolEnum.SUPERVISOR];

        this.pendientInvoice = (roles.includes(this.authService.token.rol!))
          ? next
          : next.filter((item: Invoice) => {
            return item.applicationUserId === this.authService.token.user_id
          });

        this.currentScrollPosition = 0;

      }, error => {
      })
  }


}
