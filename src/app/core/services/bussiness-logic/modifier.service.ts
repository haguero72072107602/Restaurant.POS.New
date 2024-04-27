import {Injectable} from "@angular/core";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Observable} from "rxjs";
import {ModifiersGroup} from "@models/modifier.model";
import {Aggregate} from "@models/aggregate";

@Injectable({
  providedIn: 'root'
})
export class ModifierService {
  constructor(
    private dataStorage: DataStorageService,
    private sanitizer: DomSanitizer) {
  }

  getModifierGroup(): Observable<ModifiersGroup[]> {
    return this.dataStorage.getModifierGroup();
  }

  getModifierGroupById(modifierGroupById: string): Observable<ModifiersGroup> {
    return this.dataStorage.getModifierGroupById(modifierGroupById)
  }

  posModifierGroup(description: string, price: number, number: number): Observable<ModifiersGroup[]> {
    return this.dataStorage.posModifierGroup(description, price, number);
  }

  deleteModifierGroup(id: string): Observable<ModifiersGroup[]> {
    return this.dataStorage.deleteModifierGroup(id);
  }

  putModifierGroup(modifierGroup: ModifiersGroup) {
    return this.dataStorage.putModifierGroup(modifierGroup);
  }

  getModifiers(): Observable<Aggregate[]> {
    return this.dataStorage.getModifiers();
  }

  posMenuToGroupProduct(idMenu: string, idModifierGroup: string, price: number): Observable<ModifiersGroup[]> {
    return this.dataStorage.posMenuToGroupProduct(idMenu, idModifierGroup, price)
  }

  posProductToModifierGroup(idProduct: string, idModifierGroup: string, price: number): Observable<ModifiersGroup> {
    return this.dataStorage.posProductToModifierGroup(idProduct, idModifierGroup, price);
  }

  deleteElementModifierGroup(modifierId: string, aggregateId: string): Observable<ModifiersGroup> {
    return this.dataStorage.deleteElementModifierGroup(modifierId, aggregateId);
  }

  getModifierGroupByProduct(idProduct: string) {
    return this.dataStorage.getModifierGroupByProduct(idProduct);
  }

  deleteModifierGroupByMenu(idMenu: string, idModifierGroup: string) {
    return this.dataStorage.deleteModifierGroupByMenu(idMenu, idModifierGroup);
  }

  excludeModifierGroupHide(modifierGroup: ModifiersGroup[]) {
    const modifierGroupNotVisible = ['-99', '-100'];
    return modifierGroup.filter(mg => !modifierGroupNotVisible.includes(mg.id))
  }


}
