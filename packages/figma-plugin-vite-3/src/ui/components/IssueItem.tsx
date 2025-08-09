import { LayerIssue } from "@common/types";
import { getBadgeInfo, escapeHtml } from "@ui/utils/issue.utils";

interface IssueItemProps {
	issue: LayerIssue;
	onSelect: () => void;
}

export const IssueItem = ({ issue, onSelect }: IssueItemProps) => {
	const badgeInfo = getBadgeInfo(issue.issue);

	return (
		// biome-ignore lint/a11y: 클릭 가능한 이슈 카드
		<div className="issue-item" onClick={onSelect}>
			<div className="issue-name">{escapeHtml(issue.name)}</div>
			<div className="issue-type">{issue.type}</div>
			<div className="issue-description">
				<span className={`badge ${badgeInfo.class}`}>
					{badgeInfo.text}
				</span>{" "}
				{escapeHtml(issue.description)}
			</div>
			{issue.category && (
				<div className="issue-category">
					상세: {escapeHtml(issue.category)}
				</div>
			)}
			<div className="issue-meta">
				페이지: {escapeHtml(issue.page)}
				{issue.depth !== undefined && ` | 깊이: ${issue.depth}단계`}
			</div>
		</div>
	);
};