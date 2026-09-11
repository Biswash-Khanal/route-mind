import { BusFrontIcon } from "lucide-react";
import WalkIcon from "../Icons/WalkIcon";

const ModeToggle = () => {
  return (
    <button className="border text-sm justify-center items-center px-1 py-1 rounded-md flex gap-2">
      <span className="bg-transit-500 text-paper px-5 py-2 rounded-md flex gap-2 items-center justify-center">
        <BusFrontIcon size={24} strokeWidth={2} />
        <span>Transit</span>
      </span>
      <span className="bg-walk-500 text-paper px-5 py-2 rounded-md flex gap-2 items-center justify-center">
        <WalkIcon size={24} strokeWidth={0} />
        <span>Walk</span>
      </span>
    </button>
  );
};

export default ModeToggle;
