
export interface ColumnHeader {
  column: string;
  sampleData: string;
}

export type HierarchyLevel = string; // Changed to string to support decimal notation

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

