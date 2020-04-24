<script context="module">
  import { onMount, onDestroy } from 'svelte';
  import { tweened } from "svelte/motion";

  import Marquee from '../components/Marquee.svelte';
  import { scrollable } from '../context/scroll';
  import { renderable, context, height, width } from "../context/canvas";
  import { hasTransitionEnd } from '../store/loader';
  import { lazyPicture } from '../utils/lazy';
  import { lerp } from '../utils/math';

  const scrollValue = 'hero';
  const size = 90;
</script>

<script>
  const frames = [];

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;

  let patchElement;
  let pictureElement;
  let progress;

  let scroll;
  let texture;
  let visible = true;
  let alpha = tweened(0);

  function CanvasImage() {
    this.x = 0;
    this.y = 0;

    this.draw = function(x, y) {
      if (texture) {
        $context.drawImage(texture, x, y, size, size);
      }

      this.x = x;
      this.y = y;
    };
  }

  renderable({
    setup: async props => {
      texture = await lazyPicture(scroll);

      for (let i = 0; i < 4; i++) {
        const e = new CanvasImage();
        frames.push(e);
      }

      alpha.subscribe(value => {
        $context.globalAlpha = value;
        if (value === 0) texture = null;
      });
    },
    render: props => {
      if (visible) {
        x = lerp(x, mX, 0.4);
        y = lerp(y, mY, 0.4);

        frames.forEach((e, i) => {
          const next = frames[i + 1] || frames[0];

          e.draw(x, y);

          x = lerp(x, next.x, 0.85);
          y = lerp(y, next.y, 0.7);

          $context.globalCompositeOperation = "destination-over";
        });
      }
    }
  });

  scrollable({
    value: scrollValue,
    scroll: (instance) => {
      if (instance.visible) {
        progress = instance.scroll.y / (patchElement.offsetHeight);
        patchElement.style.transform = `scale3d(${1 + progress}, 1, 1) perspective(1px)`;
      }
    }
  });

  onMount(async () => {
    const src = await lazyPicture(pictureElement);
    document.documentElement.classList.add('has-loaded-content');
  });

  function handleTransitionEnd() {
    $alpha = 1;
    $hasTransitionEnd = true;
  }

  function handleMouseMove(e) {
    mX = e.clientX - size * 0.5;
    mY = e.clientY - size * 0.5;
  }

  function handleMouseEnter(e) {
    frames.forEach(e => {
      e.x = mX;
      e.y = mY;
    });

    $alpha = 1;
  }

  function handleMouseLeave(e) {
    $alpha = 0;
  }
</script>

<style>
.c-hero {
  position: relative;

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
  left: 0;
  width: 100%;
  height: 100%;
}

.c-hero__patch {
  display: none;
  background-color: #333;
}

.c-hero__loading {
  display: flex;
  justify-content: space-between;

  z-index: 2;
}

.c-hero__loading-left,
.c-hero__loading-right {
  width: calc( 50% - 1px );
}

.c-hero__loading-stroke,
.c-hero__loading-left,
.c-hero__loading-right {
  height: 100%;
  background-color: var(--color-bg);
}

.c-hero__loading-stroke {
  width: 2px;
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
  transform: scale3d(0.75, 0.75, 0.75) perspective(1px);
  transition: transform var(--loading-reveal-time) var(--ease-in-out);
}

.c-hero__image,
.c-hero__loading-stroke,
.c-hero__loading-left,
.c-hero__loading-right,
.c-hero__patch {
  transform-style: preserve-3d;
}

.c-hero__image,
.c-hero__loading-left,
.c-hero__loading-right {
  transition-delay: var(--loading-reveal-delay);
}

:global(.has-loaded-content) .c-hero__image {
  transform: scale3d(1, 1, 1) perspective(1px);
}


:global(.has-loaded-content) .c-hero__loading-stroke {
  transform: scale3d(1, 0, 1) perspective(1px);
}

:global(.has-loaded-content) .c-hero__loading-left,
:global(.has-loaded-content) .c-hero__loading-right {
  transform: scale3d(0, 1, 1) perspective(1px);
}

@media screen and (min-width: 40em) {
  .c-hero {
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
}
</style>

<div 
  data-scroll-section 
  class="l-container l-container--full">
  <figure 
    class="c-hero l-grid"
    data-scroll
    data-scroll-repeat
    data-scroll-call={scrollValue}
  >
    <div class="l-container l-container--small c-hero__frame">
      <picture bind:this={pictureElement}>
        <source
          media="(max-width: 768px)"
          data-srcset="lorenzo-girardi@mobile.webp"
          type="image/webp"
        />
        <source 
          media="(max-width: 768px)"
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
      <picture class="visually-hidden" bind:this={scroll}>
        <source data-srcset="scroll.webp" type="image/webp" />
        <img data-src="scroll.png" alt="Scroll" />
      </picture>
      <div class="c-hero__loading">
        <span class="c-hero__loading-left"></span>
        <span class="c-hero__loading-stroke"></span>
        <span class="c-hero__loading-right"></span>
      </div>
      <div class="c-hero__patch" bind:this={patchElement}></div>
    </div>
    <figcaption class="l-container l-container--full c-hero__caption">
      <Marquee text="Lorenzo Girardi" />
    </figcaption>
  </figure>
</div>