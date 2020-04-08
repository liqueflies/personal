<script>
  import { onDestroy } from 'svelte';

  import emitter from '../emitter';

  let transform = 0;
  const CALL_VALUE = 'marquee';

  function onScroll(instance) {
    transform -= Math.min(Math.abs(instance.speed), 5);
  }

  function onCall({ value, way, obj }) {
    if (value === CALL_VALUE && way === 'exit') {
      // avoid continuously set to 0.
      if (transform === 0) {
        return false;
      }
  
      transform = 0;
    }
  }

  function unsubscribe() {
    emitter.off('scroll', onScroll);
    emitter.off('call', onScroll);
  }

  emitter.on('call', onCall);
  emitter.on('scroll', onScroll);
  onDestroy(unsubscribe);

  export let text;
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
  animation: marquee 20s linear infinite;
}

@media screen and (min-width: 40em) {
  .o-marquee__label::after,
  .o-marquee__label::before {
    padding: 0 calc( var( --spacer ) * 8 );
  }
}
</style>

<div class="o-marquee">
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