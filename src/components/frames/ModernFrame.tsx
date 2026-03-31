import type { PhotoMetadata } from "../MetadataEditor";

interface ModernFrameProps {
  imageUrl: string;
  metadata: PhotoMetadata;
}

const ModernFrame = ({ imageUrl, metadata }: ModernFrameProps) => {
  const techString = [metadata.aperture, metadata.shutter, metadata.iso ? `ISO ${metadata.iso}` : ""]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
      <img
        src={imageUrl}
        alt="photo"
        style={{ display: "block", maxWidth: "100%", height: "auto" }}
        crossOrigin="anonymous"
      />
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#1a1a1a", fontWeight: 600, letterSpacing: "0.04em" }}>
          {metadata.camera}
          {metadata.lens ? ` — ${metadata.lens}` : ""}
        </p>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#888", marginTop: "4px", letterSpacing: "0.03em" }}>
          {techString}
        </p>
        {metadata.date && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "10px", color: "#bbb", marginTop: "4px" }}>
            {metadata.date}
          </p>
        )}
      </div>
    </div>
  );
};

export default ModernFrame;
