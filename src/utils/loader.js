export const imageLoader = (src, cb) => {
  const img = new Image();
  img.src = src;
  img.onload = function () {
    cb(img);
  }
}
