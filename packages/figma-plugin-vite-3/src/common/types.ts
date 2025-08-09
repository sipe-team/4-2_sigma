export interface LayerIssue {
  id: string;
  name: string;
  type: string;
  issue:
    | "empty-layer"
    | "naming-convention"
    | "duplicate-name"
    | "deep-structure";
  category?: string;
  description: string;
  page: string;
  depth?: number;
}

export interface AuditResult {
  issues: LayerIssue[];
  stats: {
    totalLayers: number;
    emptyLayers: number;
    namingIssues: number;
    duplicateNames: number;
    deepStructures: number;
  };
}
