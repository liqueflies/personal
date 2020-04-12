<script>
  import { onDestroy } from 'svelte';

  import emitter from '../emitter';

  export let text;

  let transform = 0;
  let isExited = false;
  const CALL_VALUE = 'marquee';

  function onScroll(instance) {
    if (isExited) {
      // avoid continuously set to 0.
      if (transform === 0) {
        return false;
      }
  
      transform = 0;
    } else {
      transform -= Math.min(Math.abs(instance.speed), 5);
    }
  }

  function onCall({ value, way }) {
    if (value === CALL_VALUE) {
      isExited = way === 'exit';
    }
  }

  function unsubscribe() {
    emitter.off('call', onCall);
    emitter.off('scroll', onScroll);
  }

  emitter.on('call', onCall);
  emitter.on('scroll', onScroll);
  onDestroy(unsubscribe);
</script>

<style>
@keyframes marquee {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}

:root {
  --loading-marquee-delay: .1s;
}

.o-marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
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
  padding: 0 calc( var( --spacer ) * 4 );

  white-space: nowrap;
  will-change: transform;
}

.o-marquee__wrapper {
  transform: translateX(100%);
  transition: transform var(--loading-reveal-time) var(--ease-in-out);
  transition-delay: calc( var(--loading-reveal-delay) + var(--loading-marquee-delay) );
}

:global(.has-loaded-content) .o-marquee__wrapper {
  transform: translateX(0%);
}

:global(.has-loaded-content) .o-marquee__label::after,
:global(.has-loaded-content) .o-marquee__label::before {
  animation: marquee 20s linear infinite;
  animation-delay: calc( var(--loading-reveal-delay) + var(--loading-marquee-delay) );
}

@media screen and (min-width: 40em) {
  .o-marquee__label::after,
  .o-marquee__label::before {
    padding: 0 calc( var( --spacer ) * 8 );
  }
}
</style>

<div class="o-marquee">
  <div class="o-marquee__wrapper">
    <h1
      data-text="{text}"
      data-scroll
      data-scroll-call="{CALL_VALUE}"
      data-scroll-repeat
      class="o-marquee__label"
      style="transform: translate3d({transform}px, 0, 0);"
    >
        <span class="visually-hidden">{text}</span>
    </h1>
  </div>
</div>