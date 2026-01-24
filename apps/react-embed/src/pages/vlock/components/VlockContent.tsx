import { useDroppable } from "@dnd-kit/core";
import type { BoardItem } from "../types/type";
import clsx from "clsx";
import VlockCanvasBlock from "./VlockCanvasBlock";
import SnapPreview from "./SnapPreview";

type SnapPreviewState = {
  x: number;
  y: number;
  w: number;
  h: number;
  visible: boolean;
} | null;

type Props = {
  items: BoardItem[];
  boardRef: React.RefObject<HTMLDivElement>;
  snapPreview?: SnapPreviewState;
};

const VlockContent = ({ items, boardRef, snapPreview }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: "vlock-board" });

  const setRefs = (el: HTMLDivElement | null) => {
    setNodeRef(el);

    // @ts-expect-error - boardRef is not null
    boardRef.current = el;
  };

  return (
    <div className="h-full p-4">
      <div
        ref={setRefs}
        className={clsx(
          "relative w-full h-full rounded-xl border-2 border-dashed p-4 overflow-auto",
          isOver ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        )}
      >
        {items.length === 0 ? (
          <div className="text-sm text-gray-500">여기에 드롭하세요</div>
        ) : (
          <>
            {items.map((it) => (
              <VlockCanvasBlock key={it.id} item={it} />
            ))}
          </>
        )}

        {/* 스냅 프리뷰 - 도킹될 위치 미리보기 */}
        {snapPreview?.visible && (
          <SnapPreview
            x={snapPreview.x}
            y={snapPreview.y}
            w={snapPreview.w}
            h={snapPreview.h}
          />
        )}
      </div>
    </div>
  );
};

export default VlockContent;
