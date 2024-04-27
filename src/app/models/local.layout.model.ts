import {Table} from "@models/table.model";

export interface LocalLayout {
  id?: string
  area: string
  usedTableNumber: number
  totalTableNumber: number
  usedChairNumber: number
  totalChairNumber: number
  tables: Table[]
  layoutType: number
}
