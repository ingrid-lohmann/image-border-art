import { forwardRef } from "react";
import type { PhotoMetadata } from "./MetadataEditor";
import ClassicFrame from "./frames/ClassicFrame";
import MinimalFrame from "./frames/MinimalFrame";
import ModernFrame from "./frames/ModernFrame";

export type FrameLayout = "modern" | "minimal" | "classic";

interface FramePreviewProps {
  imageUrl: string;
  metadata: PhotoMetadata;
  layout: FrameLayout;
  showMetadata?: boolean;
  showBorder?: boolean;
}

const FramePreview = forwardRef<HTMLDivElement, FramePreviewProps>(
  ({ imageUrl, metadata, layout, showMetadata, showBorder }, ref) => {
    return (
      <div
        ref={ref}
        className="inline-block"
        style={{ backgroundColor: "#ffffff" }}
      >
        {layout === "classic" ? (
          <ClassicFrame imageUrl={imageUrl} metadata={metadata} />
        ) : layout === "minimal" ? (
          <MinimalFrame imageUrl={imageUrl} metadata={metadata} />
        ) : (
          <ModernFrame imageUrl={imageUrl} metadata={metadata} showMetadata={showMetadata} showBorder={showBorder} />
        )}
      </div>
    );
  }
);

FramePreview.displayName = "FramePreview";

export default FramePreview;
