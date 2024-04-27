import {EventEmitter, Injectable, Output} from '@angular/core';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@aspnet/signalr';
import {Subscription, timer} from 'rxjs';
import {CLIENTVIEW, EVENTS, serverURL} from "@core/utils/url.path.enum";
import {ScannerData} from "@models/scanner.model";
import {TypeToastrEnum} from "@core/utils/type.toastr.enum";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {SchedulerNotification} from "@models/scheduler-notification.model";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  connection: HubConnection;
  connectionClientView: HubConnection;
  connected?: boolean;
  duration = 3000;
  retry_max_count = 5;
  retry_current = 0;

  // Events
  @Output() evScanner = new EventEmitter<any>();
  @Output() evInvoiceUpdated = new EventEmitter<any>();
  @Output() evInvoiceSynced = new EventEmitter<any>();
  @Output() evOperation = new EventEmitter<any>();
  @Output() evPaidPax = new EventEmitter<any>();
  @Output() evStationStatus = new EventEmitter<any>();
  @Output() evScannerPaidClose = new EventEmitter<any>();
  @Output() evClientClose = new EventEmitter<any>();
  @Output() evReconnect = new EventEmitter<any>();
  @Output() evTableLayout = new EventEmitter<any>();
  @Output() evScheduler = new EventEmitter<SchedulerNotification[]>();

  constructor(
    private dialogService: DialogService
  ) {
    this.connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(serverURL + EVENTS)
      .build();

    this.connectionClientView = new HubConnectionBuilder()
      .configureLogging(LogLevel.Information)
      .withUrl(serverURL + CLIENTVIEW)
      .build();
    this.start();
  }

  start() {
    // Connection for events
    this.setConnectionEvents(this);
    // Connection for entity
    this.setConnectionClient(this);
    // Subscribe scanner event
    this.receiveScanner();
    // Subscribe operation event
    this.receiveOperation();
    // Subscribe invoice event
    this.receiveInvoice();
    // Subscribe invoice synced event
    this.receiveInvoiceSynced();
    // Subscribe paid event
    this.receivePaidPax();
    // Subscribe station status event
    this.receiveStationStatus();
    // Subscribe stop event
    this.receiveConnectionStop();
    // Subscribe stop client
    this.receiveConnectionClientStop();
    // Subscribe ack event
    this.receiveACK();
    // Notification
    this.receiveNotification();
  }

  toastMessage(type: TypeToastrEnum, title?: string, message?: string) {
    this.dialogService.toastMessage(type, title, message);
  }

  setConnectionEvents(context?: any) {
    this.connection.start().then(function () {
      console.log('Connected! websocket', context.connection);
      context.connected = true;
      //Send ack
      context.sendACK();
      context.toastMessage(TypeToastrEnum.INFO, "Established communication with the backend")
    }).catch(function (err) {
      context.evScannerPaidClose.emit();
      context.connected = false;
      context.toastMessage(TypeToastrEnum.ERROR, "Error connect to backend")
      return console.error(err.toString());
    });
  }

  setConnectionClient(context = this) {
    this.connectionClientView.start().then(function (e) {
      console.log('Connected View!', e);
      context.connected = true;
    }).catch(function (err) {
      context.connected = false;
      context.evClientClose.emit(context.duration);
      context.retryConnection();
      return console.error(err.toString());
    });
  }

  receiveScanner() {
    this.connection.on('scanner-event', (data: ScannerData) => {
      console.log('scanner-event', data.message);
      this.evScanner.emit(data);
    });
  }

  receiveOperation() {
    this.connectionClientView.on('operation-event', (data: any) => {
      console.log('operation-event', data);
      this.evOperation.emit(data);
    });
  }

  receiveInvoice() {
    this.connectionClientView.on('app-invoice', (data: any) => {
      console.log('invoice-updated-event', data);
      this.evInvoiceUpdated.emit(data);
    });
  }

  receiveInvoiceSynced() {
    this.connection.on('invoice-synced', (data: any) => {
      console.log('invoice-synced-event', data);
      this.evInvoiceSynced.emit(data);
    });
  }

  receiveACK() {
    this.connection.on('ack', (data: any) => {
      console.log('receive ack', data);
      this.evTableLayout.emit(data);
    });
  }

  sendACK() {
    console.log('send ack');
    this.connection.send('ack', 'table layout');
  }

  receivePaidPax() {
    this.connection.on('paid-credit', data => {
      console.log('paid-credit-event', data);
      this.evPaidPax.emit(data);
    });
  }

  receiveStationStatus() {
    this.connection.on('station-status', (data: any) => {
      console.log('station-status', data);
      this.evStationStatus.emit(data);
    });
  }

  receiveNotification() {
    this.connection.on('notification-scheduler', (data: SchedulerNotification[]) => {
      console.log('receive notification user', data);
      this.evScheduler.emit(data);
    });
  }

  receiveConnectionStop() {
    this.connection.onclose((e) => {
      console.log('close connection ws', e);
      this.connected = false;
      this.evScannerPaidClose.emit(e);
    });
  }

  receiveConnectionClientStop() {
    this.connectionClientView.onclose((e) => {
      console.log('close connection client view ws', e);
      this.connected = false;
      // this.evClientClose.emit(e);
      this.retryConnection();
    });
  }

  retryConnection() {
    const time = timer(this.duration);
    const sub = time.subscribe((n) => {
      this.retry_current++;
      (this.retry_current < this.retry_max_count) ? this.setConnectionClient() : this.finishRetry(sub);
    });
  }

  finishRetry(sub: Subscription) {
    console.log('finishRetry');
    sub.unsubscribe();
    this.retry_current = 0;
    this.evClientClose.emit(0);
  }

  isConnected(): boolean {
    return this.connected!;
  }

  stop(): void {
    this.connection.stop();
  }


}
