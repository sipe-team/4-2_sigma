import type { LayerIssue } from "@common/types";

interface PageTabsProps {
  allIssues: LayerIssue[];
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const PageTabs = ({ allIssues, currentPage, onPageChange }: PageTabsProps) => {
  // 페이지별 이슈 개수 계산
  const getPageIssueCount = (pageName: string) => {
    return allIssues.filter(issue => issue.page === pageName).length;
  };

  // 고유 페이지 목록
  const pages = [...new Set(allIssues.map(issue => issue.page))].sort();
  const totalIssues = allIssues.length;

  return (
    <div className="page-tabs">
      <div className="page-tabs-header">
        <span className="tabs-title">페이지별 보기</span>
      </div>
      <div className="page-tabs-container">
        <button
          type="button"
          className={`page-tab ${currentPage === "all" ? "active" : ""}`}
          onClick={() => onPageChange("all")}
        >
          <span className="tab-name">전체</span>
          <span className="tab-count">{totalIssues}</span>
        </button>
        
        {pages.map(page => {
          const issueCount = getPageIssueCount(page);
          return (
            <button
              type="button"
              key={page}
              className={`page-tab ${currentPage === page ? "active" : ""}`}
              onClick={() => onPageChange(page)}
            >
              <span className="tab-name">{page}</span>
              <span className="tab-count">{issueCount}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
