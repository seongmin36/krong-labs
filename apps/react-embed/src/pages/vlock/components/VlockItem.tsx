import { useDraggable } from "@dnd-kit/core";
import type { LibraryItem } from "../types/type";
import clsx from "clsx";

interface VlockItemProps {
  item: LibraryItem;
}

const VlockItem = ({ item }: VlockItemProps) => {
  const { setNodeRef, listeners, attributes, transform, isDragging } =
    useDraggable({
      id: `lib:${item.id}`,
      data: { kind: "library" as const, itemId: item.id, item },
    });

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={clsx(
        "w-full h-10 bg-gray-200 p-2 cursor-pointer",
        isDragging && "opacity-0"
      )}
      style={{
        transform: isDragging
          ? undefined
          : transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
    >
      {item.title}
    </button>
  );
};

export default VlockItem;
