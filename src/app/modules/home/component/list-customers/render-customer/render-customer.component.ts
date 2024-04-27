import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DatePipe, NgClass} from "@angular/common";
import {Router} from "@angular/router";
import {Customer} from "@models/customer.model";
import {CdkConnectedOverlay, CdkOverlayOrigin, Overlay, OverlayConfig} from "@angular/cdk/overlay";
import {OrderCustomerComponent} from "@modules/home/component/list-customers/order-customer/order-customer.component";
import {CardCustomerComponent} from "@modules/home/component/list-customers/card-customer/card-customer.component";
import {
  CellRenderCustomerButtonComponent
} from "@modules/home/component/list-customers/cell-render-customer-button/cell-render-customer-button.component";
import {CdkPortal, PortalModule} from "@angular/cdk/portal";


@Component({
  selector: 'render-customer',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    CdkConnectedOverlay,
    CdkOverlayOrigin,
    OrderCustomerComponent,
    CardCustomerComponent,
    CellRenderCustomerButtonComponent,
    PortalModule
  ],
  template: `
    <div
      [ngClass]="(selected) ?
                'bg-[#557AD9] text-white':
                'text-[#557AD9] bg-white'"
      class="relative w-[320px] text-[#557AD9] items-start duration-300 transform
             border-l-4 border-l-blue-900 hover:-translate-y-2 shadow my-auto rounded-[12px] "
         (click)="onSelecteCustomer()"
         (dblclick)="onOpenHistory()">

      <div class="flex flex-col h-full p-5  mt-2">
        <h6 class="mb-2 font-semibold leading-5">{{ customer.firstName }}</h6>
        <span class="mb-2 text-[12px] font-semibold leading-5">Email: {{ customer.email }}</span>
        <span class="mb-2 text-[12px] font-semibold leading-5">Phone: {{ customer.phone }}</span>
        <span class="mb-2 text-[12px] font-semibold leading-5">Street: {{ customer.address!.street }}</span>
        @if (customer.birthday) {
          <span
            class="mb-2 text-[12px] font-semibold leading-5">Birthday: {{ customer.birthday | date: 'MM/dd/yyyy' }}</span>
        }
      </div>

      @if (!customer.isActive) {
        <button class="absolute -top-2 -right-2 w-[38px] h-[38px] border border-red-600 bg-red-600 shadow-2xl shadow-black
                    rounded-full flex items-center justify-center"
                cdkOverlayOrigin
                #trigger="cdkOverlayOrigin"
        >
          <svg class="w-6 h-6 text-white dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
               width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd"
                  d="M15 7a2 2 0 1 1 4 0v4a1 1 0 1 0 2 0V7a4 4 0 0 0-8 0v3H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V7Zm-5 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z"
                  clip-rule="evenodd"/>
          </svg>
        </button>

        <ng-template cdkPortal>
          <render-customer [customer]="customer" />

        </ng-template>
      }
    </div>
  `,
  styleUrl: './render-customer.component.css'
})
export class RenderCustomerComponent {
  @Input() customer!: Customer;
  @Input() selected!: boolean;

  @Output() evSelectCustomer = new EventEmitter<Customer>();

  @ViewChild(CdkPortal) portal!: CdkPortal;
  detailOpen: boolean = false;

  constructor(
    private router: Router, private overlay: Overlay
  ) {

  }

  get isActiveCustomer() {
    return this.customer.isActive
  }

  onOpen() {
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      hasBackdrop: true
    });
    const overlayRef = this.overlay.create(config);

    overlayRef.attach(this.portal);
    overlayRef.backdropClick().subscribe(() => overlayRef.detach())

  }

  onSelecteCustomer() {
    this.evSelectCustomer.emit(this.customer);
  }

  onOpenHistory() {
    this.router.navigate(["/home/layout/customers/editCustomer/" + this.customer.id]);
  }


}
