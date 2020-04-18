<script context="module">
  import { onMount } from "svelte";
  import Glide from "@glidejs/glide";

  import { scrollable } from '../context/scroll';
  import { lazyImage } from '../utils/lazy';
</script>

<script>
  export let carousel;
  export let uid;

  let slidesElement;

  scrollable({
    value: uid,
    enter: () => {
      const images = Array.from(slidesElement.querySelectorAll('img'));
      const lazyPromises = images.map(i => lazyImage(i));
      Promise.all(lazyPromises).then(sources => {
        const glide = new Glide(`.${uid}`, {
          type: "carousel",
          gap: 24,
          focusAt: "center",
          perView: 1.5,
        }).mount();
      });
    }
  });
</script>

<style>
  .c-carousel {
    transform: translate3d(0, 20%, 0);
    transform-origin: 50% 50%;
    transform-style: preserve-3d;

    min-height: 350px;

    opacity: 0;
    
    transition: all 1.25s var(--ease-in-out);
    transition-property: opacity, transform;
  }

  :global(.is-inview) .c-carousel {
    transform: none;
    opacity: 1;
  }

  .glide {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  .glide * {
    box-sizing: inherit;
  }

  .glide__track {
    overflow: hidden;
  }

  .glide__slides {
    position: relative;
    width: 100%;
    list-style: none;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    touch-action: pan-Y;
    overflow: hidden;
    padding: 0;
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
    will-change: transform;
  }

  .glide__slides--dragging {
    user-select: none;
  }

  .glide__slide {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    white-space: normal;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }

  .glide__slide a {
    user-select: none;
    -webkit-user-drag: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .glide__arrows {
    -webkit-touch-callout: none;
    user-select: none;
  }

  .glide__bullets {
    -webkit-touch-callout: none;
    user-select: none;
  }

  .glide--rtl {
    direction: rtl;
  }
</style>

<div class="c-carousel" data-scroll data-scroll-offset="-50%" data-scroll-call={uid}>
  <div class="glide {uid}">
    <div class="glide__track" data-glide-el="track">
      <div class="glide__slides" bind:this={slidesElement}>
        {#each carousel as item, i}
          <div class="glide__slide">
            <img data-src={item.image.url} alt={item.image.alt} />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
