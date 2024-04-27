import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModifiersGroup} from "@models/modifier.model";

@Component({
  selector: 'app-card-modifer-group',
  standalone: true,
  imports: [],
  templateUrl: './card-modifer-group.component.html',
  styleUrl: './card-modifer-group.component.css'
})
export class CardModiferGroupComponent {
  @Input() modifierGroup: ModifiersGroup | undefined;
  @Output() deleteModifierGroup = new EventEmitter<ModifiersGroup>();
  @Output() editingModifierGroup = new EventEmitter<ModifiersGroup>();


  editModifierGroup($event: MouseEvent) {
    $event.stopPropagation();
    this.editingModifierGroup.emit(this.modifierGroup);
  }

  delModifierGroup($event: MouseEvent) {
    $event.stopPropagation();
    this.deleteModifierGroup.emit(this.modifierGroup);
  }

}
