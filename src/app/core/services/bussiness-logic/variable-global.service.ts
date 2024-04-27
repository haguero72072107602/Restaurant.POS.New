import {Injectable} from "@angular/core";
import {CellClassParams, ColDef} from "ag-grid-community";
import {DateRanges} from "ngx-daterangepicker-material/daterangepicker.component";
import dayjs from "dayjs/esm";

@Injectable({
  providedIn: 'root',
})
export class VariableGlobalService {

  defaultColDef: ColDef = {
    resizable: true,
    suppressMovable: true,
    flex: 1,
    cellStyle: (params) => ({
      display: "flex",
      alignItems: "center"
    }),
    cellClass: "font-poppins font-bold",
    headerClass: "font-bold",
  };

  ranges: DateRanges = {
    ['Today']: [dayjs(), dayjs()],
    ['Yesterday']: [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    ['Last 7 Days']: [dayjs().subtract(6, 'days'), dayjs()],
    ['Last 30 Days']: [dayjs().subtract(29, 'days'), dayjs()],
    ['This Month']: [dayjs().startOf('month'), dayjs().endOf('month')],
    ['Last Month']: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
    ['Last 3 Month']: [dayjs().subtract(3, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  };

  /*
  cellStyle(params: CellClassParams<any, any>) {
    return {
      color: (params.data.unitInStock < 0) ? '#EA5252' : 'black',
      display: "flex",
      alignItems: "center",
    };
  }

   */
}
