<script>
  import Spacer from '../components/Spacer';

  const today = new Date().getFullYear();

  function onToggleClick(e) {
    e.preventDefault();
    window.document.body.classList.toggle('t-dark');
  }
</script>

<style>
.c-footer {
  text-align: center;
}

.c-footer__list {
  margin: 0;
  padding: 0;

  list-style: none;
}

.c-footer__contact {
  opacity: 0;
  transform-origin: center center;
  transform-style: preserve-3d;
  transform: translateY(100%) rotateX(-80deg);
  transition: all 1s var(--ease-out-quad);
  transition-property: transform, opacity;

  font-size: 0;

  margin-bottom: calc( var(--spacer) * 2 );
}

:global(.is-inview) .c-footer__contact {
  transform: none;
  opacity: 1;
}

:global(.is-inview) .c-footer__contact:nth-child(1) {
  transition-delay: 0.15s;
}

:global(.is-inview) .c-footer__contact:nth-child(2) {
  transition-delay: 0.3s;
}

:global(.is-inview) .c-footer__contact:nth-child(3) {
  transition-delay: 0.6s;
}

.c-footer__contact a {
  color: var(--color-text);
}

.c-footer__lg,
.c-footer__sst {
  color: var(--color-grey);
}

.c-footer__sst {
  grid-column-start: 4;
}

.c-footer__toggle {
  grid-column-start: 10;
}

@media screen and (min-width: 40em) {
  .c-footer {
    text-align: left;
  }
}
</style>

<footer data-scroll-section class="c-footer l-container">
  <div>Lorenzo Girardi</div>
  <div>Creative Developer</div>
  <Spacer size="10" />
  <ul class="c-footer__list" data-scroll data-scroll-repeat>
    <li class="c-footer__contact">
      <a class="h4" href="/">Email</a>
    </li>
    <li class="c-footer__contact">
      <a class="h4" href="https://twitter.com/loregirardi" rel="noopener" target="_blank">Twitter</a>
    </li>
    <li class="c-footer__contact">
      <a class="h4" href="https://www.linkedin.com/in/lorenzo-girardi-61241374/" rel="noopener" target="_blank">LinkedIn</a>
    </li>
  </ul>
  <Spacer size="10" />
  <div class="l-grid">
    <div class="c-footer__lg">LG{today} — ∞</div>
    <div class="c-footer__sst">(: — S)</div>
    <button class="c-footer__toggle" on:click={onToggleClick}>Dark Mode</button>
  </div>
  <Spacer size="10" />
</footer>