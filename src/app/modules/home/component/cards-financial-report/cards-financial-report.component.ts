import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {CashSales, Functions, ICashSales, IFunctions, ISales, Sales} from "@models/financials";
import {ActivatedRoute} from "@angular/router";
import {DataStorageService} from "@core/services/api/data-storage.service";
import {CashService} from "@core/services/bussiness-logic/cash.service";
import {OperationsService} from "@core/services/bussiness-logic/operations.service";
import {InformationType} from "@core/utils/information-type.enum";
import {ReportsService} from "@core/services/bussiness-logic/reports.service";
import {DialogService} from "@core/services/bussiness-logic/dialog.service";
import {FinancialReport} from "@models/financials/financialReport.model";

@Component({
  standalone: true,
  selector: 'app-cards-financial-report',
  templateUrl: './cards-financial-report.component.html',
  styleUrl: './cards-financial-report.component.css'
})
export class CardsFinancialReportComponent  {
  @Input({required: true}) financialReport : FinancialReport | undefined;
}
