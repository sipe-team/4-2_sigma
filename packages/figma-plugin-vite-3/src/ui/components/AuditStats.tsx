import type { AuditResult } from "@common/types";

interface AuditStatsProps {
  stats: AuditResult["stats"] | null;
}

export const AuditStats = ({ stats }: AuditStatsProps) => {
  if (!stats) return null;

  return (
    <div className="stats">
      <div className="stat-item">
        <span>전체 레이어:</span>
        <span><strong>{stats.totalLayers}</strong></span>
      </div>
      <div className="stat-item">
        <span>빈 레이어:</span>
        <span><strong>{stats.emptyLayers}</strong></span>
      </div>
      <div className="stat-item">
        <span>네이밍 이슈:</span>
        <span><strong>{stats.namingIssues}</strong></span>
      </div>
      <div className="stat-item">
        <span>중복명:</span>
        <span><strong>{stats.duplicateNames}</strong></span>
      </div>
      <div className="stat-item">
        <span>깊은 구조:</span>
        <span><strong>{stats.deepStructures}</strong></span>
      </div>
    </div>
  );
};