import type { LayerIssue } from "@common/types";

interface PageStatsProps {
  allIssues: LayerIssue[];
  currentPage: string;
}

export const PageStats = ({ allIssues, currentPage }: PageStatsProps) => {
  // 페이지별 통계 계산
  const getPageStats = (pageName: string) => {
    const pageIssues = pageName === "all" 
      ? allIssues 
      : allIssues.filter(issue => issue.page === pageName);

    return {
      totalIssues: pageIssues.length,
      emptyLayers: pageIssues.filter(issue => issue.issue === "empty-layer").length,
      namingIssues: pageIssues.filter(issue => issue.issue === "naming-convention").length,
      duplicateNames: pageIssues.filter(issue => issue.issue === "duplicate-name").length,
      deepStructures: pageIssues.filter(issue => issue.issue === "deep-structure").length,
      outOfBounds: pageIssues.filter(issue => issue.issue === "out-of-bounds").length,
      overlapping: pageIssues.filter(issue => issue.issue === "overlapping").length,
    };
  };

  const stats = getPageStats(currentPage);

  if (currentPage === "all") {
    return null; // 전체 보기일 때는 메인 통계 사용
  }

  return (
    <div className="page-stats">
      <div className="page-stats-header">
        <h4>📄 {currentPage} 페이지 통계</h4>
      </div>
      <div className="page-stats-grid">
        <div className="page-stat-item">
          <span className="stat-label">총 문제:</span>
          <span className="stat-value total">{stats.totalIssues}</span>
        </div>
        <div className="page-stat-item">
          <span className="stat-label">빈 레이어:</span>
          <span className="stat-value empty">{stats.emptyLayers}</span>
        </div>
        <div className="page-stat-item">
          <span className="stat-label">네이밍:</span>
          <span className="stat-value naming">{stats.namingIssues}</span>
        </div>
        <div className="page-stat-item">
          <span className="stat-label">중복명:</span>
          <span className="stat-value duplicate">{stats.duplicateNames}</span>
        </div>
        <div className="page-stat-item">
          <span className="stat-label">깊은 구조:</span>
          <span className="stat-value deep">{stats.deepStructures}</span>
        </div>
        <div className="page-stat-item">
          <span className="stat-label">경계 벗어남:</span>
          <span className="stat-value bounds">{stats.outOfBounds}</span>
        </div>
        <div className="page-stat-item">
          <span className="stat-label">요소 겹침:</span>
          <span className="stat-value overlap">{stats.overlapping}</span>
        </div>
      </div>
    </div>
  );
};