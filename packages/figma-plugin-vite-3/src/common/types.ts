export interface LayerIssue {
  id: string;
  name: string;
  type: string;
  issue:
    | "empty-layer"
    | "naming-convention"
    | "duplicate-name"
    | "deep-structure"
    | "overlapping"
    | "out-of-bounds";
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
    outOfBoundsElements: number;   
    overlappingElements: number;
  };
}
