import {Component, EventEmitter, Output} from '@angular/core';
import {ModifiersGroup} from "@models/modifier.model";
import {Dropdown} from "flowbite";
import {ModifierService} from "@core/services/bussiness-logic/modifier.service";
import {Aggregate} from "@models/aggregate";

@Component({
  selector: 'app-dropdown-element-modifier-group',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-element-modifier-group.component.html',
  styleUrl: './dropdown-element-modifier-group.component.css'
})
export class DropdownElementModifierGroupComponent {
  @Output() evSelectedElement = new EventEmitter<Aggregate>();

  public aggregates: Aggregate[] = [];
  public dropdown?: Dropdown;
  public titleSearch: string = "Search component";


  constructor(private modifierService: ModifierService) {
  }

  ngOnInit(): void {
    this.modifierService.getModifiers().subscribe((next: Aggregate[]) => {
      console.log("list aggregates", next);
      this.aggregates = next;
    });
  }

  ngAfterViewInit(): void {
    const $targetEl = document.getElementById('dropdownSearchModifier');
    const $triggerEl = document.getElementById('dropdownSearchButtonModifier');

    this.dropdown = new Dropdown($targetEl, $triggerEl);
  }


  selectItem(item: Aggregate) {
    this.titleSearch = item.name;
    this.dropdown?.hide();
    this.evSelectedElement?.emit(item);
  }
}
