import { useCallback, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface DropzoneProps {
  onImageLoad: (file: File, dataUrl: string) => void;
}

const Dropzone = ({ onImageLoad }: DropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageLoad(file, e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageLoad]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <label
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : "border-border bg-surface-elevated hover:border-muted-foreground/40 hover:bg-accent/50"
      }`}
    >
      <div className="flex flex-col items-center gap-3 pointer-events-none">
        <div className="p-3 rounded-full bg-muted">
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-primary" />
          ) : (
            <Upload className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Solte a imagem aqui" : "Arraste uma imagem ou clique para selecionar"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG — qualquer resolução</p>
        </div>
      </div>
      <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={onInputChange} />
    </label>
  );
};

export default Dropzone;
