
export interface ColumnHeader {
  column: string;
  sampleData: string;
}

export type HierarchyLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';

export interface ColumnMapping {
  column: string;
  level: HierarchyLevel | null;
}

export interface TableRowData {
  id?: string | number;
  sku?: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

export interface HierarchyTableViewProps {
  tableName: string;
  data: TableRowData[];
  columns: string[];
  combinedHeaders: ColumnHeader[];
}
