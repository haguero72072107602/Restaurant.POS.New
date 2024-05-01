import {Aggregate} from "@models/aggregate";


export interface GroupDetail {
  id?: string;
  number?: number;
  description?: string;
  aggregates?: Aggregate[];
  isDefault: boolean;
}
