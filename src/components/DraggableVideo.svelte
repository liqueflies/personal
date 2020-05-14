<script context="module">
  import { onMount, onDestroy } from 'svelte';

  import { scrollable } from '../context/scroll';
  import { renderable, context, height, width } from '../context/canvas';
  import { lazyVideo } from '../utils/lazy';
  import { lerp } from '../utils/math';
  import { ready } from '../store'
</script>

<script>
  export let uid;
  export let video;

  const frames = [];
  const size = { x: 0, y: 0 };

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;

  let vw;

  let texture;
  let videoEl;
  let containerEl;

  let visible;
  let trigger;
  let scrolling;
  let moving;

  onMount(() => {
    function Video() {
      const {top, left} = getVideoBounds();
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

  ready.subscribe(async isReady => {
    if (isReady) {
      await lazyVideo(videoEl);
      texture = videoEl;
      updateSize();
      stop();
    }
  });

  renderable({
    setup: props => {
      $context.imageSmoothingEnabled = false;
    },
    render: props => {
      if (visible && texture) {

        // force opacity 1
        if ($context.globalAlpha !== 1) {
          $context.globalAlpha = 1;
        }

        let intensity = scrolling ? 0.7 : 0.35;
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
    scroll: ({ speed, direction, delta, scroll, instance }) => {
      const {top, left} = getVideoBounds();
      mX = left;
      mY = top;

      scrolling = !delta || Math.abs(speed) > 0;
      const dir = direction || window.pageYOffset - scroll.y < 0 ? 'up' : 'down';

      const prevTrigger = trigger;
      trigger = dir === 'down' ? 'bottom' : 'top';

      if (prevTrigger !== trigger) {
        instance.update();
      }
    },
    enter: async () => {
      play();
      visible = true;
    },
    exit: () => {
      pause();
      visible = false;
      const {top, left} = getVideoBounds();

      frames.forEach((e, i) => {
        e.x = left;
        e.y = top;
      });
    }
  });

  function stop() {
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  }

  function play() {
    if (videoEl) {
      videoEl.play();
    }
  }

  function pause() {
    if (videoEl) {
      videoEl.pause();
    }
  }

  function updateSize() {
    size.x = videoEl.offsetWidth;
    size.y = videoEl.offsetHeight;
  }

  function getVideoBounds() {
    if (videoEl) {
      return videoEl.getBoundingClientRect();
    } else {
      return {top: 0, left: 0, width: 0, height: 0};
    }
  }

  function getContainerBounds() {
    if (containerEl) {
      return containerEl.getBoundingClientRect();
    } else {
      return {top: 0, left: 0, width: 0, height: 0};
    }
  }

  function handleMouseMove(e) {
    const {top, left, bottom, right, width, height} = getContainerBounds();

    if (moving && top < y && left < x && right > x + size.x && bottom > y + size.y) {
      const vwHalf = width * 0.5;
      const vhHalf = height * 0.5;
      const vwPercentage = (e.clientX - left) / vwHalf;
      const vhPercentage = (e.clientY - top) / vhHalf;

      mX = e.clientX - ( size.x * ( 0.5 * vwPercentage ) );
      mY = e.clientY - ( size.y * ( 0.5 * vhPercentage ) );
    } else {
      moving = false;
    
      const {top: t, left: l} = getVideoBounds();
      mX = l;
      mY = t;
    }
  }

  function handleMouseEnter(e) {
    moving = true;
  }

  function handleResize() {
    updateSize();
  }
</script>

<style>
.c-video {
  position: relative;

  height: 0;
  padding-bottom: 56.556%;

  border: solid 1px var(--color-grey);
  background-color: transparent;

  transform: translate3d(0, 20%, 0);
  transform-origin: 50% 50%;
  transform-style: preserve-3d;

  opacity: 0;
  
  transition: all 1.25s var(--ease-in-out);
  transition-property: opacity, transform;
}

.c-video__container {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.c-video__container::before,
.c-video__container::after {
  content: "";
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
}

.c-video__container::before {
  left: 0;
}

.c-video__container::after {
  right: 0;
}

video {
  width: 48%;
  height: 48%;
  
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  margin: auto;
}

video {
  visibility: hidden;
}

:global(.is-inview) .c-video {
  transform: none;
  opacity: 1;
}
</style>

<svelte:window
  bind:innerWidth={vw}
  on:resize={handleResize}
/>

<div class="l-grid">
  <div class="l-container">
    <div 
      class="c-video"
      data-scroll
      data-scroll-repeat
      data-scroll-call={uid}
      data-scroll-offset="-10%"
      data-scroll-position={trigger || 'bottom'}
    >
      <div
        class="c-video__container"
        bind:this={containerEl}
        on:mouseenter={handleMouseEnter}
        on:mousemove={handleMouseMove}
      >
        <video autoplay muted loop playsinline bind:this={videoEl}>
          <source data-src={video.url} type="video/mp4">
        </video>
      </div>
    </div>
  </div>
</div>