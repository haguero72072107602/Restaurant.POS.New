import {Component, Input} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProgressCircleComponent} from "@modules/home/component/progress-circle/progress-circle.component";

@Component({
  standalone: true,
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  imports: [
    MatProgressSpinnerModule,
    ProgressCircleComponent
  ],
  styleUrls: ['./progress-spinner.component.css']
})
export class ProgressSpinnerComponent {
  @Input() showMessage: boolean = true;
}
