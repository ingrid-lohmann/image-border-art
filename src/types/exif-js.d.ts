declare module "exif-js" {
  const EXIF: {
    getData(img: any, callback: (this: any) => void): void;
    getTag(img: any, tag: string): any;
    getAllTags(img: any): Record<string, any>;
  };
  export default EXIF;
}
