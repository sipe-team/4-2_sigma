import type { LayerIssue } from "@common/types";
import { IssueItem } from "./IssueItem";

interface IssueListProps {
  issues: LayerIssue[];
  allIssues: LayerIssue[];
  onSelectLayer: (layerId: string) => void;
}

export const IssueList = ({ issues, allIssues, onSelectLayer }: IssueListProps) => {
  console.log("IssueList 렌더링:", { 
    issues개수: issues.length, 
    렌더링시간: new Date().toISOString()
  });

  if (issues.length === 0) {
    return (
      <div className="issues">
        <div className="empty-state">
          {allIssues.length === 0
            ? "🎉 모든 레이어가 규칙에 맞습니다!"
            : "선택한 필터에 해당하는 문제가 없습니다."
          }
        </div>
      </div>
    );
  }

  return (
    <div className="issues">
      {issues.map((issue, index) => (
        <IssueItem
          key={`${issue.id}-${issue.name}-${issue.issue}-${index}`}
          issue={issue}
          onSelect={() => onSelectLayer(issue.id)}
        />
      ))}
    </div>
  );
};