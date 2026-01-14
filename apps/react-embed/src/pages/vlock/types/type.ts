export type LibraryItem = {
  id: string;
  title: string;
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
