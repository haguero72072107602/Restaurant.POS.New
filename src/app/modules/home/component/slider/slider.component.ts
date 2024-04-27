import {AfterViewInit, Component, Input, OnInit, signal} from '@angular/core';

export interface SlideModel {
  imgSrc: string;
  imgAlt: string;
}

@Component({
  standalone: true,
  selector: 'app-example-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, AfterViewInit {

  @Input() images: SlideModel[] = [];


  circle?: Element;
  slider?: Element;
  list?: Element;

  prev?: HTMLElement;
  next?: HTMLElement;

  items?: NodeListOf<Element>;
  count: number = 0;
  active: number = 1;
  leftTransform: number = 0;

  width_item: number = 250;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.circle = document.querySelector('.circle')!;
    this.slider = document.querySelector('.slider')!;
    this.list = document.querySelector('.list')!;

    this.prev = document.getElementById('prev')!;
    this.next = document.getElementById('next')!;

    this.items = document.querySelectorAll('.list .item');
    this.count = this.items!.length;
    this.active = 1;
    this.leftTransform = 0;

    this.width_item = this.items[this.active].clientWidth;

    console.log("asaa next", this.items);
    this.runCarousel();
  }

  prevClick() {
    console.log("prev", this.circle);
    this.active = this.active <= 0 ? 0 : this.active - 1;
    this.runCarousel();
  }

  nextClick() {
    console.log("next", this.items);
    this.active = this.active >= this.count - 1 ? this.count - 1 : this.active + 1;
    this.runCarousel();
  }

  runCarousel() {
    this.prev!.style.display = this.active == 0 ? 'none' : 'block';
    this.next!.style.display = this.active == this.count - 1 ? 'none' : 'block';

    let old_active = document.querySelector(".item.active");
    if (old_active) old_active.classList.remove("active");

    this.items![this.active].classList.add("active");

    this.leftTransform = this.width_item * (this.active - 1) * -1;
    (this.list! as HTMLElement).style.transform = `translateX(${this.leftTransform}px)`;
  }

  swiperLeft() {
    this.prevClick();
  }
}

