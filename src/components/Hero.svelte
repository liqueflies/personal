<script>
  import { onMount, onDestroy } from 'svelte';

  import Marquee from '../components/Marquee.svelte';
  import { pictureLoader } from '../utils/loader';
  import emitter from '../emitter';

  const CALL_VALUE = 'hero';

  let vw;
  let patchElement;
  let pictureElement;

  let isExited = false;

  onMount(() => {
    pictureLoader(pictureElement, () => {
      setTimeout(() => {
        document.documentElement.classList.add('has-loaded-content');
      }, 10);
    })
  });

  function onCall({ value, way }) {
    if (value === CALL_VALUE) {
      isExited = way === 'exit';
    }
  }
  
  function onScroll(instance) {
    if (isExited) {
      return false;
    }
    const progress = patchElement.offsetHeight * instance.scroll.y / instance.limit;
    patchElement.style.transform = `scaleX(${(vw / patchElement.offsetWidth) - 1 + progress * 0.01 })`;
  }

  function unsubscribe() {
    emitter.off('scroll', onScroll);
    emitter.off('call', onCall);
  }
  
  emitter.on('scroll', onScroll);
  emitter.on('call', onCall);
  onDestroy(unsubscribe);
</script>

<style>
:root {
  --loading-reveal-delay: 1.6s;
  --loading-stroke-time: 2.6s;
  --loading-reveal-time: 1.6s;
}

.c-hero {
  position: relative;

  margin: 0;
  padding-bottom: calc( var( --font-size-h1 ) / 2 );

  overflow: hidden;

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
  transform: scale(0.85);
  transition: transform var(--loading-reveal-time) var(--ease-in-out);
}

.c-hero__image,
.c-hero__loading-left,
.c-hero__loading-right {
  transition-delay: var(--loading-reveal-delay);
}

:global(.has-loaded-content) .c-hero__image {
  transform: scale(1);
}


:global(.has-loaded-content) .c-hero__loading-stroke {
  transform: scaleY(0);
}

:global(.has-loaded-content) .c-hero__loading-left,
:global(.has-loaded-content) .c-hero__loading-right {
  transform: scaleX(0);
}

@media screen and (min-width: 40em) {
  .c-hero {
    padding-bottom: 0;
    height: 100vh;
  }

  .c-hero__image {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  .c-hero__caption {
    bottom: calc( var(--spacer) * 6 );
  }

  .c-hero__patch {
    display: block;
  }
}
</style>

<svelte:window
  bind:innerWidth={vw}
/>

<div data-scroll-section class="l-container l-container--full">
  <figure class="c-hero l-grid" data-scroll data-scroll-repeat data-scroll-call={CALL_VALUE}>
    <div class="l-container l-container--small c-hero__frame">
      <picture bind:this={pictureElement}>
        <source
          media="(max-width: 768px)"
          data-srcset="lollo@mobile.webp"
          type="image/webp"
        />
        <source 
          media="(max-width: 768px)"
          data-srcset="lollo@mobile.jpg"
          type="image/jpeg"
        />
        <source
          data-srcset="lollo.webp"
          type="image/webp"
        />
        <img
          class="c-hero__image"
          data-src="lollo.jpg"
          alt="Lorenzo Girardi - Creative Technologist"
        />
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