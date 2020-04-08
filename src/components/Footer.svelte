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
  margin-bottom: calc( var(--spacer) * 2 );
}

.c-footer__contact a {
  color: var(--color-text);
}

.c-footer__lg,
.c-footer__sst,
.c-footer__toggle {
  color: var(--color-grey);
  white-space: nowrap;
}

.c-footer__sst {
  grid-column-start: 6;
}

.c-footer__toggle {
  grid-column-start: 12;
}

@media screen and (min-width: 40em) {
  .c-footer {
    text-align: left;
  }

  .c-footer__me {
    display: none;
  }

  .c-footer__contact {
    transform: translateY(80px);
  }

  .c-footer__contact,
  .c-footer__lg,
  .c-footer__sst,
  .c-footer__toggle {
    opacity: 0;
    transform-style: preserve-3d;
    transition: all 1s var(--ease-in-out);
    transition-property: opacity, transform;
  }

  .c-footer__lg,
  .c-footer__sst,
  .c-footer__toggle {
    transform: translateY(30px);
  }

  .c-footer__sst {
    grid-column-start: 4;
    transition-delay: 0.25s;
  }

  .c-footer__toggle {
    grid-column-start: 10;
    transition-delay: 0.35s;
  }

  :global(.is-inview) .c-footer__contact,
  :global(.is-inview) .c-footer__lg,
  :global(.is-inview) .c-footer__sst,
  :global(.is-inview) .c-footer__toggle {
    transform: none;
    opacity: 1;
  }

  :global(.is-inview) .c-footer__contact:nth-child(1) {
    transition-delay: 0.15s;
  }

  :global(.is-inview) .c-footer__contact:nth-child(2) {
    transition-delay: 0.25s;
  }

  :global(.is-inview) .c-footer__contact:nth-child(3) {
    transition-delay: 0.3s;
  }
}
</style>

<footer data-scroll-section class="c-footer l-container">
  <div class="c-footer__me">  
    <div>Lorenzo Girardi</div>
    <div>Creative Technologist</div>
    <Spacer size="10" />
  </div>
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
  <div class="l-grid" data-scroll data-scroll-repeat>
    <div class="c-footer__lg">LG{today} — ∞</div>
    <div class="c-footer__sst">(: — S)</div>
    <button class="c-footer__toggle" on:click={onToggleClick}>Dark Mode</button>
  </div>
  <Spacer size="10" />
</footer>