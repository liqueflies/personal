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

export const pictureLoader = (pictureElement, cb) => {
  if (!pictureElement) {
    return false;
  }

  const sources = Array.from(pictureElement.children);
  sources.forEach(pictureSource => {
    if (typeof pictureSource.tagName === "string" && pictureSource.tagName === "SOURCE") {
      pictureSource.srcset = pictureSource.dataset.srcset;
    } else if (typeof pictureSource.tagName === "string" && pictureSource.tagName === "IMG") {
      pictureSource.src = pictureSource.dataset.src;
    }
  });
  // pictureElement.load();
  cb();
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