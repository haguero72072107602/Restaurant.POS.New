import {Aggregate} from "@models/aggregate";

export interface ModifiersGroup {
  id: string;
  number: number;
  description: string;
  aggregates: Aggregate[];
  isDefault: boolean;
}

