import type { PhotoMetadata } from "../MetadataEditor";

interface ClassicFrameProps {
  imageUrl: string;
  metadata: PhotoMetadata;
}

const ClassicFrame = ({ imageUrl, metadata }: ClassicFrameProps) => {
  const techString = [metadata.lens, metadata.aperture, metadata.shutter, metadata.iso ? `ISO ${metadata.iso}` : "", metadata.date]
    .filter(Boolean)
    .join("  |  ");

  return (
    <div style={{ padding: "20px 20px 32px 20px", backgroundColor: "#ffffff" }}>
      <img
        src={imageUrl}
        alt="photo"
        style={{ display: "block", maxWidth: "100%", height: "auto" }}
        crossOrigin="anonymous"
      />
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1a1a", fontWeight: 400 }}>
          Shot on <span style={{ fontWeight: 700 }}>{metadata.camera}</span>
        </p>
        {techString && (
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#888", marginTop: "6px" }}>
            {techString}
          </p>
        )}
      </div>
    </div>
  );
};

export default ClassicFrame;
