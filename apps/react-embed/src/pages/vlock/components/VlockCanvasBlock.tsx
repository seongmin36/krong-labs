import { useDraggable } from "@dnd-kit/core";
import type { BoardItem } from "../types/type";
import clsx from "clsx";

type Props = {
  item: BoardItem;
};

const VlockCanvasBlock = ({ item }: Props) => {
  const { setNodeRef, listeners, attributes, transform, isDragging } =
    useDraggable({
      id: `board:${item.id}`,
      data: {
        kind: "board" as const,
        blockId: item.id,
        startX: item.x,
        startY: item.y,
        w: item.w,
        h: item.h,
      },
    });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={clsx(
        "absolute rounded-xl border-2 border-dashed p-4 overflow-auto",
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
      )}
      style={{
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.w}px`,
        height: `${item.h}px`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      <div className="font-semibold">{item.title}</div>
      <div className="text-xs text-gray-500">sourceId: {item.sourceId}</div>
    </div>
  );
};

export default VlockCanvasBlock;
