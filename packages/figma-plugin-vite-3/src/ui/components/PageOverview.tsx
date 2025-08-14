import type { LayerIssue } from "@common/types";

interface PageOverviewProps {
  allIssues: LayerIssue[];
}

export const PageOverview = ({ allIssues }: PageOverviewProps) => {
  // 페이지별 데이터 생성
  const pageData = [...new Set(allIssues.map(issue => issue.page))]
    .sort()
    .map(pageName => {
      const pageIssues = allIssues.filter(issue => issue.page === pageName);
      return {
        name: pageName,
        totalIssues: pageIssues.length,
        criticalIssues: pageIssues.filter(issue => 
          issue.issue === "out-of-bounds" || issue.issue === "overlapping"
        ).length,
        namingIssues: pageIssues.filter(issue => issue.issue === "naming-convention").length,
        structureIssues: pageIssues.filter(issue => 
          issue.issue === "deep-structure" || issue.issue === "empty-layer"
        ).length,
      };
    });

  return (
    <div className="page-overview">
      <div className="overview-header">
        <h4>📊 페이지별 개요</h4>
      </div>
      <div className="overview-table">
        <div className="table-header">
          <span>페이지</span>
          <span>총 문제</span>
          <span>레이아웃</span>
          <span>네이밍</span>
          <span>구조</span>
        </div>
        {pageData.map(page => (
          <div key={page.name} className="table-row">
            <span className="page-name">{page.name}</span>
            <span className="total-count">{page.totalIssues}</span>
            <span className="critical-count">{page.criticalIssues}</span>
            <span className="naming-count">{page.namingIssues}</span>
            <span className="structure-count">{page.structureIssues}</span>
          </div>
        ))}
      </div>
    </div>
  );
};