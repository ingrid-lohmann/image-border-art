import type { PhotoMetadata } from "../MetadataEditor";

interface MinimalFrameProps {
  imageUrl: string;
  metadata: PhotoMetadata;
}

const MinimalFrame = ({ imageUrl, metadata }: MinimalFrameProps) => {
  const techString = [metadata.lens, metadata.aperture, metadata.shutter, metadata.iso ? `ISO ${metadata.iso}` : ""]
    .filter(Boolean)
    .join("  ·  ");

  return (
    <div style={{ padding: "0 0 20px 0", backgroundColor: "#ffffff" }}>
      <img
        src={imageUrl}
        alt="photo"
        style={{ display: "block", maxWidth: "100%", height: "auto" }}
        crossOrigin="anonymous"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "14px",
          padding: "0 4px",
        }}
      >
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#555", fontWeight: 500, letterSpacing: "0.02em" }}>
          {metadata.camera}
        </span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#999", fontWeight: 400, letterSpacing: "0.02em" }}>
          {techString}
        </span>
      </div>
    </div>
  );
};

export default MinimalFrame;
