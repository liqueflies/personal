<script context="module">
  import { onMount, setContext } from 'svelte';
  import { RichText } from 'prismic-dom';

  import Card from '../components/Card';
  import { key } from '../context/swipe';
  import { ready } from '../store';
</script>

<script>
  export let uid;
  export let title;
  export let carousel;

  let active = 0;
  let next = 1;
  let subsequent = 2;

  let el;
  let parentEl;
  let listeners = [];

  ready.subscribe(async value => {
    if (value) {
      const H = await import('hammerjs');
      const Hammer = H.default;

      listeners.forEach(entity => {
        entity.ready = true;
        entity.run(Hammer);
      });
    }
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
    subsequent = toNext(next);
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

    transform: translate3d(0, 30%, 0);
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
    
    transition: all 1.15s var(--ease-in-out);
    transition-property: opacity, transform;
  }

    .relative {
    position: relative;
  }

  ol {
    position: absolute;
    display: inline-block;
    top: 50%;
    transform: translateY(-50%);

    list-style: none;

    right: calc(var(--gutter) * -0.5);

    margin: 0;
    padding: 0;
  }

  ol li {
    display: block;
    /* width: var(--gutter);
    height: var(--gutter); */

    margin-bottom: calc(var(--gutter) * 1.5);

    opacity: 0;

    transform: translate3d(0, calc(var(--gutter) * 3), 0);
    transform-origin: 50% 50%;
    transform-style: preserve-3d;
    
    transition: all 1.15s var(--ease-in-out);
    transition-property: opacity, transform;
  }

  ol li:nth-child(1) {
    transition-delay: 0.15s;
  }
  ol li:nth-child(2) {
    transition-delay: 0.2s;
  }
  ol li:nth-child(3) {
    transition-delay: 0.25s;
  }
  ol li:nth-child(4) {
    transition-delay: 0.3s;
  }
  ol li:nth-child(5) {
    transition-delay: 0.35s;
  }

  ol li::before {
    content: "";
    display: block;
    width: var(--gutter);
    height: var(--gutter);

    transform: scale(0.7);

    background: var(--color-primary);
    border-radius: 50%;
  }

  :global(.is-inview) .c-tinder {
    transform: none;
    opacity: 1;
  }

  :global(.is-inview) ol li {
    transform: none;
    opacity: 1;
  }

  ol li.active::before {
    transform: none;
  }

</style>

<div class="l-grid relative" bind:this={parentEl}>
  <ol class="l-container">
    {#each carousel as item, i (item.image.url)}
      <li class:active={active === i}></li>
    {/each}
  </ol>
  <div class="c-tinder">
    {#each carousel as item, i (item.image.url)}
      <Card
        uid={uid}
        src={item.image.url}
        alt={RichText.asText(title)}
        index={i}
        active={active === i}
        next={next === i}
        subsequent={subsequent === i}
        parentEl={parentEl}
        on:transitionend={handleTransitionEnd}
      />
    {/each}
  </div>
</div>