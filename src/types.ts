export interface TableRow {
  id: string;
  label: string;
  value: number;
  children?: TableRow[];
  originalValue?: number;
}

export interface TableData {
  rows: TableRow[];
}