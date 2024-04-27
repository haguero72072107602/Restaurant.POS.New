import {AfterViewInit, Component, OnInit} from '@angular/core';

import {Swiper} from 'swiper';
import {Observable, ReplaySubject} from "rxjs";

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit, AfterViewInit {

  currentScrollPosition = 0;
  scrollAmount = 220;
  maxScroll: number = 0;

  sCont?: HTMLElement;
  hScroll?: HTMLElement;
  slides?: any[] = [];
  base64Output?: string;

  ngAfterViewInit(): void {
    this.sCont = document.querySelector<HTMLElement>(".storys-container")!;
    this.hScroll = document.querySelector<HTMLElement>(".horizontal-scroll")!;

    this.maxScroll = -this.sCont!.offsetWidth + this.hScroll!.offsetWidth;
    this.onClickHorizontal(2);
  }

  onClickHorizontal(number: number) {
    this.currentScrollPosition += (number * this.scrollAmount);

    if (this.currentScrollPosition < 0) {
      this.currentScrollPosition = 0;
    }

    if (this.currentScrollPosition > this.maxScroll) {
      this.currentScrollPosition = this.maxScroll;
    }


    this.sCont!.style.left = this.currentScrollPosition + 'px';
  }

  ngOnInit(): void {
    this.slides = [
      {image: "assets/food2.jpg"},
      {image: "https://swiperjs.com/demos/images/nature-2.jpg"},
      {image: "https://swiperjs.com/demos/images/nature-3.jpg"},
      {image: "https://swiperjs.com/demos/images/nature-4.jpg"},
      /*{image: "https://swiperjs.com/demos/images/nature-5.jpg"},
      {image: "https://swiperjs.com/demos/images/nature-6.jpg"},
      {image: "https://swiperjs.com/demos/images/nature-7.jpg"},
      {image: "https://swiperjs.com/demos/images/nature-8.jpg"},*/
    ]
  }

  onFileSelected(event: any) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.base64Output = base64;
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event!.target!.result!.toString()!));
    return result;
  }


}
