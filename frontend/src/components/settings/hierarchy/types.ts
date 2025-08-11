
export interface ColumnHeader {
  column: string;
  sampleData: string;
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
