import type { FrameLayout } from "./FramePreview";
import { LayoutGrid, Minus, Square } from "lucide-react";

const layouts: { id: FrameLayout; label: string; icon: React.ElementType }[] = [
  { id: "modern", label: "Moderno", icon: LayoutGrid },
  { id: "minimal", label: "Minimalista", icon: Minus },
  { id: "classic", label: "Classic", icon: Square },
];

interface LayoutSelectorProps {
  selected: FrameLayout;
  onSelect: (layout: FrameLayout) => void;
}

const LayoutSelector = ({ selected, onSelect }: LayoutSelectorProps) => (
  <div className="flex gap-2">
    {layouts.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        onClick={() => onSelect(id)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          selected === id
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </button>
    ))}
  </div>
);

export default LayoutSelector;
