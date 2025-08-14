interface AuditButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const AuditButton = ({ onClick, loading }: AuditButtonProps) => (
  <button 
    type="button"
    className="button" 
    onClick={onClick} 
    disabled={loading}
  >
    {loading ? "검사 중..." : "검사 시작"}
  </button>
);
