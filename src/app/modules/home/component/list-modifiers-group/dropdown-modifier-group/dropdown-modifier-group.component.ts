import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModifiersGroup} from "@models/modifier.model";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-dropdown-modifier-group',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './dropdown-modifier-group.component.html',
  styleUrl: './dropdown-modifier-group.component.css'
})
export class DropdownModifierGroupComponent {

  @Input() modifierGroup: ModifiersGroup | undefined;
  @Output() changeModifierGroup = new EventEmitter<ModifiersGroup>();

  updateModifierGroup($event: MouseEvent) {
    console.log("Modifier group ", this.modifierGroup)

    this.changeModifierGroup.emit(this.modifierGroup);
  }
}
