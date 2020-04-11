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
  
  let isPlaying = false;
  let isExited = true;

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

      x = mX;
      y = mY;

      frames.forEach((e, i) => {
        const next = frames[i + 1] || frames[0];

        e.draw(x, y);

        x = lerp(x, next.x, 0.85);
        y = lerp(y, next.y, 0.8);

        $context.globalCompositeOperation = 'destination-over';
      });
    }
  });

  function handleScrollCall({ value, way }) {
    if (value === CALL_VALUE) {
      isExited = way === 'exit';
    }
  }

  function handleScroll(instance) {
    const {top, left} = videoElement.getBoundingClientRect();
    mX = left;
    mY = top;
  }

  function handleMouseMove(e) {
    mX = e.clientX - size.x * 0.5;
    mY = e.clientY - size.y * 0.5;
  }

  function handleMouseEnter(e) {
    isPlaying = true;
    videoElement.play();
  }

  function handleMouseLeave(e) {
    videoElement.pause();
    const {top, left} = videoElement.getBoundingClientRect();
    mX = left;
    mY = top;

    // setTimeout(() => {
    //   isPlaying = false;
    // }, 400);
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
    padding-bottom: 56.566%;

    transform: translateY(30%) scale(1.05);
    transition-delay: 0s;
  }

  .c-work__inner {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .c-work__media video {
    display: inline-block;
    width: 65%;
    height: 65%;

    visibility: hidden;
  }
  
  .c-work__media video.hidden {
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
      on:mousemove={handleMouseMove}
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
    >      
      <!-- {#if image.mobile.url}
        <img
          data-src="{image.url}"
          alt="{image.alt}"
          bind:this={imageElement}
        />
      {/if} -->
      {#if video.url}
        <video 
          autoplay
          muted
          loop
          playsinline
          poster={image.url}
          bind:this={videoElement}
          class:hidden={isPlaying}
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
