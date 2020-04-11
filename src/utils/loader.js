export const imageLoader = (src, cb) => {
  const img = new Image();
  img.src = src;
  img.onload = function () {
    cb(img);
  }
}

export const videoLoader = (videoElement, cb) => {
  if (!videoElement) {
    return false;
  }

  const sources = Array.from(videoElement.children);
  sources.forEach(videoSource => {
    if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
      videoSource.src = videoSource.dataset.src;
    }
  });
  videoElement.load();
  cb();
}