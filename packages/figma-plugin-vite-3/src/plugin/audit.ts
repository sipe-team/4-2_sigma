import { LayerIssue, AuditResult } from "@common/types";

// 네이밍 규칙 체크 함수
function checkNamingConvention(name: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // 1. 기본 유효성 검사
  if (name.trim().length === 0) {
    issues.push("빈 이름");
  }
  if (name.trim().length === 1) {
    issues.push("너무 짧은 이름 (1글자)");
  }
  if (name.length > 50) {
    issues.push("너무 긴 이름 (50글자 초과)");
  }

  // 2. 공백 관련 규칙
  if (name.includes("  ")) {
    issues.push("연속 공백");
  }
  if (name.startsWith(" ")) {
    issues.push("앞쪽 공백");
  }
  if (name.endsWith(" ")) {
    issues.push("뒤쪽 공백");
  }
  if (name.includes("\t")) {
    issues.push("탭 문자 포함");
  }
  if (name.includes("\n")) {
    issues.push("줄바꿈 문자 포함");
  }

  // 3. Figma 기본 이름들 (영문)
  const defaultNames = [
    "Component",
    "Rectangle",
    "Ellipse",
    "Frame",
    "Group",
    "Vector",
    "Text",
    "Image",
    "Line",
    "Star",
    "Polygon",
  ];
  for (const defaultName of defaultNames) {
    if (name.includes(defaultName)) {
      issues.push(`기본 이름 (${defaultName})`);
    }
  }

  // 4. Figma 기본 이름들 (한글)
  const koreanDefaults = [
    "사각형",
    "원형",
    "프레임",
    "그룹",
    "텍스트",
    "이미지",
  ];
  for (const koreanDefault of koreanDefaults) {
    if (name.includes(koreanDefault)) {
      issues.push(`기본 이름 (${koreanDefault})`);
    }
  }

  // 5. 숫자 패턴들
  if (name.match(/^Layer \d+$/)) issues.push("기본 패턴 (Layer 숫자)");
  if (name.match(/^Group \d+$/)) issues.push("기본 패턴 (Group 숫자)");
  if (name.match(/^Frame \d+$/)) issues.push("기본 패턴 (Frame 숫자)");
  if (name.match(/^Component \d+$/)) issues.push("기본 패턴 (Component 숫자)");
  if (name.match(/^Rectangle \d+$/)) issues.push("기본 패턴 (Rectangle 숫자)");
  if (name.match(/^Ellipse \d+$/)) issues.push("기본 패턴 (Ellipse 숫자)");
  if (name.match(/^Vector \d+$/)) issues.push("기본 패턴 (Vector 숫자)");
  if (name.match(/^\d+$/)) issues.push("숫자만 사용");

  // 6. 복사본 패턴들
  if (name.match(/Copy$/)) issues.push("복사본 (Copy)");
  if (name.match(/copy$/)) issues.push("복사본 (copy)");
  if (name.match(/ Copy \d+$/)) issues.push("복사본 (Copy 숫자)");
  if (name.match(/ copy \d+$/)) issues.push("복사본 (copy 숫자)");
  if (name.match(/복사본$/)) issues.push("복사본 (한글)");
  if (name.match(/ 복사본 \d+$/)) issues.push("복사본 (한글 숫자)");

  // 7. 임시/테스트 이름들
  if (name.match(/^temp/i)) issues.push("임시 이름 (temp)");
  if (name.match(/^test/i)) issues.push("테스트 이름 (test)");
  if (name.match(/^임시/)) issues.push("임시 이름 (한글)");
  if (name.match(/^테스트/)) issues.push("테스트 이름 (한글)");
  if (name.match(/^asdf/i)) issues.push("키보드 타이핑 (asdf)");
  if (name.match(/^qwer/i)) issues.push("키보드 타이핑 (qwer)");

  // 8. 특수문자 제한
  const forbiddenChars = [
    "@",
    "#",
    "$",
    "%",
    "&",
    "*",
    "?",
    "<",
    ">",
    "|",
    "\\",
    "/",
  ];
  for (const char of forbiddenChars) {
    if (name.includes(char)) {
      issues.push(`금지된 특수문자 (${char})`);
    }
  }

  // 9. 연속 특수문자
  if (name.match(/[._-]{2,}/)) {
    issues.push("연속된 특수문자");
  }
  if (name.match(/^[._-]/)) {
    issues.push("특수문자로 시작");
  }
  if (name.match(/[._-]$/)) {
    issues.push("특수문자로 끝남");
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

// 빈 레이어 체크
function isEmptyLayer(node: SceneNode): boolean {
  if (node.type === "TEXT") {
    return node.characters.trim() === "";
  }

  if ("children" in node) {
    return node.children.length === 0;
  }

  if ("width" in node && "height" in node) {
    return node.width === 0 || node.height === 0;
  }

  return false;
}

// 프레임 경계를 벗어난 요소 체크
function checkOutOfBounds(node: SceneNode, frame: FrameNode): boolean {
  return node.x < 0 || node.y < 0 || 
         node.x + node.width > frame.width ||
         node.y + node.height > frame.height;
}

// 두 노드가 겹치는지 확인
function checkNodeOverlap(nodeA: SceneNode, nodeB: SceneNode): boolean {
  const aLeft = nodeA.x;
  const aRight = nodeA.x + nodeA.width;
  const aTop = nodeA.y;
  const aBottom = nodeA.y + nodeA.height;
  
  const bLeft = nodeB.x;
  const bRight = nodeB.x + nodeB.width;
  const bTop = nodeB.y;
  const bBottom = nodeB.y + nodeB.height;
  
  // 겹치지 않는 경우들을 제외하고 나면 겹치는 경우
  return !(aRight <= bLeft || bRight <= aLeft || aBottom <= bTop || bBottom <= aTop);
}

// 겹치는 영역의 크기를 계산
function calculateOverlapArea(nodeA: SceneNode, nodeB: SceneNode): number {
  const left = Math.max(nodeA.x, nodeB.x);
  const right = Math.min(nodeA.x + nodeA.width, nodeB.x + nodeB.width);
  const top = Math.max(nodeA.y, nodeB.y);
  const bottom = Math.min(nodeA.y + nodeA.height, nodeB.y + nodeB.height);
  
  if (left < right && top < bottom) {
    return (right - left) * (bottom - top);
  }
  
  return 0;
}

// 같은 레벨에서 겹치는 요소들 탐지
function checkOverlapping(nodes: SceneNode[], pageName: string, parentDepth: number): LayerIssue[] {
  const issues: LayerIssue[] = [];
  const overlappingPairs = new Set<string>(); // 중복 방지
  
  // 모든 노드 쌍을 비교
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];
      
      // 두 노드가 겹치는지 확인
      if (checkNodeOverlap(nodeA, nodeB)) {
        const pairKey = `${nodeA.id}-${nodeB.id}`;
        
        if (!overlappingPairs.has(pairKey)) {
          overlappingPairs.add(pairKey);
          
          // 겹치는 영역 계산
          const overlapArea = calculateOverlapArea(nodeA, nodeB);
          const overlapPercentageA = (overlapArea / (nodeA.width * nodeA.height)) * 100;
          const overlapPercentageB = (overlapArea / (nodeB.width * nodeB.height)) * 100;
          
          // 두 노드 모두에 대해 이슈 생성
          issues.push({
            id: nodeA.id,
            name: nodeA.name,
            type: nodeA.type,
            issue: "overlapping",
            description: `다른 요소와 겹침: "${nodeB.name}" (${Math.round(overlapPercentageA)}% 겹침)`,
            category: `겹치는 영역: ${Math.round(overlapArea)}px²`,
            page: pageName,
            depth: parentDepth + 1
          });
          
          issues.push({
            id: nodeB.id,
            name: nodeB.name,
            type: nodeB.type,
            issue: "overlapping",
            description: `다른 요소와 겹침: "${nodeA.name}" (${Math.round(overlapPercentageB)}% 겹침)`,
            category: `겹치는 영역: ${Math.round(overlapArea)}px²`,
            page: pageName,
            depth: parentDepth + 1
          });
        }
      }
    }
  }
  
  return issues;
}

