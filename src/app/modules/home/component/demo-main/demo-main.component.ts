import {Component} from '@angular/core';
import {
  bounceAnimation,
  bounceInAnimation,
  bounceInDownAnimation,
  bounceInLeftAnimation,
  bounceInRightAnimation,
  bounceInUpAnimation,
  bounceInUpOnEnterAnimation,
  bounceOutAnimation,
  bounceOutDownAnimation,
  bounceOutLeftAnimation,
  bounceOutRightAnimation,
  bounceOutUpAnimation, collapseAnimation, collapseHorizontallyAnimation,
  fadeInAnimation,
  fadeInDownAnimation,
  fadeInDownBigAnimation,
  fadeInLeftAnimation,
  fadeInLeftBigAnimation,
  fadeInRightAnimation,
  fadeInRightBigAnimation,
  fadeInUpAnimation,
  fadeInUpBigAnimation,
  fadeOutAnimation,
  fadeOutDownAnimation,
  fadeOutDownBigAnimation,
  fadeOutLeftAnimation,
  fadeOutLeftBigAnimation,
  fadeOutRightAnimation,
  fadeOutRightBigAnimation,
  fadeOutUpAnimation,
  fadeOutUpBigAnimation,
  flashAnimation,
  flipAnimation,
  flipInXAnimation,
  flipInYAnimation,
  flipOutXAnimation,
  flipOutYAnimation,
  headShakeAnimation,
  heartBeatAnimation, hingeAnimation, hueRotateAnimation, jackInTheBoxAnimation,
  jelloAnimation,
  lightSpeedInAnimation,
  lightSpeedOutAnimation,
  pulseAnimation, rollInAnimation, rollOutAnimation, rotateAnimation,
  rotateInAnimation,
  rotateInDownLeftAnimation,
  rotateInDownRightAnimation,
  rotateInUpLeftAnimation,
  rotateInUpRightAnimation,
  rotateOutAnimation,
  rotateOutDownLeftAnimation,
  rotateOutDownRightAnimation,
  rotateOutUpLeftAnimation,
  rotateOutUpRightAnimation,
  rubberBandAnimation,
  shakeAnimation,
  slideInDownAnimation,
  slideInLeftAnimation,
  slideInRightAnimation,
  slideInUpAnimation,
  slideOutDownAnimation,
  slideOutLeftAnimation,
  slideOutRightAnimation,
  slideOutUpAnimation,
  swingAnimation,
  tadaAnimation,
  wobbleAnimation,
  zoomInAnimation,
  zoomInDownAnimation,
  zoomInLeftAnimation,
  zoomInRightAnimation,
  zoomInUpAnimation,
  zoomOutAnimation, zoomOutDownAnimation, zoomOutLeftAnimation, zoomOutRightAnimation, zoomOutUpAnimation
} from "@core/lib";
import {SharedModule} from "@shared/shared.module";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {AngularImgComponent} from "@modules/home/component/angular-img/angular-img.component";
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

