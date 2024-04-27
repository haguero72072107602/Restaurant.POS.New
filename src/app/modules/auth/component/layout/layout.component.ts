import {Component, OnInit} from '@angular/core';
import {ClockService} from '@core/utils/clock.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  public dateInformation?: Date;
  background: string = "./assets/background/oip.jpg";

  constructor(
    private clockService: ClockService) {
  }

  ngOnInit(): void {
    this.clockService.getDate
      .subscribe(date => {
        this.dateInformation = date;
      })


  }
}
