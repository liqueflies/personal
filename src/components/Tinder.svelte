<script context="module">
  import { onMount, setContext } from 'svelte';
  import { RichText } from 'prismic-dom';

  import Card from '../components/Card';
  import { key } from '../context/swipe';
</script>

<script>
  export let uid;
  export let title;
  export let carousel;

  let active = 0;
  let next = 1;

  let el;
  let parentEl;
  let listeners = [];

  onMount(async () => {
    const H = await import('hammerjs');
    const Hammer = H.default;

    listeners.forEach(entity => {
      entity.ready = true;
      entity.run(Hammer);
    });
  });

  setContext(key, {
    add (fn) {
      this.remove(fn);
      listeners.push(fn);
    },
    remove (fn) {
      const idx = listeners.indexOf(fn);
      if (idx >= 0) listeners.splice(idx, 1);
    }
  });

  function handleTransitionEnd(event) {
    const { index } = event.detail;
    active = toNext(index);
    next = toNext(active);
  }

  function toNext(i) {
    const l = carousel.length - 1;
    return (i + 1) > l ? 0 : i + 1;
  }
</script>

<style>
  .c-tinder {
    position: relative;
    width: 100%;
    
    height: 0;
    padding-bottom: 180%;

    grid-column-start: 3;
    grid-column-end: -3;

    transform: translate3d(0, 20%, 0);
    transform-origin: 50% 50%;
    transform-style: preserve-3d;

    opacity: 0;
    
    transition: all 1s var(--ease-in-out);
    transition-property: opacity, transform;
  }

  :global(.is-inview) .c-tinder {
    transform: none;
    opacity: 1;
  }
</style>

<div class="l-grid" bind:this={parentEl}>
  <div class="c-tinder">
    {#each carousel as item, i (item.image.url)}
      <Card
        uid={uid}
        src={item.image.url}
        alt={RichText.asText(title)}
        index={i}
        active={active === i}
        next={next === i}
        parentEl={parentEl}
        on:transitionend={handleTransitionEnd}
      />
    {/each}
  </div>
</div>