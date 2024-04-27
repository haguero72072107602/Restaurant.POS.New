import {EventEmitter, Injectable, Output} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {PageSidebarEnum} from "@core/utils/page-sidebar.enum";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  @Output() evChangeSearch = new EventEmitter<string>();
  /* Filter menu list*/
  filterDepartment: string = '-99';
  filterMeasure: string = '-99';
  filterAggregate: string = '-99';
  filterComponentCategories: string = '-99';
  filterComponentGModifiers: string = '-99';
  filterComponentMeasure: string = '-99';
  selectedSchedulerPromotion: string = '-99';
  selectedSchedulerHappyHour: string = '-99';
  selectedSchedulerByTime: string = '-99';
  selectedModifierGroup: string = '-99';
  private searchElement: string = "";
  private searchElement$: Subject<string> = new BehaviorSubject<string>(this.searchElement);
  private activatedElement: number = 0;
  private activatedElement$: Subject<number> = new BehaviorSubject<number>(this.activatedElement);
  private disableButtons$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  public searchObservable() {
    return this.searchElement$.asObservable();
  }

  public buttonsObservable() {
    return this.disableButtons$.asObservable();
  }

  public setStateButtons(enable: boolean) {
    return this.disableButtons$.next(enable);
  }

  public searchText(search: string) {
    this.searchElement = search;
    this.searchElement$.next(this.searchElement)
  }

  clearSearch() {
    this.searchElement = "";
    this.searchElement$.next(this.searchElement)
    this.evChangeSearch.emit(this.searchElement);
  }

  getSearch() {
    return this.searchElement;
  }


  public activatedObservable() {
    return this.activatedElement$.asObservable();
  }

  public setActivePage(activated: PageSidebarEnum) {
    this.activatedElement = activated;
    this.activatedElement$.next(this.activatedElement);
  }

  ClearFilterMenu() {
    this.filterDepartment = '-99';
    this.filterMeasure = '-99';
    this.filterAggregate = '-99';
  }

  ClearComponentFilter() {
    this.filterComponentCategories = '-99';
    this.filterComponentMeasure = '-99';
    this.filterComponentGModifiers = '-99';
  }

}
