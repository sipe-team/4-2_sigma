import type { LayerIssue } from "@common/types";

export const filterIssues = (issues: LayerIssue[], filterValue: string): LayerIssue[] => {
  if (filterValue === "all") {
    return [...issues];
  }
  return issues.filter((issue) => issue.issue === filterValue);
};

export const filterByPage = (issues: LayerIssue[], pageValue: string): LayerIssue[] => {
  if (pageValue === "all") {
    return [...issues];
  }
  return issues.filter(issue => issue.page === pageValue);
};

export const sortIssues = (issues: LayerIssue[], sortValue: string): LayerIssue[] => {
  return issues.sort((a, b) => {
    switch (sortValue) {
      case "name":
        return a.name.localeCompare(b.name);
      case "type":
        return a.type.localeCompare(b.type);
      case "issue":
        return a.issue.localeCompare(b.issue);
      case "page":
        return a.page.localeCompare(b.page);
      case "depth":
        return (b.depth || 0) - (a.depth || 0);
      default:
        return 0;
    }
  });
};

export const getUniquePages = (issues: LayerIssue[]): string[] => {
  const pages = [...new Set(issues.map(issue => issue.page))];
  return pages.sort();
};

export const getBadgeInfo = (issueType: string) => {
  switch (issueType) {
    case "empty-layer":
      return { class: "badge-empty", text: "빈 레이어" };
    case "naming-convention":
      return { class: "badge-naming", text: "네이밍 이슈" };
    case "duplicate-name":
      return { class: "badge-duplicate", text: "중복명" };
    case "deep-structure":
      return { class: "badge-deep", text: "깊은 구조" };
    case "out-of-bounds":
      return { class: "badge-bounds", text: "경계 벗어남" };
    case "overlapping":
      return { class: "badge-overlap", text: "요소 겹침" };
    default:
      return { class: "badge-empty", text: "기타" };
  }
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

export const getIssueCount = (issues: LayerIssue[], filterValue: string): number => {
  if (filterValue === "all") {
    return issues.length;
  }
  return issues.filter((issue) => issue.issue === filterValue).length;
};