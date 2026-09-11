import { MoveRightIcon } from "lucide-react";

const PrimaryButton = () => {
  return (
    <button className="border text-sm justify-center items-center px-10 py-2 rounded-md flex gap-3 bg-ink text-paper">
      <span>Find Route</span>
      <MoveRightIcon strokeWidth={1} size={24} />
    </button>
  );
};

export default PrimaryButton;
