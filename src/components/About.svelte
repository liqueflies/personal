<script>
  import Spacer from '../components/Spacer.svelte';
</script>

<style>
.c-abstract {
  text-align: center;
}

.c-abstract__content {
  font-size: var(--font-size-h2);
}

.c-abstract__para {
  /* font-size: 42px; */
  line-height: 1;
  letter-spacing: var(--letter-spacing-headings);

  opacity: 0;

  transform-origin: center center;
  transform-style: preserve-3d;
  transform: translateY(30px) scaleY(1.4) skewY(7deg);

  transition: all 0.8s;
  transition-property: opacity, transform;
}

.c-abstract__para:nth-child(2) {
  transition-delay: 0.15s;
}

.c-abstract__para:nth-child(3) {
  transition-delay: 0.25s;
}

.c-abstract__para:nth-child(4) {
  transition-delay: 0.45s;
}

:global(.is-inview).c-abstract__content .c-abstract__para {
  transform: none;
  opacity: 1;
}

@media screen and (min-width: 40em) {
  .c-abstract__para {
      transform: translateY(80px) scaleY(1.4) skewY(13deg);
      transition: all 1s;
  }

  .c-abstract__para:nth-child(1) {
    transition-delay: .15s;
  }

  .c-abstract__para:nth-child(2) {
    transition-delay: 0.35s;
  }

  .c-abstract__para:nth-child(3) {
    transition-delay: 0.45s;
  }

  .c-abstract__para:nth-child(4) {
    transition-delay: 0.55s;
  }
}
</style>

<div data-scroll-section class="l-container l-container--small c-abstract">
  <Spacer size="10" only="mobile" />
  <Spacer size="30" only="desktop" />
  <div
    class="c-abstract__content"
    data-scroll
    data-scroll-position="bottom"
  >
    <div class="c-abstract__para">Creative</div>
    <div class="c-abstract__para serif">Technologist</div>
    <div class="c-abstract__para">Music <span class="serif">&</span> Art</div>
    <div class="c-abstract__para serif">aficionado.</div>
  </div>
  <Spacer size="10" only="mobile" />
  <Spacer size="30" only="desktop" />
</div>