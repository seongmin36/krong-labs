import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import VlockSidebar from "./components/VlockSidebar";
import VlockContent from "./components/VlockContent";
import { useMemo, useRef, useState, type RefObject } from "react";
import { MOCK_LIBRARY } from "./mock";
import type { BoardItem, LibraryItem } from "./types/type";

type ActiveDrag = { kind: "library"; item: LibraryItem } | null;

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

  const onDragStart = (e: DragStartEvent) => {
    const kind = e.active.data.current?.kind as string | undefined;
    if (kind !== "library") return;

    const item = e.active.data.current?.item as LibraryItem | undefined;
    if (item) setActive({ kind: "library", item });
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActive(null);

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

      const x = clamp(
        centerX - DEFAULT_BLOCK.w / 2,
        0,
        Math.max(0, boardRect.width - DEFAULT_BLOCK.w)
      );
      const y = clamp(
        centerY - DEFAULT_BLOCK.h / 2,
        0,
        Math.max(0, boardRect.height - DEFAULT_BLOCK.h)
      );

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

      // 보드 블록 이동 시 좌표 제한 : 보드 영역 내부에서만 이동 => 보드 영역 좌표 참조
      const x = clamp(startX + e.delta.x, 0, Math.max(0, boardRect.width - w));
      const y = clamp(startY + e.delta.y, 0, Math.max(0, boardRect.height - h));

      setBoardItems((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, x, y } : b))
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="w-full min-h-screen p-10">
        <div className="">
          <div className="flex gap-10">
            <div className="flex flex-col w-1/4">
              <p>사이드바</p>
              <section className="h-screen border border-gray-300">
                <VlockSidebar items={MOCK_LIBRARY} />
              </section>
            </div>
            <div className="flex flex-col w-3/4">
              <p>컨텐츠 영역</p>
              <section className="h-screen border border-gray-300">
                <VlockContent
                  items={boardItems}
                  boardRef={boardRef as RefObject<HTMLDivElement>}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {active?.kind === "library" ? (
          <div className="w-[260px] rounded-xl border bg-white p-3 shadow-xl">
            <div className="text-sm font-semibold">{active.item.title}</div>
            <div className="text-xs text-gray-500">드롭하면 보드에 추가</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default VlockPage;
