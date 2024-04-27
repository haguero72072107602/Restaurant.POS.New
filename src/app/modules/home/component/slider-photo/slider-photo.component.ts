import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {SliderImage} from "@models/slider-image.model";
import {AuthService} from "@core/services/api/auth.service";
import {UserList} from "@models/userList";
import {SafeUrlPipe} from "@core/pipe/safeUrl.pipe";

@Component({
  selector: 'app-slider-photo',
  standalone: true,
  imports: [
    SafeUrlPipe
  ],
  templateUrl: './slider-photo.component.html',
  styleUrl: './slider-photo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderPhotoComponent implements AfterViewInit, OnInit {

  @Output() evuserNameActive = new EventEmitter<SliderImage>();
  images: SliderImage[] = [];

  items?: NodeListOf<Element>;
  next?: HTMLElement;
  prev?: HTMLElement;

  active?: number;

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.authService.getUsersList().subscribe((nextUser: UserList[]) => {
      nextUser.map((item, index) => {

        //const image = 'data:image/jpg;base64, ' + item.image;

        const newUser: SliderImage = {
          id: item.posUserId,
          userName: item.firstName!,
          imgSrc: item.image,
          imgAlt: 'slider' + index
        }
        this.images.push(newUser)
      });

      this.cd.detectChanges();
      this.items = document.querySelectorAll(".slider .item");
      this.active = Math.floor(this.items!.length / 2);
      this.next = document.getElementById('next')!;
      this.prev = document.getElementById('prev')!;
      this.loadShow();

      this.emitUserActive(this.images![this.active]);
    });

  }

  loadShow() {
    let i;
    let stt = 0;

    (this.items![this.active!] as HTMLElement).style.transform = `translateY(${10}px)`;
    (this.items![this.active!] as HTMLElement).style.zIndex = '100';
    (this.items![this.active!] as HTMLElement).style.filter = 'none';
    (this.items![this.active!] as HTMLElement).style.opacity = '1';

    for (i = this.active! + 1; i < this.items?.length!; i++) {
      stt++;
      if (stt <= 4) {
        (this.items![i] as HTMLElement).style.transform =
          `translateX(${125 * stt}px) scale(${1 - 0.25 * stt}) perspective(16px) rotateY(-1deg)`;
        (this.items![i] as HTMLElement).style.zIndex = '1';
        (this.items![i] as HTMLElement).style.filter = 'blur(3px)';
        //(this.items![i] as HTMLElement).style.opacity = String(stt > 2 ? 0 : 0.06);
      }
    }

    stt = 0;

    for (i = this.active! - 1; i >= 0; i--) {
      stt++;
      if (stt <= 4) {
        (this.items![i] as HTMLElement).style.transform =
          `translateX(${-125 * stt}px) scale(${1 - 0.25 * stt}) perspective(16px) rotateY(-1deg)`;
        (this.items![i] as HTMLElement).style.zIndex = '1';
        (this.items![i] as HTMLElement).style.filter = 'blur(3px)';
        //(this.items![i] as HTMLElement).style.opacity = '0.6'/*(stt > 2 ? 0 : 0.06).toString(2);*/
      }
    }
  }

  emitUserActive(user: SliderImage) {
    this.evuserNameActive.emit(user);
    this.loadShow();
  }

  nextClick(user: SliderImage) {
    this.active = this.active! + 1 < this.items?.length! ? this.active! + 1 : this.active;
    this.emitUserActive(user);
  }

  prevClick(user: SliderImage) {
    this.active = this.active! - 1 >= 0 ? this.active! - 1 : this.active;
    this.emitUserActive(user);
  }

  changeActive(i: number, user: SliderImage) {
    this.active = i;
    this.emitUserActive(user);
  }
}
