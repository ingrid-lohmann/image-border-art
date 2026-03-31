import EXIF from "exif-js";
import type { PhotoMetadata } from "@/components/MetadataEditor";

export function readExif(file: File): Promise<PhotoMetadata> {
  return new Promise((resolve) => {
    const defaults: PhotoMetadata = {
      camera: "",
      lens: "",
      aperture: "",
      shutter: "",
      iso: "",
      date: "",
    };

    EXIF.getData(file as any, function (this: any) {
      try {
        const make = EXIF.getTag(this, "Make") || "";
        const model = EXIF.getTag(this, "Model") || "";
        const lens = EXIF.getTag(this, "LensModel") || EXIF.getTag(this, "Lens") || "";
        const fNumber = EXIF.getTag(this, "FNumber");
        const exposure = EXIF.getTag(this, "ExposureTime");
        const iso = EXIF.getTag(this, "ISOSpeedRatings");
        const dateOriginal = EXIF.getTag(this, "DateTimeOriginal") || "";

        const camera = model
          ? make && !model.startsWith(make)
            ? `${make} ${model}`
            : model
          : "";

        const aperture = fNumber ? `f/${fNumber.numerator / fNumber.denominator}` : "";

        let shutter = "";
        if (exposure) {
          const val = exposure.numerator / exposure.denominator;
          shutter = val >= 1 ? `${val}s` : `1/${Math.round(1 / val)}s`;
        }

        const isoStr = iso ? String(Array.isArray(iso) ? iso[0] : iso) : "";
        const date = dateOriginal ? dateOriginal.replace(/:/g, "-").split(" ")[0] : "";

        resolve({ camera, lens, aperture, shutter, iso: isoStr, date });
      } catch {
        resolve(defaults);
      }
    });
  });
}
