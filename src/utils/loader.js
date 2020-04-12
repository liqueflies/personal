export const imageLoader = ({src, format = 'jpg'}, cb) => {
  const img = new Image();
  img.src = src;
  img.onload = function () {
    cb(img);
  }
  img.onerror = function () {
    img.src = `${src}.${format}`;
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