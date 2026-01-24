import PlusIcon from "../../../assets/Icon-plus.svg";

type Props = {
  onClick?: () => void;
};

const VlockCreateButton = ({ onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-[60px] rounded-[10px] border border-dashed border-gray-400 bg-white flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-colors"
    >
      {/* + 아이콘 */}
      <img src={PlusIcon} alt="plus" className="w-4 h-4" />
      {/* 텍스트 */}
      <span className="text-[15px] font-semibold text-gray-400">
        블록 생성하기
      </span>
    </button>
  );
};

export default VlockCreateButton;
