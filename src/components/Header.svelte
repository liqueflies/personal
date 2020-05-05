<script context="module">
  import Spacer from '../components/Spacer.svelte';
  import { scrollable } from '../context/scroll';
</script>

<script>
  let scrolled;

  scrollable({
    scroll: ({ scroll }) => {
      scrolled = scroll.y >= 80;
    }
  })
</script>

<style>
  .c-header {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1;
  }

  .c-header__location {
    display: none;
  }

  .c-header__location-left {
    text-align: left;
  }

  .c-header__location-right {
    text-align: right;
  }

  .c-header {
    opacity: 0;
    
    transform: translateY(20px) scaleY(1.2);
    transform-style: preserve-3d;

    transition: all 1s var(--ease-in-out);
    transition-property: opacity, transform;
    transition-delay: calc( var(--loading-reveal-delay) + var(--loading-marquee-delay) );
  }

  :global(.has-loaded-content) .c-header {
    opacity: 1;
    transform: none;
  }

  @media screen and (min-width: 62em) {
    .c-header {
      position: fixed;

      top: calc( var(--gutter) * 2 );
      left: calc( var(--gutter) * 4 );
      right: calc( var(--gutter) * 4 );

      justify-content: space-between;

      transform: translateY(40px) scaleY(1.2);
    }

    .c-header__location-left,
    .c-header__location-right {
      transition: all .65s var(--ease-in-out);
      transition-property: opacity, transform;
    }

    .c-header.scrolled .c-header__location-left {
      transform: translateX(-40px);
      opacity: 0;
    }

    .c-header.scrolled .c-header__location-right {
      transform: translateX(40px);
      opacity: 0;
    }

    .c-header__location {
      display: inline-block;
    }
  }
</style>

<header class="c-header l-container" class:scrolled={scrolled}>
  <div class="c-header__location c-header__location-left">
    <div>ITALY</div>
    <div>1993</div>
  </div>
  <div class="c-header__location c-header__location-right">
    <div>ITALIA</div>
    <div>1993</div>
  </div>
</header>