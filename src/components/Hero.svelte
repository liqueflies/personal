<script context="module">
  import { onMount } from 'svelte';
  import { tweened } from "svelte/motion";

  import Spacer from '../components/Spacer.svelte';
  import Marquee from '../components/Marquee.svelte';
  import { scrollable } from '../context/scroll';
  import { renderable, context, height, width } from "../context/canvas";
  import { lazyPicture } from '../utils/lazy';
  import { lerp } from '../utils/math';
  import { ready } from '../store';

  const scrollValue = 'hero';
  const size = 90;
</script>

<script>
  const frames = [];

  let patchElement;
  let pictureElement;
  let progress;

  let vh;
  let vw;

  scrollable({
    value: scrollValue,
    scroll: (instance) => {
      if (instance.visible) {
        progress = instance.scroll.y / (patchElement.offsetHeight);
        patchElement.style.transform = `scale3d(${1 + progress}, 1, 1)`;
      }
    }
  });

  onMount(async () => {
    setHeroSize();
    const src = await lazyPicture(pictureElement);
    document.documentElement.classList.add('has-loaded-content');
  });

  function setHeroSize() {
    vh = window.innerHeight;
    vw = window.innerWidth;
  }

  function handleResize() {
    if (vw !== window.innerWidth) {
      setHeroSize();
    }
  }

  function handleTransitionEnd() {
    $ready = true;
  }
</script>

<style>
.c-hero {
  display: flex;

  height: -webkit-fill-available;
  flex-flow: column;
}
.c-hero__figure {
  position: relative;
  width: 100%;

  flex: 0 0 auto;

  margin: 0;
  padding-bottom: calc( var( --font-size-h1 ) / 2 );

  text-align: center;
}

.c-hero__image {
  position: relative;
  z-index: 1;
}

.c-hero__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: 2;
}

.c-hero__frame {
  position: relative;
}

.c-hero__patch,
.c-hero__loading {
  position: absolute;
  top: 0;
  bottom: 0;
}

.c-hero__patch {
  display: none;
  background-color: #333;

  left: 1px;
  right: 1px;
}

.c-hero__loading {
  left: 0;
  right: 0;
}

.c-hero__layout {
  flex: 1 1 auto;

  display: flex;
  align-items: center;
  justify-content: center;
}

.c-hero__loading {
  display: flex;
  justify-content: space-between;

  z-index: 2;
}

.c-hero__loading-left,
.c-hero__loading-right {
  width: 50%;
}

.c-hero__loading-stroke,
.c-hero__loading-left,
.c-hero__loading-right {
  height: 100%;
  background-color: var(--color-bg);
}

.c-hero__loading-stroke {
  width: 1px;
  flex: 0 0 auto;
}

.c-hero__loading-left,
.c-hero__loading-right {
  transition: transform var(--loading-reveal-time) var(--ease-in-out);
}

.c-hero__loading-left {
  transform-origin: 0 0;
}

.c-hero__loading-right {
  transform-origin: 100% 0;
}

.c-hero__loading-stroke {
  transform-origin: 50% 100%;
  transition: transform var(--loading-stroke-time) var(--ease-in-out);
}

.c-hero__image {
  transform: scale3d(0.75, 0.75, 0.75);
  transition: transform var(--loading-reveal-time) var(--ease-in-out);
}

.c-hero__image,
.c-hero__loading-stroke,
.c-hero__loading-left,
.c-hero__loading-right,
.c-hero__patch {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform;
}

.c-hero__image,
.c-hero__loading-left,
.c-hero__loading-right {
  transition-delay: var(--loading-reveal-delay);
}

.c-hero__position {
  opacity: 0;
  
  transform: translateY(20px) scaleY(1.2);
  transform-style: preserve-3d;

  transition: all 1s var(--ease-in-out);
  transition-property: opacity, transform;
  transition-delay: calc( var(--loading-reveal-delay) + var(--loading-marquee-delay) );
}

:global(.has-loaded-content) .c-hero__image {
  transform: scale3d(1, 1, 1);
}


:global(.has-loaded-content) .c-hero__loading-stroke {
  transform: scale3d(1, 0, 1);
}

:global(.has-loaded-content) .c-hero__loading-left,
:global(.has-loaded-content) .c-hero__loading-right {
  transform: scale3d(0, 1, 1);
}

:global(.has-loaded-content) .c-hero__position {
  opacity: 1;
  transform: none;
}

@media screen and (min-width: 40em) {
  .c-hero__image {
    height: 75vh;
  }
}

@media screen and (min-width: 62em) {
  .c-hero__figure {
    padding-bottom: 0;
    overflow: hidden;
  }

  .c-hero__image {
    width: 100%;
    height: 100vh;

    object-fit: cover;
  }

  .c-hero__caption {
    bottom: calc( var(--gutter) * 6 );
  }

  .c-hero__patch {
    display: block;
  }

  .c-hero__layout {
    display: none;
  }
}
</style>

<svelte:window
  on:resize|passive={handleResize}
/>

<div 
  data-scroll-section 
  class="l-container l-container--full">
  <div class="c-hero" style="height: {vh}px">
    <div class="c-hero__position c-hero__layout">
      <span> Creative Technologist </span>
    </div>
    <figure 
      class="c-hero__figure l-grid"
      data-scroll
      data-scroll-repeat
      data-scroll-call={scrollValue}
    >
      <div class="l-container l-container--small c-hero__frame">
        <picture bind:this={pictureElement}>
          <source
            media="(max-width: 992px)"
            data-srcset="lorenzo-girardi@mobile.webp"
            type="image/webp"
          />
          <source 
            media="(max-width: 992px)"
            data-srcset="lorenzo-girardi@mobile.jpg"
            type="image/jpeg"
          />
          <source
            data-srcset="lorenzo-girardi.webp"
            type="image/webp"
          />
          <img
            class="c-hero__image"
            data-src="lorenzo-girardi.jpg"
            alt="Lorenzo Girardi - Creative Technologist"
            on:transitionend={handleTransitionEnd}
          />
        </picture>
        <div class="c-hero__loading">
          <span class="c-hero__loading-left"></span>
          <span class="c-hero__loading-stroke"></span>
          <span class="c-hero__loading-right"></span>
        </div>
        <div class="c-hero__patch" class:ready={$ready} bind:this={patchElement}></div>
      </div>
      <figcaption class="l-container l-container--full c-hero__caption">
        <Marquee text="Lorenzo Girardi" />
      </figcaption>
    </figure>
    <div class="c-hero__layout">
    </div>
  </div>
</div>