// 레이어 순회 및 검사
function auditLayers(
  node: BaseNode,
  issues: LayerIssue[],
  pageName: string,
  depth: number = 0,
  layerNames: Map<string, string[]> = new Map(),
  parentFrame: FrameNode | null = null
): number {
  let totalLayers = 0;

  if (node.type !== "PAGE" && node.type !== "DOCUMENT") {
    totalLayers = 1;
    const sceneNode = node as SceneNode;

    // 레이어명 중복 체크를 위한 수집
    const layerName = node.name.toLowerCase().trim();
    if (!layerNames.has(layerName)) {
      layerNames.set(layerName, []);
    }
    layerNames.get(layerName)!.push(node.id);

    // 빈 레이어 체크
    if (isEmptyLayer(sceneNode)) {
      issues.push({
        id: node.id,
        name: node.name,
        type: node.type,
        issue: "empty-layer",
        description: "빈 레이어입니다",
        page: pageName,
        depth,
      });
    }

    // 레이어명 규칙 체크
    const namingResult = checkNamingConvention(node.name);
    if (!namingResult.isValid) {
      issues.push({
        id: node.id,
        name: node.name,
        type: node.type,
        issue: "naming-convention",
        category: namingResult.issues.join(", "),
        description: `레이어명 문제: ${namingResult.issues.join(", ")}`,
        page: pageName,
        depth,
      });
    }

    // 구조 깊이 체크 (8단계 이상)
    if (depth >= 8) {
      issues.push({
        id: node.id,
        name: node.name,
        type: node.type,
        issue: "deep-structure",
        category: `깊이 ${depth}단계`,
        description: `구조가 너무 깊습니다 (${depth}단계)`,
        page: pageName,
        depth,
      });
    }

    // 프레임 경계 벗어남 체크
    if (parentFrame && checkOutOfBounds(sceneNode, parentFrame)) {
      issues.push({
        id: node.id,
        name: node.name,
        type: node.type,
        issue: "out-of-bounds",
        description: `프레임 경계를 벗어남 (x: ${Math.round(sceneNode.x)}, y: ${Math.round(sceneNode.y)}, w: ${Math.round(sceneNode.width)}, h: ${Math.round(sceneNode.height)})`,
        category: `프레임 크기: ${Math.round(parentFrame.width)}×${Math.round(parentFrame.height)}`,
        page: pageName,
        depth
      });
    }
  }

  // 자식 노드들 순회
  if ("children" in node) {
    const children = node.children as SceneNode[];
    
    // 현재 노드가 프레임이면 parentFrame 업데이트
    const currentFrame = node.type === "FRAME" ? node as FrameNode : parentFrame;
    
    // 같은 레벨의 자식들 간 겹침 검사 (가시적인 자식들만)
    if (children.length > 1) {
      const visibleChildren = children.filter(child => child.visible);
      
      if (visibleChildren.length > 1) {
        const overlappingIssues = checkOverlapping(visibleChildren, pageName, depth);
        issues.push(...overlappingIssues);
      }
    }
    
    // 각 자식 노드 재귀 검사
    for (const child of children) {
      totalLayers += auditLayers(
        child,
        issues,
        pageName,
        depth + 1,
        layerNames,
        currentFrame
      );
    }
  }

  return totalLayers;
}

