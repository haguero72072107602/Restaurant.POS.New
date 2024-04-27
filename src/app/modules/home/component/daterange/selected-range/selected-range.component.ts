import {Component} from '@angular/core';
import {CdkConnectedOverlay, CdkOverlayOrigin} from "@angular/cdk/overlay";

@Component({
  selector: 'app-selected-range',
  standalone: true,
  imports: [
    CdkOverlayOrigin,
    CdkConnectedOverlay
  ],
  templateUrl: './selected-range.component.html',
  styleUrl: './selected-range.component.css'
})
export class SelectedRangeComponent {

}
