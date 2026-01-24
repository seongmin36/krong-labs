type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * 스냅(도킹) 위치 미리보기 컴포넌트
 * - 드래그 중일 때만 표시
 * - 스냅될 위치를 점선 박스로 보여줌
 */
const SnapPreview = ({ x, y, w, h }: Props) => {
  return (
    <div
      className="absolute rounded-xl border-2 border-dashed border-green-500 bg-green-100/50 pointer-events-none transition-all duration-100 ease-out"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-green-600 bg-white/80 px-2 py-1 rounded">
          여기에 도킹
        </span>
      </div>
    </div>
  );
};

export default SnapPreview;

