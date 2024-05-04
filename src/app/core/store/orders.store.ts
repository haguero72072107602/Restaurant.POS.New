import {patchState, signalStore, withComputed, withMethods, withState} from "@ngrx/signals";
import {InvoiceStatus} from "@core/utils/invoice-status.enum";
import {DateRange} from "@angular/material/datepicker";
import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import {fnSetRangeDate} from "@core/utils/functions/functions";
import {Table} from "@models/table.model";
import {computed} from "@angular/core";

type OrdersState = {
  status: InvoiceStatus[];
  table: Table | null;
  dateRange: DateRange<Date>;
};

const initialState: OrdersState = {
  status: [InvoiceStatus.CREATED, InvoiceStatus.IN_PROGRESS, InvoiceStatus.IN_HOLD],
  table: null,
  dateRange: fnSetRangeDate(RangeDateOperation.LastDay)
};

export const OrdersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(({ status }) => ({
    invoiceStatus: computed(() => status()),
  })),


  withMethods((store) => ({

    selectedInvoiceStatus(value: InvoiceStatus)
    {
      return store.status().includes(value)
    },

    allInvoiceStatus()
    {
      //console.log("status", invoiceStatus)
      /*
      var result = Object. values(InvoiceStatus).filter( p=> {
        return isNaN(Number(p));
      })

      console.log(result);
      */


      const setAll = [
        InvoiceStatus.IN_PROGRESS,
        InvoiceStatus.PENDENT_FOR_AUTHORIZATION,
        InvoiceStatus.IN_HOLD,
        InvoiceStatus.PAID,
        InvoiceStatus.CANCEL,
        InvoiceStatus.CREATED,
        InvoiceStatus.PENDENT_FOR_PAYMENT,
        InvoiceStatus.REMOVE_ON_HOLD,
        InvoiceStatus.REFUND,
      ]

      patchState(store, (state) => ({ status: setAll}));
    },

    clearInvoiceStatus(){
      patchState(store, (state) => ({ status: [] }));
    },

    updateInvoiceStatus(value: InvoiceStatus): void {
      if (store.status().includes(value))
      {
        patchState(store, (state) => ({
          status: store.status().filter( i => i !== value )
        }));
      }
      else
      {
        store.status().push(value);
        patchState(store, (state) => ({
          status: store.status()
        }));
      }
    },

    updateTable( value: Table | null): void {
      patchState(store, (state) => ({ table: value }));
    },

    updateDateRange( value: DateRange<Date>): void {
      patchState(store, (state) => ({ dateRange: value }));
    },

  }))
);

