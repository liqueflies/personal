<script>
  import { onDestroy } from 'svelte';

  import Marquee from '../components/Marquee.svelte';
  import emitter from '../emitter';

  const CALL_VALUE = 'hero';

  let vw;
  let patchElement;
  let isExited = false;

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

.c-hero__patch {
  display: none;
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
    
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: #333;
  }
}
</style>

<svelte:window
  bind:innerWidth={vw}
/>

<div data-scroll-section class="l-container l-container--full">
  <figure class="c-hero l-grid" data-scroll data-scroll-repeat data-scroll-call={CALL_VALUE}>
    <div class="l-container l-container--small c-hero__frame">
      <picture>
        <source
          media="(max-width: 768px)"
          srcset="lollo@mobile.webp"
          type="image/webp"
        />
        <source 
          media="(max-width: 768px)"
          srcset="lollo@mobile.jpg"
          type="image/jpeg"
        />
        <source
          srcset="lollo.webp"
          type="image/webp"
        />
        <img
          class="c-hero__image"
          src="lollo.jpg"
          alt="Lorenzo Girardi - Creative Technologist"
        />
      </picture>
      <div class="c-hero__patch" bind:this={patchElement}></div>
    </div>
    <figcaption class="l-container l-container--full c-hero__caption">
      <Marquee text="Lorenzo Girardi" />
    </figcaption>
  </figure>
</div>