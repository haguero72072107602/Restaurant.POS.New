import {Component, Input} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  standalone: true,
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  imports: [
    MatProgressSpinnerModule
  ],
  styleUrls: ['./progress-spinner.component.css']
})
export class ProgressSpinnerComponent {
  @Input() showMessage: boolean = true;
}
