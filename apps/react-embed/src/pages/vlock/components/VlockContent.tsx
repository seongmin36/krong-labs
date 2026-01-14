import { useDroppable } from "@dnd-kit/core";
import type { BoardItem } from "../types/type";

type Props = {
  items: BoardItem[];
};

const VlockContent = ({ items }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: "vlock-board" });

  return (
    <div className="h-full p-4">
      <div
        ref={setNodeRef}
        className={[
          "h-full rounded-xl border-2 border-dashed p-4 overflow-auto",
          isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white",
        ].join(" ")}
      >
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">여기에 드롭하세요</div>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="rounded-lg border bg-white p-3">
                <div className="font-semibold">{it.title}</div>
                <div className="text-xs text-gray-500">
                  sourceId: {it.sourceId}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VlockContent;