function checkDuplicateNames(
  layerNames: Map<string, string[]>,
  issues: LayerIssue[],
  pageName: string
) {
  layerNames.forEach((ids, name) => {
    if (ids.length > 1 && name.trim() !== "") {
      // 중복된 레이어들에 대해 각각 이슈 추가
      ids.forEach((id) => {
        const node = figma.getNodeById(id);
        if (node) {
          issues.push({
            id: node.id,
            name: node.name,
            type: node.type,
            issue: "duplicate-name",
            category: `${ids.length}개 중복`,
            description: `중복된 레이어명 (총 ${ids.length}개)`,
            page: pageName,
          });
        }
      });
    }
  });
}

// 메인 검사 함수
export function performAudit(): AuditResult {
  const issues: LayerIssue[] = [];
  let totalLayers = 0;

  // 모든 페이지 검사
  for (const page of figma.root.children) {
    const layerNames = new Map<string, string[]>();
    totalLayers += auditLayers(page, issues, page.name, 0, layerNames, null);

    // 페이지별 중복명 검사
    checkDuplicateNames(layerNames, issues, page.name);
  }

  // 통계 계산
  const emptyLayers = issues.filter(
    (issue) => issue.issue === "empty-layer"
  ).length;
  const namingIssues = issues.filter(
    (issue) => issue.issue === "naming-convention"
  ).length;
  const duplicateNames = issues.filter(
    (issue) => issue.issue === "duplicate-name"
  ).length;
  const deepStructures = issues.filter(
    (issue) => issue.issue === "deep-structure"
  ).length;
  const outOfBoundsElements = issues.filter(
    (issue) => issue.issue === "out-of-bounds"
  ).length;
  const overlappingElements = issues.filter(
    (issue) => issue.issue === "overlapping"
  ).length;

  return {
    issues,
    stats: {
      totalLayers,
      emptyLayers,
      namingIssues,
      duplicateNames,
      deepStructures,
      outOfBoundsElements,
      overlappingElements,
    },
  };
}

// 레이어 선택 함수
export function selectLayer(layerId: string): void {
  console.log("레이어 선택 시도:", layerId);
  try {
    const node = figma.getNodeById(layerId);
    if (node && "type" in node) {
      const sceneNode = node as SceneNode;

      // 해당 노드가 있는 페이지로 이동
      try {
        // 현재 페이지에서 노드 찾기 시도
        const currentPage = figma.currentPage;
        const nodeInCurrentPage = currentPage.findOne(
          (node) => node.id === layerId
        );

        if (nodeInCurrentPage) {
          // 현재 페이지에 있으면 그대로 사용
          figma.currentPage = currentPage;
        } else {
          // 다른 페이지에서 찾기
          for (const page of figma.root.children) {
            const nodeInPage = page.findOne((node) => node.id === layerId);
            if (nodeInPage) {
              figma.currentPage = page;
              break;
            }
          }
        }
      } catch (error) {
        console.log("페이지 이동 실패:", error);
      }

      // 레이어 선택
      figma.currentPage.selection = [sceneNode];

      // 뷰포트에서 해당 레이어로 이동
      figma.viewport.scrollAndZoomIntoView([sceneNode]);

      console.log("레이어 선택 완료:", node.name);
    } else {
      console.log("레이어를 찾을 수 없음:", layerId);
    }
  } catch (error) {
    console.error("레이어 선택 실패:", error);
  }
}