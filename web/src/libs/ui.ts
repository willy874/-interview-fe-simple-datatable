import type { TableColumnCtx } from "element-plus"

export interface TableScope<D = object> {
  $index: number
  cellIndex: number
  expanded: boolean
  row: D
  column: TableColumnCtx<D>
}

export interface SortChangeInfo<T extends object> {
  column: TableColumnCtx<T>
  prop: keyof T extends string ? keyof T : string
  order: 'ascending' | 'descending' | null
}
