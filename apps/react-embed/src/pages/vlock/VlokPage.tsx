import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragMoveEvent,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import VlockSidebar from "./components/VlockSidebar";
import VlockContent from "./components/VlockContent";
import { useMemo, useRef, useState, type RefObject } from "react";
import { MOCK_LIBRARY } from "./mock";
import type { BoardItem, LibraryItem } from "./types/type";
import { CATEGORY_COLORS } from "./types/type";
import { snapToNearestBlock } from "./utils/snap";

type ActiveDrag =
  | { kind: "library"; item: LibraryItem }
  | { kind: "board"; blockId: string; w: number; h: number }
  | null;

// 스냅 프리뷰 상태
type SnapPreviewState = {
  x: number;
  y: number;
  w: number;
  h: number;
  visible: boolean;
} | null;

// 값을 특정 범위 내에 제한하는 함수
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(n, max));

// 기본 블럭 크기
const DEFAULT_BLOCK = {
  w: 260,
  h: 64,
};

const VlockPage = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  // 보드 영역 참조
  const boardRef = useRef<HTMLDivElement>(null);

  const libById = useMemo(
    () => new Map(MOCK_LIBRARY.map((item) => [item.id, item])),
    []
  );

  const [active, setActive] = useState<ActiveDrag>(null);
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [snapPreview, setSnapPreview] = useState<SnapPreviewState>(null);

  const onDragStart = (e: DragStartEvent) => {
    const kind = e.active.data.current?.kind as string | undefined;

    if (kind === "library") {
      const item = e.active.data.current?.item as LibraryItem | undefined;
      if (item) setActive({ kind: "library", item });
    }

    if (kind === "board") {
      const blockId = e.active.data.current?.blockId as string;
      const w = e.active.data.current?.w as number;
      const h = e.active.data.current?.h as number;
      setActive({ kind: "board", blockId, w, h });
    }
  };

  const onDragMove = (e: DragMoveEvent) => {
    const kind = e.active.data.current?.kind as string | undefined;
    const boardEl = boardRef.current;
    if (!boardEl) return;

    const boardRect = boardEl.getBoundingClientRect();

    // 보드 블록 드래그 중일 때만 스냅 프리뷰 계산
    if (kind === "board") {
      const blockId = e.active.data.current?.blockId as string;
      const startX = e.active.data.current?.startX as number;
      const startY = e.active.data.current?.startY as number;
      const w = e.active.data.current?.w as number;
      const h = e.active.data.current?.h as number;

      if (!blockId || startX == null || startY == null || !w || !h) return;

      // 현재 드래그 중인 위치
      const currentX = clamp(
        startX + e.delta.x,
        0,
        Math.max(0, boardRect.width - w)
      );
      const currentY = clamp(
        startY + e.delta.y,
        0,
        Math.max(0, boardRect.height - h)
      );

      // 스냅 계산
      const snapResult = snapToNearestBlock(
        { x: currentX, y: currentY, w, h },
        boardItems,
        blockId
      );

      // 스냅이 발생했을 때만 프리뷰 표시
      if (snapResult.snappedTo) {
        setSnapPreview({
          x: snapResult.x,
          y: snapResult.y,
          w,
          h,
          visible: true,
        });
      } else {
        setSnapPreview(null);
      }
    }
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActive(null);
    setSnapPreview(null); // 스냅 프리뷰 초기화

    if (!e.over) return;

    const kind = e.active.data.current?.kind as string | undefined;
    const boardEl = boardRef.current;
    if (!boardEl) return;

    // 보드 영역 크기
    const boardRect = boardEl.getBoundingClientRect();

    // 사이드바에서 보드로 드롭하는 경우
    if (kind === "library" && e.over.id === "vlock-board") {
      const itemId = e.active.data.current?.itemId as string | undefined;
      const item = itemId ? libById.get(itemId) : undefined;

      if (!item) return;

      // 드래그 중인 블럭 크기
      const activeRect =
        e.active.rect.current.translated ?? e.active.rect.current.initial;

      const centerX = activeRect?.left
        ? activeRect.left - boardRect.left + activeRect.width / 2
        : 0;
      const centerY = activeRect?.top
        ? activeRect.top - boardRect.top + activeRect.height / 2
        : 0;

      let x = clamp(
        centerX - DEFAULT_BLOCK.w / 2,
        0,
        Math.max(0, boardRect.width - DEFAULT_BLOCK.w)
      );
      let y = clamp(
        centerY - DEFAULT_BLOCK.h / 2,
        0,
        Math.max(0, boardRect.height - DEFAULT_BLOCK.h)
      );

      // 새 블록도 스냅 적용
      const snapResult = snapToNearestBlock(
        { x, y, w: DEFAULT_BLOCK.w, h: DEFAULT_BLOCK.h },
        boardItems
      );
      x = snapResult.x;
      y = snapResult.y;

      setBoardItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sourceId: item.id,
          title: item.title,
          x,
          y,
          w: DEFAULT_BLOCK.w,
          h: DEFAULT_BLOCK.h,
        },
      ]);
    }

    // 보드 블록을 이동하는 경우
    if (kind === "board" && e.over.id === "vlock-board") {
      const blockId = e.active.data.current?.blockId as string | undefined;
      const startX = e.active.data.current?.startX as number | undefined;
      const startY = e.active.data.current?.startY as number | undefined;
      const w = e.active.data.current?.w as number | undefined;
      const h = e.active.data.current?.h as number | undefined;

      if (!blockId || startX == null || startY == null || !w || !h) return;

      // 보드 블록 이동 시 좌표 제한
      let x = clamp(startX + e.delta.x, 0, Math.max(0, boardRect.width - w));
      let y = clamp(startY + e.delta.y, 0, Math.max(0, boardRect.height - h));

      // 스냅 적용 - 다른 블록 근처면 '착' 달라붙음
      const snapResult = snapToNearestBlock(
        { x, y, w, h },
        boardItems,
        blockId
      );
      x = snapResult.x;
      y = snapResult.y;

      setBoardItems((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, x, y } : b))
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      <div className="w-full h-screen flex">
        <aside className="w-[302px] h-full shrink-0">
          <VlockSidebar items={MOCK_LIBRARY} />
        </aside>

        {/* 컨텐츠 영역 */}
        <main className="flex-1 h-full bg-gray-50 p-6">
          <VlockContent
            items={boardItems}
            boardRef={boardRef as RefObject<HTMLDivElement>}
            snapPreview={snapPreview}
          />
        </main>
      </div>
      <DragOverlay dropAnimation={null}>
        {active?.kind === "library" ? (
          <div className="w-[248px] h-[84px] rounded-[10px] border border-gray-200 bg-white flex items-center gap-3 p-3 shadow-xl">
            {/* 이미지 영역 */}
            <div className="w-16 h-16 rounded-[10px] bg-gray-200 shrink-0 flex items-center justify-center">
            </div>
            {/* 텍스트 정보 */}
            <div className="flex flex-col gap-1">
              <span
                className="text-xs font-medium"
                style={{ color: CATEGORY_COLORS[active.item.category] }}
              >
                {active.item.category}
              </span>
              <span className="text-[15px] font-semibold text-[#222222]">
                {active.item.title}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-gray-400">
                  {active.item.duration}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default VlockPage;