@Component({
  selector: 'app-demo-main',
  standalone: true,
  templateUrl: './demo-main.component.html',
  styleUrls: ['./demo-main.component.scss'],
  imports: [
    SharedModule,
    MatSelectModule,
    FormsModule,
    AngularImgComponent,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  animations: [
    bounceInUpOnEnterAnimation({anchor: 'enter1'}),
    bounceInUpOnEnterAnimation({anchor: 'enter2', delay: 100}),
    bounceInUpOnEnterAnimation({anchor: 'enter3', delay: 200}),
    bounceAnimation(),
    flashAnimation(),
    pulseAnimation({anchor: 'pulse'}),
    rubberBandAnimation(),
    shakeAnimation(),
    swingAnimation(),
    tadaAnimation(),
    wobbleAnimation(),
    jelloAnimation(),
    heartBeatAnimation(),
    headShakeAnimation(),
    bounceInAnimation(),
    bounceInDownAnimation(),
    bounceInLeftAnimation(),
    bounceInRightAnimation(),
    bounceInUpAnimation(),
    bounceOutAnimation(),
    bounceOutDownAnimation(),
    bounceOutLeftAnimation(),
    bounceOutRightAnimation(),
    bounceOutUpAnimation(),
    fadeInAnimation(),
    fadeInDownAnimation(),
    fadeInDownBigAnimation(),
    fadeInLeftAnimation(),
    fadeInLeftBigAnimation(),
    fadeInRightAnimation(),
    fadeInRightBigAnimation(),
    fadeInUpAnimation(),
    fadeInUpBigAnimation(),
    fadeOutAnimation(),
    fadeOutDownAnimation(),
    fadeOutDownBigAnimation(),
    fadeOutLeftAnimation(),
    fadeOutLeftBigAnimation(),
    fadeOutRightAnimation(),
    fadeOutRightBigAnimation(),
    fadeOutUpAnimation(),
    fadeOutUpBigAnimation(),
    flipAnimation(),
    flipInXAnimation(),
    flipInYAnimation(),
    flipOutXAnimation(),
    flipOutYAnimation(),
    lightSpeedInAnimation(),
    lightSpeedOutAnimation(),
    rotateInAnimation(),
    rotateInDownLeftAnimation(),
    rotateInDownRightAnimation(),
    rotateInUpLeftAnimation(),
    rotateInUpRightAnimation(),
    rotateOutAnimation(),
    rotateOutDownLeftAnimation(),
    rotateOutDownRightAnimation(),
    rotateOutUpLeftAnimation(),
    rotateOutUpRightAnimation(),
    slideInDownAnimation(),
    slideInLeftAnimation(),
    slideInRightAnimation(),
    slideInUpAnimation(),
    slideOutDownAnimation(),
    slideOutLeftAnimation(),
    slideOutRightAnimation(),
    slideOutUpAnimation(),
    zoomInAnimation(),
    zoomInDownAnimation(),
    zoomInLeftAnimation(),
    zoomInRightAnimation(),
    zoomInUpAnimation(),
    zoomOutAnimation(),
    zoomOutDownAnimation(),
    zoomOutLeftAnimation(),
    zoomOutRightAnimation(),
    zoomOutUpAnimation(),
    hingeAnimation(),
    jackInTheBoxAnimation(),
    rollInAnimation(),
    rollOutAnimation(),
    // other
    collapseAnimation(),
    collapseHorizontallyAnimation(),
    rotateAnimation(),
    rotateAnimation({anchor: 'rotate90', degrees: 90}),
    hueRotateAnimation(),
    hueRotateAnimation({anchor: 'hueButton', duration: 20000})
  ]
})
export class DemoMainComponent {
  options = [
    {
      label: 'Attention Seekers',
      animations: ['bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello', 'heartBeat', 'headShake']
    },
    {
      label: 'Bouncing Entrances',
      animations: ['bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp']
    },
    {
      label: 'Bouncing Exits',
      animations: ['bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp']
    },
    {
      label: 'Fading Entrances',
      animations: [
        'fadeIn',
        'fadeInDown',
        'fadeInDownBig',
        'fadeInLeft',
        'fadeInLeftBig',
        'fadeInRight',
        'fadeInRightBig',
        'fadeInUp',
        'fadeInUpBig'
      ]
    },
    {
      label: 'Fading Exits',
      animations: [
        'fadeOut',
        'fadeOutDown',
        'fadeOutDownBig',
        'fadeOutLeft',
        'fadeOutLeftBig',
        'fadeOutRight',
        'fadeOutRightBig',
        'fadeOutUp',
        'fadeOutUpBig'
      ]
    },
    {
      label: 'Flippers',
      animations: ['flip', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY']
    },
    {
      label: 'Lightspeed',
      animations: ['lightSpeedIn', 'lightSpeedOut']
    },
    {
      label: 'Rotating Entrances',
      animations: ['rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight']
    },
    {
      label: 'Rotating Exits',
      animations: ['rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight']
    },
    {
      label: 'Sliding Entrances',
      animations: ['slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight']
    },
    {
      label: 'Sliding Exits',
      animations: ['slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight']
    },
    {
      label: 'Zoom Entrances',
      animations: ['zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp']
    },
    {
      label: 'Zoom Exits',
      animations: ['zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp']
    },
    {
      label: 'Specials',
      animations: ['hinge', 'jackInTheBox', 'rollIn', 'rollOut']
    },
    {
      label: 'Other',
      animations: ['collapse', 'collapseHorizontally', 'rotate', 'rotate90', 'rotate720', 'hueRotate']
    }
  ];
  animation = 'rubberBand';
  animationState = false;
  animationWithState = false;
  hueBtnState = false;

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
      this.animationWithState = !this.animationWithState;
    }, 1);
  }
}
