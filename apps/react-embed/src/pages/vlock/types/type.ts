export type CategoryType = "숙소" | "식당" | "카페" | "관광";

// 샘플 라이브러리 아이템 타입
export type LibraryItem = {
  id: string;
  title: string;
  category: CategoryType;
  duration: string;
  imageUrl?: string;
};

// 카테고리별 색상 매핑
export const CATEGORY_COLORS: Record<CategoryType, string> = {
  숙소: "#FF459C",
  식당: "#FF5353",
  카페: "#E0B795",
  관광: "#5B8DEF",
};

export type BoardItem = {
  id: string;
  sourceId: string;
  title: string;
  x: number; // 보드 내부 좌표(px)
  y: number; // 보드 내부 좌표(px)
  w: number; // 블럭 렌더 폭
  h: number; // 블럭 렌더 높이
};
