<script context="module">
  import { onMount } from 'svelte';
  import { RichText } from 'prismic-dom';
  import Glide from '@glidejs/glide';

  import { scrollable } from '../context/scroll';
  import { lazyImage } from '../utils/lazy';
</script>

<script>
  export let uid;
  export let title;
  export let carousel;

  let slidesElement;

  let a = 0;
  let b = 0;
  let g = 0;

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
          duration: 250
        }).mount();
      });
    }
  });

  // onMount(async () => {
  //   if (DeviceOrientationEvent && DeviceOrientationEvent.requestPermission) {
  //     const response = await DeviceOrientationEvent.requestPermission();
  //     if (response === 'granted') {
  //       window.addEventListener('deviceorientation', handleOrientation);
  //     }
  //   }
  // });

  // function handleOrientation(event) {
  //   a = event.alpha;
  //   b = event.beta * 0.15;
  //   g = Math.min(event.gamma, 15);
  // }
</script>

<style>
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

  .c-carousel {
    --carousel-offset: calc( var(--gutter) );

    position: relative;
    
    width: 100%;
    height: 0;
    
    padding-bottom: calc( 115% + var(--carousel-offset) );

    transform: translate3d(0, 20%, 0);
    transform-origin: 50% 50%;
    transform-style: preserve-3d;

    opacity: 0;
    
    transition: all 1.25s var(--ease-in-out);
    transition-property: opacity, transform;
  }

  .c-carousel__el {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .c-carousel__track {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .c-carousel__slide {
    position: relative;
  }

  .c-carousel__shadow {
    position: absolute;
    top: calc(var(--carousel-offset) * 0.5);
    left: calc(50% + var(--carousel-offset));
    
    width: calc(80% - var(--gutter) * 6);
    height: 100%;
    
    transform: translateX(-50%);

    z-index: -1;
  }

  .c-carousel__bg {
    width: 100%;
    height: 100%;

    background-color: var(--color-primary);
  }

  .c-carousel__slide.glide__slide--active .c-carousel__shadow {
    transform: none;
  }

  .c-carousel__slides {
    height: 100%;
  }

  img {
    position: relative;
    z-index: 1;
  }

  :global(.is-inview) .c-carousel {
    transform: none;
    opacity: 1;
  }
</style>

<div class="c-carousel" data-scroll data-scroll-offset="-80%" data-scroll-call={uid}>
  <div class="glide {uid} c-carousel__el">
    <div class="glide__track c-carousel__track" data-glide-el="track">
      <div class="glide__slides c-carousel__slides" bind:this={slidesElement}>
        {#each carousel as item, i}
          <div class="glide__slide c-carousel__slide">
            <img data-src={item.image.url} alt={RichText.asText(title)} />
          </div>
        {/each}
      </div>
    </div>
  </div>
  <div class="c-carousel__shadow">
    <div class="c-carousel__bg" data-scroll data-scroll-speed="1.5" data-scroll-delay="0.05"></div>
    <!-- <div class="c-carousel__bg" style="transform: translate3d({g}px, {b}px, 0)"></div> -->
  </div>
</div>