<script context="module">
  import { RichText } from 'prismic-dom';
  import { onMount, onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import isMobile from 'is-mobile';

  import { scrollable } from '../context/scroll';
  import { renderable, context, height, width } from '../context/canvas';
  import { imageLoader, videoLoader } from '../utils/loader';
  import { lerp } from '../utils/math';
</script>

<script>
  export let uid;
  export let title;
  export let image;
  export let video;

  const frames = [];
  const size = { x: 0, y: 0 };

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;

  let texture;
  let videoElement;
  let imageElement;
  let visible;
  let scrolling;
  let trigger;

  let contextAlpha = tweened(0);

  onMount(() => {
    function Video() {
      const {top, left} = getVideoPosition();
      this.x = left;
      this.y = top;

      this.draw = function(x, y) {
        $context.drawImage(texture, x, y, size.x, size.y);
        this.x = x;
        this.y = y;
      }
    }

    for(let i = 0; i < 4; i++) {
      const e = new Video();
      frames.push(e);
    }
  });

  renderable({
    setup: props => {
      videoLoader(videoElement, () => {
        texture = videoElement;
        size.x = videoElement.offsetWidth;
        size.y = videoElement.offsetHeight;

        videoElement.pause();
        videoElement.currentTime = 0;
      });
    },
    render: props => {
      if (visible && texture) {
        let intensity = scrolling ? 0.8 : 0.35;
        let delay = scrolling ? 0.5 : 0.8;

        x = lerp(x, mX, intensity);
        y = lerp(y, mY, intensity);

        frames.forEach((e, i) => {
          const next = frames[i + 1] || frames[0];

          e.draw(x, y);

          x = lerp(x, next.x, delay);
          y = lerp(y, next.y, delay);

          $context.globalCompositeOperation = 'destination-over';
        });
      }
    }
  });

  scrollable({
    value: uid,
    scroll: ({ speed, direction, instance }) => {
      const {top, left} = getVideoPosition();
      mX = left;
      mY = top;

      scrolling = Math.abs(speed) > 0;

      if (direction) {
        const prevTrigger = trigger;
        trigger = direction === 'down' ? 'bottom' : 'top';

        if (prevTrigger !== trigger) {
          instance.update();
        }
      }
    },
    enter: () => {
      if (isMobile({featureDetect: true, tablet: true})) {
        const source = imageElement.dataset.src;
        if (source && source.length) {
          imageLoader({ src: source }, image => {
            imageElement.classList.add('lazyloaded');
            imageElement.src = image.src;
            imageElement.removeAttribute('data-src');
          });
        }
      } else {
        const unsubscribe = contextAlpha.subscribe(value => {
          if ($context) {
            $context.globalAlpha = value;
          }
        });
        visible = true;
        $contextAlpha = 1;
        videoElement && videoElement.play();
      }
    },
    exit: () => {
      visible = false;
      videoElement && videoElement.pause();
    }
  });

  function handleMouseMove(e) {
    mX = e.clientX - size.x * 0.5;
    mY = e.clientY - size.y * 0.5;
  }

  function handleMouseLeave(e) {
    const {top, left} = getVideoPosition();
    mX = left;
    mY = top;
  }

  function getVideoPosition() {
    if (videoElement) {
      return videoElement.getBoundingClientRect();
    } else {
      return {top: 0, left: 0};
    }
  }
</script>

<style>

.c-work__media {
  grid-column-start: 3;
  grid-column-end: 11;

  width: 100%;

  opacity: 0;

  transform-style: preserve-3d;
  transition: all 1s var(--ease-in-out);
  transition-property: opacity, transform;
  transform: translateY(40px);

  background: var(--color-primary);

  transition-delay: .35s;
}

img {
  display: inline-block;
  width: 100%;
  min-height: 350px;

  opacity: 0;
  transition: opacity .35s;
}

:global(.lazyloaded) {
  opacity: 1 !important;
}

video {
  display: none;
}

:global(.is-inview).c-work__content .c-work__media {
  transform: none;
  opacity: 1;
}

@media screen and (min-width: 40em) {
  .c-work__media {
    position: relative;
    grid-column-start: 1;
    grid-column-end: 13;

    height: 0;
    padding-bottom: 56.556%;

    border: solid 1px var(--color-grey);
    background-color: transparent;

    transform: translateY(30%) scale(1.05);
    transition-delay: 0s;
  }

  .c-work__inner {
    position: absolute;
    top: 8%;
    left: 10%;
    right: 10%;
    bottom: 8%;
  
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    display: none;
  }

  video {
    display: inline-block;

    width: 56.556%;
    height: 56.556%;

    visibility: hidden;
  }
}
</style>

<div 
  class="l-grid c-work__content"
  data-scroll
  data-scroll-offset="100"
  data-scroll-position="bottom"
>
  <div class="c-work__media">
    <div
      class="c-work__inner"
      data-scroll
      data-scroll-call={uid}
      data-scroll-repeat
      data-scroll-position={trigger || 'bottom'}
      data-scroll-offset="10%"
      on:mousemove={handleMouseMove}
      on:mouseleave={handleMouseLeave}
    >      
      <img
        alt="{RichText.asText(title)}"
        data-src="{image.url}"
        src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        bind:this={imageElement}
      />
      {#if video.url}
        <video 
          autoplay
          muted
          loop
          playsinline
          bind:this={videoElement}
        >
          <source data-src={video.url} type="video/mp4">
        </video>
      {/if}
    </div>
  </div>
</div>
