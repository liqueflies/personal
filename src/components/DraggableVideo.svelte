<script context="module">
  import { onMount, onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';

  import { scrollable } from '../context/scroll';
  import { renderable, context, height, width } from '../context/canvas';
  import { videoLoader } from '../utils/lazy';
  import { lerp } from '../utils/math';
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

  let texture;
  let videoElement;
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

      $context.imageSmoothingEnabled = false;
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
    enter: async () => {
      contextAlpha.subscribe(value => {
        if ($context) {
          $context.globalAlpha = value;
        }
      });
      visible = true;
      $contextAlpha = 1;
      videoElement && videoElement.play();
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
.c-video {
  position: relative;

  grid-column-start: 1;
  grid-column-end: 13;

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
  top: 12%;
  left: 15%;
  right: 15%;
  bottom: 12%;

  display: flex;
  align-items: center;
  justify-content: center;
}

video {
  display: inline-block;

  width: 70%;
  height: 70%;

  visibility: hidden;
}

:global(.is-inview) .c-video {
  transform: none;
  opacity: 1;
}
</style>

<div class="l-grid">
  <div 
    class="c-video"
    data-scroll
    data-scroll-repeat
    data-scroll-call={uid}
    data-scroll-offset="10%"
    data-scroll-position={trigger || 'bottom'}
  >
    <div
      class="c-video__container"
      on:mousemove={handleMouseMove}
      on:mouseleave={handleMouseLeave}
    >
      <video autoplay muted loop playsinline bind:this={videoElement}>
        <source data-src={video.url} type="video/mp4">
      </video>
    </div>
  </div>
</div>
