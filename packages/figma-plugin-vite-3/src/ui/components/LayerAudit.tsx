// LayerAudit.tsx - 리팩토링된 메인 컴포넌트
import type React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { flushSync } from "react-dom";
import { PLUGIN } from "@common/networkSides";
import { UI_CHANNEL } from "@ui/app.network";
import type { LayerIssue, AuditResult } from "@common/types";
import { Header } from "./Header";
import { AuditButton } from "./AuditButton";
import { AuditStats } from "./AuditStats";
import { FilterControls } from "./FilterControls";
import { IssueList } from "./IssueList";
import { filterIssues, filterByPage, sortIssues, getUniquePages } from "@ui/utils/issue.utils";
import "./LayerAudit.scss";

export const LayerAudit: React.FC = () => {
  const [allIssues, setAllIssues] = useState<LayerIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<LayerIssue[]>([]);
  const [stats, setStats] = useState<AuditResult["stats"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [currentSort, setCurrentSort] = useState("name");
  const [currentPage, setCurrentPage] = useState("all");

  // 페이지 목록을 미리 계산
  const availablePages = useMemo(() => getUniquePages(allIssues), [allIssues]);

  // audit 결과 처리 함수
  const handleAuditResult = useCallback((result: AuditResult) => {
    console.log('Audit 결과 받음:', result.issues.length);
    
    // 동기적으로 상태 업데이트
    flushSync(() => {
      setAllIssues(result.issues);
      setStats(result.stats);
      setCurrentFilter("all");
      setCurrentSort("name");
      setCurrentPage("all");
    });
    
    // UI 상태는 별도로
    setLoading(false);
    setShowResults(true);
  }, []);

  useEffect(() => {
    // 메시지 핸들러 등록
    UI_CHANNEL.registerMessageHandler('auditResult', handleAuditResult);
    
    // 이 경우 cleanup이 필요 없을 수 있음
    // registerMessageHandler는 보통 한 번만 등록하는 방식
  }, [handleAuditResult]);

  // 필터링과 정렬을 통합 처리
  useEffect(() => {
    if (allIssues.length === 0) {
      console.log('allIssues가 비어있어서 필터링 스킵');
      return;
    }

    console.log('필터링 실행:', { 
      allIssuesLength: allIssues.length, 
      currentFilter, 
      currentSort,
      currentPage
    });
    
    // 1. 이슈 타입으로 필터링
    let result = filterIssues(allIssues, currentFilter);
    
    // 2. 페이지로 필터링
    result = filterByPage(result, currentPage);
    
    // 3. 정렬
    result = sortIssues(result, currentSort);
    
    console.log("필터링 결과:", { 
      이슈필터: currentFilter,
      페이지필터: currentPage, 
      결과개수: result.length
    });
    
    setFilteredIssues(result);
  }, [allIssues, currentFilter, currentSort, currentPage]);

  const runAudit = async () => {
    setLoading(true);
    setShowResults(false);
    try {
      const result = await UI_CHANNEL.request(PLUGIN, "runAudit", []);
      setAllIssues(result.issues);
      setStats(result.stats);
      setShowResults(true);
    } catch (error) {
      console.error("Audit failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectLayer = (layerId: string) => {
    UI_CHANNEL.emit(PLUGIN, "selectLayer", [layerId]);
  };

  const handleFilter = (filterValue: string) => {
    console.log('필터 변경:', { 현재: currentFilter, 요청: filterValue });
    flushSync(() => {
      setCurrentFilter(filterValue);
    });
  };

  const handleSort = (sortValue: string) => {
    console.log('정렬 변경:', { 현재: currentSort, 요청: sortValue });
    flushSync(() => {
      setCurrentSort(sortValue);
    });
  };

  const handlePage = (pageValue: string) => {
    console.log('페이지 변경:', { 현재: currentPage, 요청: pageValue });
    flushSync(() => {
      setCurrentPage(pageValue);
    });
  };

  return (
    <div className="layer-audit">
      <Header />
      <AuditButton onClick={runAudit} loading={loading} />

      {showResults && (
        <div className="results">
          <AuditStats stats={stats} />
          <FilterControls
            currentFilter={currentFilter}
            currentSort={currentSort}
            currentPage={currentPage}
            availablePages={availablePages}
            onFilter={handleFilter}
            onSort={handleSort}
            onPageChange={handlePage}
            issueCount={filteredIssues.length}
          />
          <IssueList
            issues={filteredIssues}
            allIssues={allIssues}
            onSelectLayer={selectLayer}
          />
        </div>
      )}

      {loading && <div className="loading">검사 중...</div>}
    </div>
  );
};