export const lazyImage = async imageEl => {
  return new Promise(resolve => {
    const { src } = imageEl.dataset;
    imageEl.src = src;
    imageEl.onload = function () {
      resolve(src);
    }
  });
}

export const lazyPicture = pictureEl => {
  return new Promise(resolve => {
    if (!pictureEl) {
      resolve(null);
    }
  
    const sources = Array.from(
      pictureEl.children
    );

    sources.forEach(source => {
      if (typeof source.tagName === "string" && source.tagName === "SOURCE") {
        source.srcset = source.dataset.srcset;
      } else if (typeof source.tagName === "string" && source.tagName === "IMG") {
        source.src = source.dataset.src;
        source.onload = function () {
          resolve(this);
        }
      }
    });
  });
}

export const lazyVideo = videoEl => {
  return new Promise(resolve => {
    if (!videoEl) {
      resolve(null);
    }

    const sources = Array.from(videoEl.children);
    sources.forEach(videoSource => {
      if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
        videoSource.src = videoSource.dataset.src;
      }
    });

    videoEl.load();
    resolve(videoEl);
  });
}