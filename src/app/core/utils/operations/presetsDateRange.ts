import {RangeDateOperation} from "@core/utils/operations/rangeDateOperation";
import dayjs from "dayjs/esm";
import moment from "moment";

export const presetsDateRange = [
  {
    rangeDate: RangeDateOperation.Day,
    label: 'Today',
    /*
    range: {
      start: new Date(),
      end: new Date(),
    },
    */
  },
  {
    rangeDate: RangeDateOperation.LastDay,
    label: 'Last yesterday',
    /*
    range: {
      start: (() => {
        const date = dayjs().toDate();
        date.setDate(date.getDate() - 1);
        return date;
      })(),
      end: dayjs().toDate(),
    },
    */
  },
  {
    rangeDate: RangeDateOperation.Last7Days,
    label: 'Last 7 days',
    /*
    range: {
      start: (() => {
        const date = dayjs().toDate();
        date.setDate(date.getDate() - 7);
        return date;
      })(),
      end: dayjs().toDate(),
    },
    */
  },
  {
    rangeDate: RangeDateOperation.ThisMonth,
    label: 'Month',
    /*
    range: {
      start: (() => {
        const date = dayjs().toDate();
        date.setMonth(date.getMonth() - 1);
        return date;
      })(),
      end: dayjs().toDate(),
    },
    */
  },
  {
    rangeDate: RangeDateOperation.LastMonth,
    label: 'Last month',
    /*
    range: {
      start: (() => {
        const date = dayjs().toDate();
        date.setMonth(date.getMonth() - 1);
        return date;
      })(),
      end: dayjs().toDate(),
    },
    */
  },
  {
    rangeDate: RangeDateOperation.Last3Month,
    label: 'Last 3 month',
    /*
    range: {
      start: (() => {
        const date = dayjs().toDate();
        date.setMonth(date.getMonth() - 3);
        return date;
      })(),
      end: dayjs().toDate(),
    },
    */
  }
  ,
  {
    rangeDate: RangeDateOperation.Year,
    label: 'This year',
    /*
    range: {
      start: (() => {
        const date = dayjs().toDate();
        date.setMonth(date.getMonth() - 12);
        return date;
      })(),
      end: dayjs().toDate(),
    },
    */
  },
];
