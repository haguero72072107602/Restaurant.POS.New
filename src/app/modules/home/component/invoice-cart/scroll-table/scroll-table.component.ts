import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Department} from "@models/department.model";
import {Table} from "@models/table.model";
import {InvoiceService} from "@core/services/bussiness-logic/invoice.service";
import {ColorsService} from "@core/services/bussiness-logic/colors.service";

@Component({
  selector: 'app-scroll-table',
  templateUrl: './scroll-table.component.html',
  styleUrls: ['./scroll-table.component.css']
})
export class ScrollTableComponent implements AfterViewInit, OnInit {
  @Input() table?: Table;
  @Input() numbers: number[] = [];
  @Input() typeLayput: number = 1;
  @Output() evSelectPosition = new EventEmitter<number>();
  @Output() evChangeTable = new EventEmitter<any>();

  tabsBox: Element | null = null;
  allTabs: NodeListOf<Element> | null = null;
  arrowIcons: NodeListOf<Element> | null = null;

  isDragging = false;
  numberSelect: number = 0;


  constructor(
    private invoiceService: InvoiceService,
    private colorsService: ColorsService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    this.tabsBox = document.querySelector(".tb_tabs-box")!;
    this.allTabs = this.tabsBox!.querySelectorAll(".tb_tab");
    this.arrowIcons = document.querySelectorAll(".tb_icon i");

    this.arrowIcons![0].parentElement!.style.display = "none"

    const handleIcons = (scrollVal: any) => {
      let maxScrollableWidth = this.tabsBox!.scrollWidth - this.tabsBox!.clientWidth;
      this.arrowIcons![0].parentElement!.style.display = scrollVal <= 0 ? "none" : "flex";
      this.arrowIcons![1].parentElement!.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex";
    }

    this.arrowIcons.forEach((icon: Element) => {
      icon.addEventListener("click", () => {
        // if clicked icon is left, reduce 350 from tabsBox scrollLeft else add
        let scrollWidth = this.tabsBox!.scrollLeft += icon.id === "tb_left" ? -40 : 40;
        handleIcons(scrollWidth);
      });
    });

    const dragging = (e: any) => {
      if (!this.isDragging) return;
      this.tabsBox!.classList.add("tb_dragging");
      this.tabsBox!.scrollLeft -= e.movementX;
      handleIcons(this.tabsBox!.scrollLeft)
    }

    const dragStop = () => {
      this.isDragging = false;
      this.tabsBox!.classList.remove("tb_dragging");
    }

    this.tabsBox!.addEventListener("mousedown", () => this.isDragging = true);
    this.tabsBox!.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
  }

  ngOnInit(): void {

    console.log("assign table -> ", this.table);
    //this.numbers = Array(this.table?.chairNumber);
    console.log("array chairs", this.numbers);
  }

  onTableChair(positionId: number) {
    this.numberSelect = positionId;
    this.evSelectPosition.emit(positionId);
    this.invoiceService.positionTable = positionId + 1;
  }

  getColor(position: number) {
    const color = "background: " + this.colorsService.getColor(position);
    return color;
  }

  onChangeTable() {
    this.evChangeTable.emit();
  }
}
