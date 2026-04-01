import type { PhotoMetadata } from "@/components/MetadataEditor";

export function readExif(file: File): Promise<PhotoMetadata> {
  const defaults: PhotoMetadata = {
    camera: "",
    lens: "",
    aperture: "",
    shutter: "",
    iso: "",
    date: "",
  };

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const exif = parseExifFromBuffer(buffer);
        resolve(exif);
      } catch {
        resolve(defaults);
      }
    };
    reader.onerror = () => resolve(defaults);
    reader.readAsArrayBuffer(file);
  });
}

interface IFDEntry {
  tag: number;
  type: number;
  count: number;
  value: number | number[] | string;
}

function parseExifFromBuffer(buffer: ArrayBuffer): PhotoMetadata {
  const view = new DataView(buffer);
  const defaults: PhotoMetadata = { camera: "", lens: "", aperture: "", shutter: "", iso: "", date: "" };

  // Check JPEG SOI marker
  if (view.getUint16(0) !== 0xFFD8) return defaults;

  let offset = 2;
  while (offset < view.byteLength - 1) {
    const marker = view.getUint16(offset);
    if (marker === 0xFFE1) {
      // APP1 - EXIF
      const length = view.getUint16(offset + 2);
      return parseExifData(view, offset + 4, length - 2);
    }
    // Skip other markers
    if ((marker & 0xFF00) !== 0xFF00) break;
    const segLen = view.getUint16(offset + 2);
    offset += 2 + segLen;
  }

  return defaults;
}

function parseExifData(view: DataView, start: number, _length: number): PhotoMetadata {
  const defaults: PhotoMetadata = { camera: "", lens: "", aperture: "", shutter: "", iso: "", date: "" };

  // Check "Exif\0\0"
  if (getString(view, start, 4) !== "Exif") return defaults;

  const tiffStart = start + 6;
  const byteOrder = view.getUint16(tiffStart);
  const littleEndian = byteOrder === 0x4949;

  // Verify TIFF magic
  if (view.getUint16(tiffStart + 2, littleEndian) !== 0x002A) return defaults;

  const ifd0Offset = view.getUint32(tiffStart + 4, littleEndian);

  // Read IFD0
  const ifd0 = readIFD(view, tiffStart, ifd0Offset, littleEndian);

  let make = "";
  let model = "";
  let dateOriginal = "";
  let fNumber: number | null = null;
  let exposure: number | null = null;
  let iso = "";
  let lens = "";

  // IFD0 tags
  for (const entry of ifd0) {
    if (entry.tag === 0x010F) make = String(entry.value).trim(); // Make
    if (entry.tag === 0x0110) model = String(entry.value).trim(); // Model
  }

  // Find ExifIFD pointer (tag 0x8769)
  const exifPointerEntry = ifd0.find(e => e.tag === 0x8769);
  if (exifPointerEntry) {
    const exifOffset = Number(exifPointerEntry.value);
    const exifIFD = readIFD(view, tiffStart, exifOffset, littleEndian);

    for (const entry of exifIFD) {
      switch (entry.tag) {
        case 0x9003: // DateTimeOriginal
          dateOriginal = String(entry.value).trim();
          break;
        case 0x829D: // FNumber
          if (Array.isArray(entry.value) && entry.value.length === 2) {
            fNumber = entry.value[0] / entry.value[1];
          } else if (typeof entry.value === "number") {
            fNumber = entry.value;
          }
          break;
        case 0x829A: // ExposureTime
          if (Array.isArray(entry.value) && entry.value.length === 2) {
            exposure = entry.value[0] / entry.value[1];
          } else if (typeof entry.value === "number") {
            exposure = entry.value;
          }
          break;
        case 0x8827: // ISOSpeedRatings
          iso = String(Array.isArray(entry.value) ? entry.value[0] : entry.value);
          break;
        case 0xA434: // LensModel
          lens = String(entry.value).trim();
          break;
      }
    }
  }

  const camera = model
    ? make && !model.startsWith(make)
      ? `${make} ${model}`
      : model
    : "";

  const aperture = fNumber ? `f/${fNumber % 1 === 0 ? fNumber.toFixed(0) : fNumber.toFixed(1)}` : "";

  let shutter = "";
  if (exposure !== null) {
    shutter = exposure >= 1 ? `${exposure}s` : `1/${Math.round(1 / exposure)}s`;
  }

  const date = dateOriginal ? dateOriginal.replace(/:/g, "-").split(" ")[0] : "";

  return { camera, lens, aperture, shutter, iso, date };
}

function readIFD(view: DataView, tiffStart: number, ifdOffset: number, le: boolean): IFDEntry[] {
  const entries: IFDEntry[] = [];
  const abs = tiffStart + ifdOffset;
  if (abs + 2 > view.byteLength) return entries;

  const count = view.getUint16(abs, le);
  for (let i = 0; i < count; i++) {
    const entryOffset = abs + 2 + i * 12;
    if (entryOffset + 12 > view.byteLength) break;

    const tag = view.getUint16(entryOffset, le);
    const type = view.getUint16(entryOffset + 2, le);
    const cnt = view.getUint32(entryOffset + 4, le);
    const valueOffset = entryOffset + 8;

    const entry: IFDEntry = { tag, type, count: cnt, value: 0 };

    const typeSize = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] || 1;
    const totalSize = typeSize * cnt;
    const dataOffset = totalSize > 4
      ? tiffStart + view.getUint32(valueOffset, le)
      : valueOffset;

    if (dataOffset + totalSize > view.byteLength) {
      entries.push(entry);
      continue;
    }

    switch (type) {
      case 2: // ASCII
        entry.value = getString(view, dataOffset, cnt).replace(/\0+$/, "");
        break;
      case 3: // SHORT
        entry.value = cnt === 1 ? view.getUint16(dataOffset, le) : 
          Array.from({ length: cnt }, (_, j) => view.getUint16(dataOffset + j * 2, le));
        break;
      case 4: // LONG
        entry.value = cnt === 1 ? view.getUint32(dataOffset, le) :
          Array.from({ length: cnt }, (_, j) => view.getUint32(dataOffset + j * 4, le));
        break;
      case 5: // RATIONAL (two LONGs: numerator/denominator)
        if (cnt === 1) {
          entry.value = [view.getUint32(dataOffset, le), view.getUint32(dataOffset + 4, le)];
        }
        break;
      case 10: // SRATIONAL
        if (cnt === 1) {
          entry.value = [view.getInt32(dataOffset, le), view.getInt32(dataOffset + 4, le)];
        }
        break;
      default:
        entry.value = cnt === 1 ? view.getUint8(dataOffset) : 0;
    }

    entries.push(entry);
  }
  return entries;
}

function getString(view: DataView, offset: number, length: number): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    if (offset + i >= view.byteLength) break;
    const c = view.getUint8(offset + i);
    if (c === 0) break;
    str += String.fromCharCode(c);
  }
  return str;
}
