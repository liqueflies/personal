<script>
  import { onDestroy } from 'svelte';

  import Marquee from '../components/Marquee.svelte';

  import emitter from '../emitter';

  let patchRef;
  
  function onScroll(instance) {
    const progress = patchRef.offsetHeight * instance.scroll.y / instance.limit;
    patchRef.style.transform = `scaleX(${1 + progress * 0.01 })`;
  }

  function unsubscribe() {
    emitter.off('scroll', onScroll);
  }
  
  emitter.on('scroll', onScroll);
  onDestroy(unsubscribe);
</script>

<style>
.c-hero {
  position: relative;
  margin: 0;
  text-align: center;
  padding-bottom: calc( var( --font-size-h1 ) / 2 );
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background-color: #333;
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
}
</style>

<div data-scroll-section class="l-container l-container--full">
  <figure class="c-hero l-grid">
    <div class="l-container l-container--small c-hero__frame">
      <img
        class="c-hero__image"
        srcset="lollo@mobile.jpg 240w, lollo.jpg 720w"
        src="lollo@mobile.jpg"
        alt="Lorenzo Girardi - Creative Technologist" />
      <div class="c-hero__patch" bind:this={patchRef}></div>
    </div>
    <figcaption class="l-container l-container--full c-hero__caption">
      <Marquee text="Lorenzo Girardi" />
    </figcaption>
  </figure>
</div>