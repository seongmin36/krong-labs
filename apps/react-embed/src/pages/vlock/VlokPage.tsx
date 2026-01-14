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
import { useMemo, useState } from "react";
import { MOCK_LIBRARY } from "./mock";
import type { BoardItem, LibraryItem } from "./types/type";

type ActiveDrag = { kind: "library"; item: LibraryItem } | null;

const VlockPage = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  const libById = useMemo(
    () => new Map(MOCK_LIBRARY.map((item) => [item.id, item])),
    []
  );

  const [active, setActive] = useState<ActiveDrag>(null);
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);

  const onDragStart = (e: DragStartEvent) => {
    const kind = e.active.data.current?.king as string | undefined;
    if (kind !== "library") return;

    const item = e.active.data.current?.item as LibraryItem | undefined;
    if (item) setActive({ kind: "library", item });
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActive(null);

    if (!e.over) return;

    const kind = e.active.data.current?.kind as string | undefined;
    if (kind !== "library") return;

    if (e.over.id === "vlock-board") {
      const itemId = e.active.data.current?.itemId as string | undefined;
      const item = itemId ? libById.get(itemId) : undefined;

      if (!item) return;

      setBoardItems((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sourceId: item.id,
          title: item.title,
        },
      ]);
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
                <VlockContent items={boardItems} />
              </section>
            </div>
          </div>
        </div>
      </div>
      <DragOverlay>
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
