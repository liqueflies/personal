<script context="module">
  // import { scrollable } from '../context/scroll';
  import { lerp } from '../utils/math';
</script>

<script>
  export let text;

  let transform = 0;
  const scrollValue = 'marquee';

  // scrollable({
  //   value: scrollValue,
  //   scroll: ({ speed, visible }) => {
  //     if (visible) {
  //       const movement = Math.min(Math.abs(speed), 10) * 0.2;
  //       transform -= movement;
  //     } else {
  //       // avoid continuously set to 0.
  //       if (transform === 0) {
  //         return false;
  //       }
  //       transform = 0;
  //     }
  //   }
  // });
</script>

<style>
@keyframes marquee {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-100%, 0, 0);
  }
}

.o-marquee {
  position: relative;
  width: 100%;
  overflow: hidden;

  z-index: 1;
}

.o-marquee__label {
	line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
}

.o-marquee__label::after,
.o-marquee__label::before {
  display: inline-block;
  content: attr(data-text);
  padding: 0 calc( var( --gutter ) * 4 );

  white-space: nowrap;
  will-change: transform;
  transform-style: preserve-3d;
}

.o-marquee__wrapper {
  transform: translate3d(100%, 0, 0);
  transform-style: preserve-3d;
  backface-visibility: hidden;

  transition: transform var(--loading-reveal-time) var(--ease-in-out);
  transition-delay: calc( var(--loading-reveal-delay) + var(--loading-marquee-delay) );
}

:global(.has-loaded-content) .o-marquee__wrapper {
  transform: translate3d(0, 0, 0);
}

:global(.has-loaded-content) .o-marquee__label::after,
:global(.has-loaded-content) .o-marquee__label::before {
  animation: marquee 20s linear infinite;
  animation-delay: calc( var(--loading-reveal-delay) + var(--loading-marquee-delay) );
}

@media screen and (min-width: 40em) {
  .o-marquee__label::after,
  .o-marquee__label::before {
    padding: 0 calc( var(--gutter) * 8 );
  }
}
</style>

<div 
  class="o-marquee"
  data-scroll
  data-scroll-repeat
  data-scroll-call="{scrollValue}">
  <div class="o-marquee__wrapper">
    <h1
      data-text="{text}"
      class="o-marquee__label"
      style="transform: translate3d({transform}px, 0, 0);"
    >
      <span class="visually-hidden">{text}</span>
    </h1>
  </div>
</div>