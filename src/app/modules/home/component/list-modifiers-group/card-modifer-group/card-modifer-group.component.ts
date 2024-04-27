import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModifiersGroup} from "@models/modifier.model";
import {SearchService} from "@core/services/bussiness-logic/search.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-card-modifer-group',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './card-modifer-group.component.html',
  styleUrl: './card-modifer-group.component.css'
})
export class CardModiferGroupComponent {

  @Input() modifierGroup: ModifiersGroup | undefined;
  @Output() deleteModifierGroup = new EventEmitter<ModifiersGroup>();
  @Output() editingModifierGroup = new EventEmitter<ModifiersGroup>();

  constructor(public searchService: SearchService) {
  }

  editModifierGroup($event: MouseEvent) {
    $event.stopPropagation();
    this.searchService.selectedModifierGroup = this.modifierGroup?.id!;
    this.editingModifierGroup.emit(this.modifierGroup);
  }

  delModifierGroup($event: MouseEvent) {
    $event.stopPropagation();
    this.deleteModifierGroup.emit(this.modifierGroup);
  }

}
