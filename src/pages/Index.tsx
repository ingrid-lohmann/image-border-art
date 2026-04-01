import { useCallback, useRef, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toPng } from "html-to-image";
import { Download, ImagePlus, Sparkles } from "lucide-react";
import Dropzone from "@/components/Dropzone";
import MetadataEditor, { type PhotoMetadata } from "@/components/MetadataEditor";
import FramePreview, { type FrameLayout } from "@/components/FramePreview";
import LayoutSelector from "@/components/LayoutSelector";
import { readExif } from "@/lib/exif";

const defaultMeta: PhotoMetadata = {
  camera: "",
  lens: "",
  aperture: "",
  shutter: "",
  iso: "",
  date: "",
};

const Index = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PhotoMetadata>(defaultMeta);
  const [layout, setLayout] = useState<FrameLayout>("modern");
  const [exporting, setExporting] = useState(false);
  const [showModernMeta, setShowModernMeta] = useState(true);
  const [showModernBorder, setShowModernBorder] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);

  const handleImageLoad = useCallback(async (file: File, dataUrl: string) => {
    setImageUrl(dataUrl);
    const exif = await readExif(file);
    setMetadata(exif);
  }, []);

  const handleExport = useCallback(async () => {
    if (!frameRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(frameRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "framm-export.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setImageUrl(null);
    setMetadata(defaultMeta);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight text-foreground">Framm</h1>
          </div>
          {imageUrl && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <ImagePlus className="w-4 h-4" />
                Nova foto
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-lg shadow-primary/20"
              >
                <Download className="w-4 h-4" />
                {exporting ? "Exportando..." : "Exportar"}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {!imageUrl ? (
            <div className="max-w-xl mx-auto mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Adicione molduras elegantes às suas fotos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Carregue uma imagem e os metadados EXIF serão lidos automaticamente.
                </p>
              </div>
              <Dropzone onImageLoad={handleImageLoad} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
              {/* Preview */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Preview</h3>
                  <LayoutSelector selected={layout} onSelect={setLayout} />
                </div>
                <div className="flex justify-center rounded-xl bg-surface-elevated p-6 overflow-auto">
                  <div style={{ maxWidth: "100%" }}>
                    <FramePreview
                      ref={frameRef}
                      imageUrl={imageUrl}
                      metadata={metadata}
                      layout={layout}
                      showMetadata={showModernMeta}
                      showBorder={showModernBorder}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Metadados</h3>
                <div className="bg-card border border-border rounded-xl p-5">
                  <MetadataEditor metadata={metadata} onChange={setMetadata} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
