<script>
  import { onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';

  import { renderable, context, height, width } from '../context/canvas';
  import { imageLoader, videoLoader } from '../utils/loader';
  import { lerp } from '../utils/math';
  import emitter from '../emitter';

  export let image;
  export let video;
  export let uid;

  const frames = [];
  const size = { x: 0, y: 0 };
  const CALL_VALUE = `media_${uid}`;

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;

  let texture;
  let videoElement;
  
  let isExited = true;

  let contextAlpha = tweened(0, {
    duration: 300,
    easing: linear
  });

  function Video() {
    this.x = ( $width * 0.5 ) - ( size.x * 0.5 );
    this.y = ( $height * 0.5 ) - ( size.y * 0.5 );

    this.draw = function(x, y) {
      $context.drawImage(texture, x, y, size.x, size.y);
      this.x = x;
      this.y = y;
    }
  }

  renderable({
    setup: props => {
      videoLoader(videoElement, () => {
        texture = videoElement;
        size.x = videoElement.offsetWidth;
        size.y = videoElement.offsetHeight;

        videoElement.pause();
        videoElement.currentTime = 0;

        for(let i = 0; i < 4; i++) {
          const e = new Video();
          frames.push(e);
        }
      });
    },
    render: props => {
      if (isExited) {
        return false;
      }

      console.log(`rendering ${uid}`, $context.globalAlpha)

      x = lerp(x, mX, 0.4);
      y = lerp(y, mY, 0.4);

      frames.forEach((e, i) => {
        const next = frames[i + 1] || frames[0];

        e.draw(x, y);

        x = lerp(x, next.x, 0.85);
        y = lerp(y, next.y, 0.8);

        $context.globalCompositeOperation = 'destination-over';
      });
    }
  });

  function handleMouseMove(e) {
    mX = e.clientX - size.x * 0.5;
    mY = e.clientY - size.y * 0.5;
  }

  function handleMouseLeave(e) {
    if (videoElement) {
      const {top, left} = videoElement.getBoundingClientRect();
      mX = left;
      mY = top;
    }
  }

  function handleScrollCall({ value, way }) {
    if (value === CALL_VALUE) {
      isExited = way === 'exit';

      contextAlpha.subscribe(value => {
        console.log(`alpha ${uid}`, value);
  
        if ($context) {
          $context.globalAlpha = value;
        }
      });
      
      if (isExited) {
        console.log(`exited ${uid}`)
        videoElement && videoElement.pause();
        // $contextAlpha = 0;
      } else {
        console.log(`entered ${uid}`)
        $contextAlpha = 1;
        videoElement && videoElement.play();
      }
    }
  }

  function handleScroll(instance) {
    if (videoElement) {
      const {top, left} = videoElement.getBoundingClientRect();
      mX = left;
      mY = top;
    }
  }

  function unsubscribe() {
    emitter.off('call', handleScrollCall);
    emitter.off('scroll', handleScroll);
  }

  emitter.on('call', handleScrollCall);
  emitter.on('scroll', handleScroll);
  onDestroy(unsubscribe);
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

  transition-delay: .35s;
}

.c-work__media img {
  display: inline-block;
  width: 100%;
  min-height: 350px;
  
  background: var(--color-primary);
}

.c-work__media video {
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

  .c-work__media img {
    display: none;
  }

  .c-work__media video {
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
  <div
    class="c-work__media"
  >
    <div
      class="c-work__inner"
      on:mousemove={handleMouseMove}
      on:mouseleave={handleMouseLeave}
    >      
      {#if image.mobile.url}
        <img
          data-src="{image.mobile.url}"
          alt="{image.alt}"
        />
      {/if}
      {#if video.url}
        <video 
          autoplay
          muted
          loop
          playsinline
          bind:this={videoElement}
              data-scroll
    data-scroll-repeat
    data-scroll-call={CALL_VALUE}
    data-scroll-position="bottom"
        >
          <source data-src={video.url} type="video/mp4">
        </video>
      {/if}
    </div>
  </div>
</div>
