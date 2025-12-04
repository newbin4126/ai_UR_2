
export interface DataRow {
  [key: string]: string | number | null;
}

export interface ColumnStats {
  name: string;
  type: 'numeric' | 'categorical';
  missingCount: number;
  uniqueCount: number;
  mean?: number;
  min?: number;
  max?: number;
  samples: (string | number)[];
}

export interface DatasetMeta {
  fileName: string;
  rowCount: number;
  columns: string[];
  stats: Record<string, ColumnStats>;
}

export enum AppStep {
  UPLOAD = 'UPLOAD',
  SELECT_VARS = 'SELECT_VARS',
  DASHBOARD = 'DASHBOARD',
}

export interface PredictionResult {
  accuracy: number;
  auc: number;
  modelName: string;
  type?: 'classification' | 'regression'; // Added to distinguish model types
}

export interface BinData {
  bin: string;
  count: number;
}
