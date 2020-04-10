<script>
  import { renderable, context } from '../context/canvas';
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';

  import Spacer from '../components/Spacer';
  import { lerp } from '../utils/math';
  import { imageLoader } from '../utils/loader';

  const frames = [];
  const size = { x: 0, y: 0 };

  let mX = 0;
  let mY = 0;

  let ctx = null;
  let texture = null;

  let alpha = tweened(0, {
    duration: 300,
    easing: linear
  });

  function Image() {
    this.x = 0;
    this.y = 0;

    this.draw = function(x, y) {
      $context.drawImage(texture, x, y, size.x, size.y);
      this.x = x;
      this.y = y;
    }
  }

  renderable({
    setup: props => {
      imageLoader('polaroid.png', img => {
        texture = img;
        size.x = img.width * 0.25;
        size.y = img.height * 0.25;

        for(let i = 0; i < 4; i++) {
          const e = new Image();
          frames.push(e);
        }
      });

      alpha.subscribe(value => {
        $context.globalAlpha = value;
      });

      $context.globalAlpha = 0;
    },
    render: props => {
  
      if ($alpha === 0) {
        return false;
      }

      let x = mX;
      let y = mY - size.y;

      frames.forEach((e, i) => {
        const next = frames[i + 1] || frames[0];

        e.draw(x, y);

        x = lerp(x, next.x, 0.9);
        y = lerp(y, next.y, 0.9);

        $context.globalCompositeOperation = 'destination-over';
      });
    }
  });

  const today = new Date().getFullYear();
  let isThemeInPreview = false;
  let isThemeDark = false;

  function handleToggleEnter() {
    isThemeInPreview = true;
    window.document.body.classList.toggle('t-dark');
  } 

  function handleToggleLeave() {
    if (isThemeInPreview) {
      window.document.body.classList.toggle('t-dark');
    }
  }

  function handleToggleClick(e) {
    isThemeInPreview = false;
    isThemeDark = !isThemeDark;
  }

  function handleMouseMove(e) {
    mX = e.clientX;
    mY = e.clientY;
  }

  function handleMouseEnter(e) {
    frames.forEach(e => {
      e.x = mX;
      e.y = mY;
    });

    $alpha = 1;
  }

  function handleMouseLeave(e) {
    $alpha = 0;
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

  .c-footer__credits {
    align-items: center;
  }

  .c-footer__contact {
    transform-origin: top left;
    transform: translateY(40px) scaleY(1.4) skewY(8deg);
    transition: all 0.8s var(--ease-in-out);
  }

  .c-footer__contact:nth-child(1) {
    transition-delay: 0.1s;
  }

  .c-footer__contact:nth-child(2) {
    transition-delay: 0.3s;
  }

  .c-footer__contact:nth-child(3) {
    transition-delay: 0.5s;
  }

  .c-footer__contact,
  .c-footer__lg,
  .c-footer__sst,
  .c-footer__toggle {
    opacity: 0;
    transform-style: preserve-3d;
    transition-property: opacity, transform;
  }

  .c-footer__lg,
  .c-footer__sst,
  .c-footer__toggle {
    padding: 80px 0;
    transform: translateY(30px);
    transition: all 1s var(--ease-in-out);
  }

  .c-footer__lg {
    transition-delay: 0.15s;
  }

  .c-footer__sst {
    grid-column-start: 2;
    grid-column-end: 7;
    text-align: center;
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
}
</style>

<footer data-scroll-section class="c-footer l-container">
  <div class="c-footer__me">  
    <div>Lorenzo Girardi</div>
    <div>Creative Technologist</div>
    <Spacer size="10" />
  </div>
  <ul class="c-footer__list"
    data-scroll
    data-scroll-repeat
    data-scroll-position="bottom"
    data-scroll-offset="100"
  >
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
  <Spacer size="10" only="mobile" />
  <div class="l-grid c-footer__credits" data-scroll data-scroll-repeat>
    <div class="c-footer__lg">LG{today} — ∞</div>
    <div
      class="c-footer__sst"
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
    >(: — S)</div>
    <button
      class="c-footer__toggle"
      on:click={handleToggleClick}
      on:mouseenter={handleToggleEnter}
      on:mouseleave={handleToggleLeave}
    >
      {isThemeDark ? "Light" : "Dark"} Mode
    </button>
  </div>
  <Spacer size="10" only="mobile" />
</footer>

<svelte:body
  on:mousemove={handleMouseMove}
/>