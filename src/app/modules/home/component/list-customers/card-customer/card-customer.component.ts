import {Component, inject, Inject, Input, OnInit} from '@angular/core';
import {ControlContainer, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ButtonDateComponent} from "@modules/home/component/button-date/button-date.component";
import {SharedModule} from "@shared/shared.module";
import {NgxTouchKeyboardModule} from "ngx-touch-keyboard";

@Component({
  selector: 'app-card-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonDateComponent,
    SharedModule,
    NgxTouchKeyboardModule,
  ],
  templateUrl: './card-customer.component.html',
  styleUrl: './card-customer.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, {skipSelf: true})
    }
  ]
})
export class CardCustomerComponent implements OnInit {

  @Input() controlKey!: string;
  formGroup!: FormGroup

  constructor(private parentContainer: ControlContainer) {
  }

  get parentFormGroup() {
    return this.parentContainer.control?.get(this.controlKey) as FormGroup;
  }

  ngOnInit(): void {
    this.formGroup = this.parentFormGroup;
  }

}
