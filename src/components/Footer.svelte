<script context="module">
  import Spacer from '../components/Spacer';
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
  transition: opacity 0.65s var(--easing-out), transform 0.65s var(--easing-out);
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

.c-footer__sign {
  color: var(--color-grey);
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
  <ul class="c-footer__list" data-scroll data-scroll-call="bet" data-scroll-repeat>
    <li class="c-footer__contact">
      <a class="h4" href="#">Email</a>
    </li>
    <li class="c-footer__contact">
      <a class="h4" href="#">Twitter</a>
    </li>
    <li class="c-footer__contact">
      <a class="h4" href="#">LinkedIn</a>
    </li>
  </ul>
  <Spacer size="10" />
  <div class="c-footer__sign">LG2020</div>
  <Spacer size="10" />
</footer>