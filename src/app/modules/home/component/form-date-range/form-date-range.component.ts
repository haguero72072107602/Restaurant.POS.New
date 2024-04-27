import {Component} from '@angular/core';
import {SharedModule} from "@shared/shared.module";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-form-date-range',
  standalone: true,
  imports: [
    SharedModule,
    JsonPipe,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './form-date-range.component.html',
  styleUrl: './form-date-range.component.css'
})
export class FormDateRangeComponent {
  title = 'angular-mat-datepicker-range';

  dateRangeForm!: FormGroup;
  range = new FormGroup({
    fromDate: new FormControl('', Validators.required),
    toDate: new FormControl('', Validators.required)
  });

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.dateRangeForm = this.formBuilder.group({
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl('', Validators.required)
    });
  }

  onFormSubmit() {
    console.log('Is Form Invalid', this.dateRangeForm.invalid);
  }
}
