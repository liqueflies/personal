<script>
  import Spacer from '../components/Spacer.svelte';
</script>

<style>
.c-abstract {
  text-align: center;
}

.c-abstract__para {
  font-size: 64px;
  line-height: 1;
  letter-spacing: var(--letter-spacing-headings);

  opacity: 0;
  transform-origin: center center;
  transform-style: preserve-3d;
  transform: translateY(80px) scaleY(1.4) skewY(13deg);
  transition: all 1.2s;
  transition-property: opacity, transform;
}

.c-abstract__para:nth-child(1) {
  transition-delay: 0.3s;
}
.c-abstract__para:nth-child(2) {
transition-delay: 0.45s;
}
.c-abstract__para:nth-child(3) {
transition-delay: 0.65s;
}
.c-abstract__para:nth-child(4) {
transition-delay: 0.8s;
}

:global(.is-inview).c-abstract__content .c-abstract__para {
  transform: none;
  opacity: 1;
}

/* @media screen and (min-width: 40em) {
  .c-abstract {
    grid-column-start: 5;
		grid-column-end: 9;
  }
} */
</style>

<div data-scroll-section class="l-container l-container--small c-abstract">
  <Spacer size="30" />
  <div class="c-abstract__content" data-scroll data-scroll-position="bottom" data-scroll-offset="200">
    <div class="c-abstract__para">Creative</div>
    <div class="c-abstract__para serif">Technologist</div>
    <div class="c-abstract__para">Music <span class="serif">&</span> Art</div>
    <div class="c-abstract__para serif">aficionado.</div>
  </div>
  <Spacer size="30" />
</div>