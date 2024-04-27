import {Invoice} from './invoice.model';
import {InvoiceTransferStatusEnum} from "@core/utils/invoice-transfer-status.enum";
import {CompanyType} from "@core/utils/company-type.enum";

export interface IInvoicesByStates {
  user: string;
  invoices: Array<Invoice>;
  company?: CompanyType;
  total?: number;
  state?: InvoiceTransferStatusEnum;
  fromDate?: string;
  toDate?: string;
}

export class InvoicesByStates implements IInvoicesByStates {
  constructor(public user: string, public invoices: Array<Invoice>, public company?: CompanyType,
              public total?: number, public state?: InvoiceTransferStatusEnum, public fromDate?: string,
              public toDate?: string) {
  }
}
