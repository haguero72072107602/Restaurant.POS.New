export function thousandFormatter(value: any) {
  return Number(value).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

export function dateFormatter(value: any) {
  return value !== '' ? new Date(value).toLocaleString('en-US', {hour12: false}) : '';
}

export function dateLocalFormatter(value: any) {
  console.log('dateFormater', new Date(value).toLocaleString());
  return value !== '' ? new Date(value).toLocaleString() : '';
}

export function removeTFromISODate(date: string) {
  return date.split('.')[0].split(',')[0].replace('T', ' ');
}

export function dateRangeISO(date: string, initial: boolean = true) {
  return initial ? (date + ' 00:00:00') : (date + ' 23:59:59');
}

export function getFormatDate(date: Date, start?: boolean) {
  return date.toISOString().split('T')[0] + ((start) ? ' 00:00:00' : ' 23:59:59');
}

export function getFormatOnlyDate(date: Date) {
  return date.toISOString().split('T')[0];
}

export function getFormatOnlyDateMMDDYY(date: Date) {
  const allDate = date.toISOString().split('T')[0];

  return allDate.slice(5, 7) + "-" + allDate.slice(8, 10) + "-" + allDate.slice(0, 4);
}
