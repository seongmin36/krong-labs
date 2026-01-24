import { useDraggable } from "@dnd-kit/core";
import type { LibraryItem } from "../types/type";
import { CATEGORY_COLORS } from "../types/type";
import clsx from "clsx";
import ClockIcon from "../../../assets/Icon-clock.svg";

interface VlockItemProps {
  item: LibraryItem;
}

const VlockItem = ({ item }: VlockItemProps) => {
  const { setNodeRef, listeners, attributes, transform, isDragging } =
    useDraggable({
      id: `lib:${item.id}`,
      data: { kind: "library" as const, itemId: item.id, item },
    });

  const categoryColor = CATEGORY_COLORS[item.category];

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={clsx(
        "relative w-full h-[84px] rounded-[10px] border border-gray-200 bg-white flex items-center gap-3 p-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md",
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
      {/* 이미지 영역 (비워둠) */}
      <div className="w-16 h-16 rounded-[10px] bg-gray-200 shrink-0 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>

      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-1 items-start text-left">
        {/* 카테고리 */}
        <span
          className="text-xs font-medium"
          style={{ color: categoryColor }}
        >
          {item.category}
        </span>

        {/* 이름 */}
        <span className="text-[15px] font-semibold text-[#222222]">
          {item.title}
        </span>

        {/* 시간 */}
        <div className="flex items-center gap-1">
          <img src={ClockIcon} alt="clock" className="w-4 h-4" />
          <span className="text-xs font-medium text-gray-400">
            {item.duration}
          </span>
        </div>
      </div>
    </button>
  );
};

export default VlockItem;
