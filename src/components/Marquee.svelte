<script>
  import { onDestroy } from 'svelte';

  import { scrollInstance } from '../store';
  import { isElementInViewport } from '../utils';

  let labelRef;
  let transform = 0;

  const unsubscribe = scrollInstance.subscribe(instance => {
    if (!instance) {
      return false;
    }

    if (isElementInViewport(labelRef)) {
      transform -= Math.min(Math.abs(instance.speed), 5);
    } else {
      if (transform === 0) {
        // avoid continuously set to 0.
        return false;
      }
      
      transform = 0;
    }
    
    labelRef.style.transform = `translate3d(${transform}px, 0, 0)`;
  });

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
  <h1 class="o-marquee__label" data-text="{text}" bind:this={labelRef}>
    <span class="visually-hidden">{text}</span>
  </h1>
</div>