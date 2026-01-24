import type { BoardItem } from "../types/type";

// 스냅 기준 거리 (px)
export const SNAP_THRESHOLD = 63;

export type SnapResult = {
  x: number;
  y: number;
  snappedTo: {
    blockId: string;
    edge: "left" | "right" | "top" | "bottom";
  } | null;
};

/**
 * 현재 블록을 다른 블록들 근처로 스냅(도킹)하는 함수
 * - 오른쪽/왼쪽/위/아래 가장자리에 '착' 달라붙음
 */
export function snapToNearestBlock(
  current: { x: number; y: number; w: number; h: number },
  others: BoardItem[],
  excludeId?: string
): SnapResult {
  let { x, y } = current;
  let snappedTo: SnapResult["snappedTo"] = null;

  const filteredOthers = excludeId
    ? others.filter((b) => b.id !== excludeId)
    : others;

  for (const b of filteredOthers) {
    // 수직으로 겹치는지 확인 (Y축 범위가 교차하는지)
    const verticalOverlap =
      current.y < b.y + b.h && current.y + current.h > b.y;

    // 수평으로 겹치는지 확인 (X축 범위가 교차하는지)
    const horizontalOverlap =
      current.x < b.x + b.w && current.x + current.w > b.x;

    if (verticalOverlap) {
      // 현재 블록의 왼쪽 → 다른 블록의 오른쪽에 붙이기
      const rightEdge = b.x + b.w;
      if (Math.abs(current.x - rightEdge) < SNAP_THRESHOLD) {
        x = rightEdge;
        snappedTo = { blockId: b.id, edge: "right" };
      }

      // 현재 블록의 오른쪽 → 다른 블록의 왼쪽에 붙이기
      const leftEdge = b.x;
      if (Math.abs(current.x + current.w - leftEdge) < SNAP_THRESHOLD) {
        x = leftEdge - current.w;
        snappedTo = { blockId: b.id, edge: "left" };
      }
    }

    if (horizontalOverlap) {
      // 현재 블록의 위쪽 → 다른 블록의 아래쪽에 붙이기
      const bottomEdge = b.y + b.h;
      if (Math.abs(current.y - bottomEdge) < SNAP_THRESHOLD) {
        y = bottomEdge;
        snappedTo = { blockId: b.id, edge: "bottom" };
      }

      // 현재 블록의 아래쪽 → 다른 블록의 위쪽에 붙이기
      const topEdge = b.y;
      if (Math.abs(current.y + current.h - topEdge) < SNAP_THRESHOLD) {
        y = topEdge - current.h;
        snappedTo = { blockId: b.id, edge: "top" };
      }
    }
  }

  return { x, y, snappedTo };
}

