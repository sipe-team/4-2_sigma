interface FilterControlsProps {
  currentFilter: string;
  currentSort: string;
  currentPage: string;
  availablePages: string[];
  onFilter: (value: string) => void;
  onSort: (value: string) => void;
  onPageChange: (value: string) => void;
  issueCount: number;
}

export const FilterControls = ({ 
  currentFilter, 
  currentSort, 
  currentPage, 
  availablePages, 
  onFilter, 
  onSort, 
  onPageChange, 
  issueCount 
}: FilterControlsProps) => (
  <div className="filters">
    <div className="filter-row">
      <span className="filter-label">이슈:</span>
      <select
        className="filter-select"
        value={currentFilter}
        onChange={(e) => onFilter(e.target.value)}
      >
        <option value="all">전체 보기</option>
        <option value="empty-layer">빈 레이어</option>
        <option value="naming-convention">네이밍 이슈</option>
        <option value="duplicate-name">중복명</option>
        <option value="deep-structure">깊은 구조</option>
      </select>

      <span className="filter-label">페이지:</span>
      <select
        className="filter-select"
        value={currentPage}
        onChange={(e) => onPageChange(e.target.value)}
      >
        <option value="all">전체 페이지</option>
        {availablePages.map(page => (
          <option key={page} value={page}>
            {page}
          </option>
        ))}
      </select>
    </div>
		<div className="filter-row">
			<span className="filter-label">정렬:</span>
      <select
        className="filter-select"
        value={currentSort}
        onChange={(e) => onSort(e.target.value)}
      >
        <option value="name">이름순</option>
        <option value="type">타입순</option>
        <option value="issue">문제 유형순</option>
        <option value="page">페이지순</option>
        <option value="depth">깊이순</option>
      </select>
		</div>
    <div className="filter-count">
      <span>{issueCount}</span>개 항목 표시 중
      {currentFilter !== "all" && <span> (이슈: {currentFilter})</span>}
      {currentPage !== "all" && <span> (페이지: {currentPage})</span>}
    </div>
  </div>
);
