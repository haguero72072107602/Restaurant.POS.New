import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Department} from "@models/department.model";
import {map} from "rxjs/operators";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-scroll-buttons',
  templateUrl: './scroll-buttons.component.html',
  standalone: true,
  imports: [
    NgClass
  ],
  styleUrls: ['./scroll-buttons.component.css']
})
export class ScrollButtonsComponent implements AfterViewInit {

  @Input() departments: Department[] = [];
  @Input() numberSelect: string = 'All';
  @Output() evSelectDepartment = new EventEmitter<string>();

  tabsBox: Element | null = null;
  allTabs: NodeListOf<Element> | null = null;
  arrowIcons: NodeListOf<Element> | null = null;

  isDragging = false;


  constructor() {
  }

  ngAfterViewInit(): void {
    this.tabsBox = document.querySelector(".tabs-box")!;
    this.allTabs = this.tabsBox!.querySelectorAll(".tab");
    this.arrowIcons = document.querySelectorAll(".icon i");

    this.arrowIcons![0].parentElement!.style.display = "none"

    const
      handleIcons = (scrollVal: any) => {
        let maxScrollableWidth = this.tabsBox!.scrollWidth - this.tabsBox!.clientWidth;
        this.arrowIcons![0].parentElement!.style.display = scrollVal <= 0 ? "none" : "flex";
        this.arrowIcons![1].parentElement!.style.display = maxScrollableWidth - scrollVal <= 1 ? "none" : "flex";
      }

    this.arrowIcons.forEach(
        (icon: Element) => {
          icon
            .addEventListener( "click", () => {
                // if clicked icon is left, reduce 350 from tabsBox scrollLeft else add
                let scrollWidth = this.tabsBox!.scrollLeft += icon.id === "left" ? -340 : 340;
                handleIcons(scrollWidth);
              }
            )
          ;
        });


    /*
    this.allTabs.forEach( tab => {
      tab.addEventListener("click", () =>{
        this.tabsBox?.querySelector(".active")?.classList.remove("active");
        tab.classList.add("active");
      })
    })
    */


    const dragging = (e: any) => {
      if (!this.isDragging) return;
      this.tabsBox!.classList.add("dragging");
      this.tabsBox!.scrollLeft -= e.movementX;
      handleIcons(this.tabsBox!.scrollLeft)
    }

    const dragStop = () => {
      this.isDragging = false;
      this.tabsBox!.classList.remove("dragging");
    }

    this.tabsBox!.addEventListener("mousedown", () => this.isDragging = true);
    this.tabsBox!.addEventListener("mousemove", dragging);
    document.addEventListener("mouseup", dragStop);
  }

  onDepartament(id: string ) {
    this.evSelectDepartment.emit(id);
  }

}
