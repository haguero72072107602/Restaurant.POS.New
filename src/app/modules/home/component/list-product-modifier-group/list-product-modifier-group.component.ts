import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ModifiersGroup} from "@models/modifier.model";
import {AbstractInstanceClass} from "@core/utils/abstract-instance-class.service";

@Component({
  standalone: true,
  selector: 'app-list-product-modifier-group',
  templateUrl: './list-product-modifier-group.component.html',
  styleUrl: './list-product-modifier-group.component.css'
})
export class ListProductModifierGroupComponent extends AbstractInstanceClass {
  @Input() productModifiersGroup: any | undefined;
  @Output() evDeleteModifierGroupByMenu = new EventEmitter<ModifiersGroup>();

  DeleteComponent() {
    //You are sure you want to remove this component
    this.evDeleteModifierGroupByMenu!.emit(this.productModifiersGroup)

  }

}
