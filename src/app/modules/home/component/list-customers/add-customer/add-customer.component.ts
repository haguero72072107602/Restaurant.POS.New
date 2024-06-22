import {Component, Inject, inject} from '@angular/core';
import {CardCustomerComponent} from "@modules/home/component/list-customers/card-customer/card-customer.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [
    CardCustomerComponent,
    ReactiveFormsModule
  ],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css',
})
export class AddCustomerComponent {

  textButton: string = "New";
  private formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.group({
    dataCustomer: this.formBuilder.group({
      firstName: this.formBuilder.control("", Validators.required),
      address: this.formBuilder.group({
        street: this.formBuilder.control("", {nonNullable: true, validators: [Validators.required]})
      }),
      phone: this.formBuilder.control(""),
      email: this.formBuilder.control("", [Validators.required, Validators.email]),
      birthday: this.formBuilder.control(new Date()),
      gender: this.formBuilder.control(0),
      preferredPaymentMethod: this.formBuilder.control(0),
      creditLimit: this.formBuilder.control(0),
      company: this.formBuilder.control(""),
      isActive: this.formBuilder.control(true),
      id: this.formBuilder.control(null),
    })
  })


  constructor(
    private dialogRef: MatDialogRef<AddCustomerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    if (data.openEdit) {
      this.formGroup!.patchValue({dataCustomer: data.customer});
      this.textButton = "Update"
    }
  }

  get validateForm() {
    return this.formGroup.valid
  }

  onCancelDialog() {
    this.dialogRef.close()
  }

  onProcessDialog() {
    if (this.formGroup.valid) {
      console.log("data form -> ", this.formGroup.getRawValue()!.dataCustomer);
      this.dialogRef.close(this.formGroup.getRawValue()!.dataCustomer)
    }
  }
}
