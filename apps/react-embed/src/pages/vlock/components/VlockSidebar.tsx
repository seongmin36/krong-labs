import VlockItem from "./VlockItem";
import type { LibraryItem } from "../types/type";

type Props = {
  items: LibraryItem[];
};

const VlockSidebar = ({ items }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <VlockItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default VlockSidebar;
