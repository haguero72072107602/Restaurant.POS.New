import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subscription} from "rxjs";
import {WebsocketService} from "@core/services/api/websocket.service";

@Component({
  selector: 'app-generic-info-events',
  templateUrl: './generic-info-events.component.html',
  styleUrls: ['./generic-info-events.component.scss']
})
export class GenericInfoEventsComponent implements OnInit, OnDestroy {
  public message!: string;
  private subscription: Subscription [] = [];

  constructor(
    public dialogRef: MatDialogRef<GenericInfoEventsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ws: WebsocketService
  ) {
    this.subscription.push(ws.evPaidPax.subscribe((next: any) => this.setMessage(next)))
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.map(value => value.unsubscribe())
  }

  private setMessage(next: any) {
    console.log('setMessage', next);
    if (next && next.message) this.message = next.message;
  }
}
