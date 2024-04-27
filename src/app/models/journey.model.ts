import {EOperationType} from "@core/utils/operation.type.enum";


export interface Journey {
  operationType: EOperationType;
  entityName: string;
  description?: string;
}


