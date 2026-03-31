import { forwardRef } from "react";
import type { PhotoMetadata } from "./MetadataEditor";

export type FrameLayout = "modern" | "minimal" | "classic";

interface FramePreviewProps {
  imageUrl: string;
  metadata: PhotoMetadata;
  layout: FrameLayout;
}

const FramePreview = forwardRef<HTMLDivElement, FramePreviewProps>(
  ({ imageUrl, metadata, layout }, ref) => {
    const techString = [metadata.aperture, metadata.shutter, metadata.iso ? `ISO ${metadata.iso}` : ""]
      .filter(Boolean)
      .join("  ·  ");

    return (
      <div
        ref={ref}
        className="inline-block"
        style={{ backgroundColor: "#ffffff" }}
      >
        {layout === "classic" ? (
          <div style={{ padding: "32px 32px 80px 32px", backgroundColor: "#ffffff" }}>
            <img
              src={imageUrl}
              alt="photo"
              style={{ display: "block", maxWidth: "100%", height: "auto" }}
              crossOrigin="anonymous"
            />
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#1a1a1a", fontWeight: 500 }}>
                {metadata.camera}
              </p>
              {metadata.date && (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "#888", marginTop: "4px" }}>
                  {metadata.date}
                </p>
              )}
            </div>
          </div>
        ) : layout === "minimal" ? (
          <div style={{ padding: "20px", backgroundColor: "#ffffff" }}>
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
        ) : (
          /* modern */
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
        )}
      </div>
    );
  }
);

FramePreview.displayName = "FramePreview";

export default FramePreview;
