import { Camera, Aperture, Clock, Sun, Calendar, Disc } from "lucide-react";

export interface PhotoMetadata {
  camera: string;
  lens: string;
  aperture: string;
  shutter: string;
  iso: string;
  date: string;
}

interface MetadataEditorProps {
  metadata: PhotoMetadata;
  onChange: (metadata: PhotoMetadata) => void;
}

const fields: { key: keyof PhotoMetadata; label: string; icon: React.ElementType; placeholder: string }[] = [
  { key: "camera", label: "Câmera", icon: Camera, placeholder: "iPhone 15 Pro" },
  { key: "lens", label: "Lente", icon: Disc, placeholder: "24mm f/1.8" },
  { key: "aperture", label: "Abertura", icon: Aperture, placeholder: "f/1.8" },
  { key: "shutter", label: "Velocidade", icon: Clock, placeholder: "1/120s" },
  { key: "iso", label: "ISO", icon: Sun, placeholder: "100" },
  { key: "date", label: "Data", icon: Calendar, placeholder: "2024-01-15" },
];

const MetadataEditor = ({ metadata, onChange }: MetadataEditorProps) => {
  const update = (key: keyof PhotoMetadata, value: string) => {
    onChange({ ...metadata, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {fields.map(({ key, label, icon: Icon, placeholder }) => (
        <div key={key} className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Icon className="w-3 h-3" />
            {label}
          </label>
          <input
            type="text"
            value={metadata[key]}
            onChange={(e) => update(key, e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm bg-muted border border-border rounded-lg text-foreground placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors"
          />
        </div>
      ))}
    </div>
  );
};

export default MetadataEditor;
