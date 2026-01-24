import { useState } from "react";
import VlockItem from "./VlockItem";
import VlockTabs, { type TabType } from "./VlockTabs";
import VlockCreateButton from "./VlockCreateButton";
import type { LibraryItem } from "../types/type";

type Props = {
  items: LibraryItem[];
  onCreateBlock?: () => void;
};

const VlockSidebar = ({ items, onCreateBlock }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>("인기");

  // 탭별 컨텐츠 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case "생성":
        return (
          <div className="flex flex-col gap-3">
            <VlockCreateButton onClick={onCreateBlock} />
          </div>
        );
      case "인기":
      case "카테고리":
      default:
        return (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <VlockItem key={item.id} item={item} />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* 헤더 타이틀 */}
      <div className="px-6 pt-8 pb-4">
        <h2 className="text-xl font-semibold text-black">Vlock 라이브러리</h2>
      </div>

      {/* 탭 영역 (별도 컴포넌트) */}
      <VlockTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭별 컨텐츠 */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default VlockSidebar;
