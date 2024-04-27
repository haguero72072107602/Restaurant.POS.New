import {Component, Input} from '@angular/core';
import {Aggregate} from "@models/aggregate";

@Component({
  selector: 'app-card-element-modifier-group',
  standalone: true,
  imports: [],
  templateUrl: './card-element-modifier-group.component.html',
  styleUrl: './card-element-modifier-group.component.css'
})
export class CardElementModifierGroupComponent {

  @Input() elementModifierGroup: Aggregate | undefined;

  delElementModifierGroup() {

  }
}
