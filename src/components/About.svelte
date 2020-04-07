<script context="module">
  import Spacer from '../components/Spacer.svelte';
</script>

<style>
.c-abstract__para {
  font-size: 78px;

  opacity: 0;
  transform-origin: center center;
  transform-style: preserve-3d;
  transform: translateY(100%) rotateX(-80deg);
  transition: opacity 0.65s var(--easing-out), transform 0.65s var(--easing-out);
}

:global(.is-inview) .c-abstract__para {
  transform: none;
  opacity: 1;
}

@media screen and (min-width: 40em) {
  .c-abstract {
    grid-column-start: 5;
		grid-column-end: 9;
  }
}
</style>

<div data-scroll-section class="l-container l-container--small c-abstract">
  <div data-scroll data-scroll-position="bottom" data-scroll-offset="100">  
    <Spacer size="20" />
    <p class="c-abstract__para">
      IS CREATIVE TECHNOLOGIST
      PASSIONATE ABOUT
      MUSIC AND ART.
    </p>
    <Spacer size="20" />
  </div>  
</div>