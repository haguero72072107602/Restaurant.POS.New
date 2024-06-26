import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GridOptions, GridApi} from 'ag-grid-community';
import {PaymentOpEnum} from "@core/utils/operations";
import {PaymentMethodEnum} from "@core/utils/operations/payment-method.enum";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {thousandFormatter, dateFormatter} from "@core/utils/functions/transformers";
import {CompanyType} from "@core/utils/company-type.enum";

@Component({
  selector: 'sales-empl',
  templateUrl: './sales-empl.component.html',
  styleUrls: ['./sales-empl.component.scss']
})
export class SalesEmplComponent implements OnInit {
  @Input() employes?: Array<any>;
  @Output() selectEmployed = new EventEmitter<string>();
  @Output() selectPayment = new EventEmitter<string>();
  @Output() selectInvoice = new EventEmitter<string>();
  @Input() emplSel: any;
  @Input() listType: 'grid' | 'button' = 'button';
  pTypes = [
    {label: 'ALL', value: ''},
    {label: PaymentOpEnum.CASH, value: PaymentMethodEnum.CASH},
    {label: PaymentOpEnum.CREDIT_CARD, value: PaymentMethodEnum.CREDIT_CARD},
    {label: PaymentOpEnum.DEBIT_CARD, value: PaymentMethodEnum.DEBIT_CARD}
  ]
  public gridOptions?: GridOptions;
  columnDefs: any;
  bottomData = [{
    receiptNumber: 'Total',
    date: '',
    total: 0,
    tips: 0
  }];
  listButtonData: {
    invoice?: any[], label?: string, detail?: string, subdetail?: string, extradetail?: string
  } = {
    invoice: [], label: '', detail: '', subdetail: '', extradetail: ''
  };
  sizePage = 12;
  page = 1;
  //private gridApi?: GridApi | undefined;
  private gridApi?: any;

  constructor(private dataStorage: DataStorageService, private cashService: CashService) {
    this.updateGridOptions();
  }

  private _sales?: Array<any>;

  get sales() {
    return this._sales!;
  }

  @Input()
  set sales(data) {
    this._sales = data;
    if (this._sales) this.setData();
  }

  ngOnInit() {
    this.gridApi! = this.gridOptions!.api;
  }

  select(ev: any) {
    //if(ev.value !== undefined) this.selectEmployed.emit(ev.value);
    this.selectEmployed.emit(ev.value);
  }

  selectPaymentType(ev: any) {
    //if(ev.value !== undefined) this.selectEmployed.emit(ev.value);
    this.selectPayment.emit(ev);
  }

  invoiceToReview(ev: any) {
    console.log('invoiceToReview', ev);
    this.selectInvoice.emit(ev.receiptNumber);
  }

  thousandFormatter(params: any) {
    return thousandFormatter(params.value);
    //Number(params.value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

  }

  dateFormatter(params: any) {
    return dateFormatter(params.value)
    //params.value !== '' ? new Date(params.value).toLocaleString('en-US', {hour12: false}) : '';
  }

  updateGridOptions() {
    this.gridOptions = <GridOptions>{
      rowData: [],
      onGridReady: () => {
        if (this.cashService.config.sysConfig.companyType !== CompanyType.RESTAURANT) {
          this.showTip(false);
        }
        //this.gridOptions!.api!.sizeColumnsToFit();
      },
      onRowClicked: (ev) => {
        // this.invoiceService.invoiceProductSelected = this.gridOptions.api.getSelectedRows().length > 0;
        if (ev.data.receiptNumber)
          this.selectInvoice.emit(ev.data.receiptNumber);
        else
          console.error('Receipt number not specified')
      },
      onBodyScroll: (ev) => {
        //this.gridOptions!.api!.sizeColumnsToFit();
      },
      rowHeight: 50,
      rowStyle: {'font-size': '16px'}
    };
    this.createColumnDefs();
  }

  showTip(show: boolean) {
    //this.gridOptions!.columnApi!.setColumnVisible('tips', show);
    //this.gridOptions!.api!.sizeColumnsToFit();

    //this.gridOptions.columnApi.setColumnVisible('tips', show);
    //this.gridOptions.api.sizeColumnsToFit();
    //this.gridOptions.alignedGrids.push(this.gridOptions);
  }

  setPage(ev: any) {
    this.page = ev;
  }

  /*onPrint() {
    console.log('Print invoices by user', this.emplSel);
    if(this.emplSel){
      this.dataStorage.printInvoiceByUser(this.emplSel.id).subscribe(next => {
        console.log(next);
      }, error1 => {
        console.error('getSales', error1);
      });
    } else {
      console.log('Debe seleccionar un empleado');
    }

  }*/

  paymentMethodFilter(ev: any) {
    console.log('paymentMethodFilter', ev);
    this.page = 1;
    this.selectPaymentType(ev.value);
  }

  private createColumnDefs() {
    this.columnDefs = [
      {
        headerName: 'Receipt number',
        field: 'receiptNumber',
        width: 210
      },
      {
        headerName: 'Datetime',
        field: 'date',
        width: 220,
        valueFormatter: this.dateFormatter
      },
      {
        headerName: 'Total',
        field: 'total',
        type: 'numericColumn',
        width: 120,
        valueFormatter: this.thousandFormatter
      },
      {
        headerName: 'Tips',
        field: 'tips',
        type: 'numericColumn',
        width: 120
      },
      {
        headerName: 'Payments',
        field: 'payments',
        width: 200
      }
    ];
  }

  private setData() {
    console.log('setData', this.sales);

    if (this.listType === 'grid') {
      // Set footer data for grid
      let salesTotal = 0;
      let tipsTotal = 0;
      this.sales.forEach((v, i) => {
        this.sales[i].total = (v.total).toFixed(2);
        salesTotal += +this.sales[i].total;
        this.sales[i]['tips'] = (v.tips ? v.tips : 0.00).toFixed(2);
        tipsTotal += +this.sales[i]['tips'];
        this.sales[i]['payments'] = (v.payments ? v.payments.join(" ") : "");
      });

      this.bottomData[0].total = +salesTotal.toFixed(2);
      this.bottomData[0].tips = +tipsTotal.toFixed(2);
      //this.gridOptions!.api!.setRowData(this.sales!);
      //this.gridOptions!.api!.sizeColumnsToFit();
    } else {
      // Prepare data for buutons list
      this.sales!.map(sale => sale.date = dateFormatter(sale.date));
      this.listButtonData!['invoice'] = this.sales;
      this.listButtonData['label'] = 'receiptNumber';
      this.listButtonData['detail'] = 'total';
      this.listButtonData['subdetail'] = 'date';
      this.listButtonData['extradetail'] = 'payments';
    }
  }
}
