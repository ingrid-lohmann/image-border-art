import type { PhotoMetadata } from "../MetadataEditor";

interface ModernFrameProps {
  imageUrl: string;
  metadata: PhotoMetadata;
  showMetadata?: boolean;
  showBorder?: boolean;
}

const ModernFrame = ({ imageUrl, metadata, showMetadata = true, showBorder = true }: ModernFrameProps) => {
  const metaItems = [
    metadata.camera,
    metadata.lens,
    metadata.aperture,
    metadata.shutter,
    metadata.iso ? `ISO ${metadata.iso}` : "",
    metadata.date,
  ].filter(Boolean);

  return (
    <div
      style={{
        padding: showBorder ? "40px" : "0",
        backgroundColor: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow:
            "0 22px 70px 4px rgba(0, 0, 0, 0.28), 0 0 0 0.5px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Title Bar */}
        <div
          style={{
            height: "38px",
            background: "linear-gradient(180deg, #e8e6e8 0%, #d6d4d6 100%)",
            display: "flex",
            alignItems: "center",
            paddingLeft: "12px",
            paddingRight: "12px",
            position: "relative",
            borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Traffic Lights */}
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#ff5f57",
                border: "0.5px solid rgba(0, 0, 0, 0.12)",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#febc2e",
                border: "0.5px solid rgba(0, 0, 0, 0.12)",
              }}
            />
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#28c840",
                border: "0.5px solid rgba(0, 0, 0, 0.12)",
              }}
            />
          </div>

          {/* Metadata in title bar */}
          {showMetadata && metaItems.length > 0 && (
            <div
              style={{
                flex: 1,
                textAlign: "center",
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                fontSize: "11px",
                color: "#4a4a4a",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                paddingLeft: "12px",
                paddingRight: "44px",
              }}
            >
              {metaItems.join("  •  ")}
            </div>
          )}
        </div>

        {/* Image */}
        <img
          src={imageUrl}
          alt="photo"
          style={{ display: "block", maxWidth: "100%", height: "auto" }}
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
};

export default ModernFrame;
