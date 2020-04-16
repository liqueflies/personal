<script context="module">
  import { onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';

  import Spacer from '../components/Spacer';
  import { scrollable } from '../context/scroll';
  import { renderable, context } from '../context/canvas';
  import { lerp } from '../utils/math';
  import { lazyPicture } from '../utils/lazy';

  const scrollValue = 'footer';
  const today = new Date();
</script>

<script>
  const frames = [];
  const size = { x: 0, y: 0 };

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;

  let dark = false;
  let visible = false;
  let image = null;
  let texture = null;
  let pictureElement;

  let contextAlpha = tweened(0, {
    duration: 300,
    easing: linear
  });

  function CanvasImage() {
    this.x = 0;
    this.y = 0;

    this.draw = function(x, y) {
      if (texture) {
        $context.drawImage(texture, x, y, size.x, size.y);
      }

      this.x = x;
      this.y = y;
    }
  }

  renderable({
    setup: async props => {
      image = await lazyPicture(pictureElement);
      size.x = image.naturalWidth * 0.45;
      size.y = image.naturalHeight * 0.45;
    
      for(let i = 0; i < 4; i++) {
        const e = new CanvasImage();
        frames.push(e);
      }

      contextAlpha.subscribe(value => {
        $context.globalAlpha = value;

        if (value === 0) {
          texture = null;
        }
      });
    },
    render: props => {
      if (visible) {
        x = lerp(x, mX, 0.4);
        y = lerp(y, mY, 0.4);

        frames.forEach((e, i) => {
          const next = frames[i + 1] || frames[0];

          e.draw(x, y);

          x = lerp(x, next.x, 0.85);
          y = lerp(y, next.y, 0.7);

          $context.globalCompositeOperation = 'destination-over';
        });
      }
    }
  });

  scrollable({
    value: scrollValue,
    enter: () => {
      visible = true;
    },
    exit: () => {
      visible = false;
    }
  })

  function handleToggleTheme(e) {
    dark = !dark
    document.body.classList[dark ? 'add' : 'remove']('t-dark')
  }

  function handleMouseMove(e) {
    mX = e.clientX;
    mY = e.clientY - size.y;
  }

  function handleMouseEnter(e) {
    frames.forEach(e => {
      e.x = mX;
      e.y = mY;
    });

    texture = image;
    $contextAlpha = 1;
  }

  function handleMouseLeave(e) {
    $contextAlpha = 0;
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
  font-size: var(--font-size-h2);
  font-family: var(--font-family-secondary);
  letter-spacing: var(--letter-spacing-headings);
}

.c-footer__lg,
.c-footer__sst {
/* .c-footer__toggle { */
  color: var(--color-grey);
  white-space: nowrap;
}

.c-footer__sst {
  grid-column-start: 6;

  cursor: default;
}

.c-footer__sst picture {
  position: absolute;
  visibility: hidden;
}

/* .c-footer__toggle {
  grid-column-start: 12;
} */

@media screen and (min-width: 40em) {
  .c-footer {
    text-align: left;
  }

  .c-footer__credits {
    align-items: center;
  }

  .c-footer__contact a {
    font-size: var(--font-size-h4);
  }

  .c-footer__list {
    transform-origin: top left;
    transform: translateY(40px) scaleY(1.4) skewY(8deg);
    transition: all .8s var(--ease-in-out);
  }

  .c-footer__lg,
  .c-footer__sst {
  /* .c-footer__toggle { */
    padding: 80px 0;
    transform: translateY(30px);
    transition: all 1s var(--ease-in-out);
  }

  .c-footer__list,
  .c-footer__lg,
  .c-footer__sst {
  /* .c-footer__toggle { */
    opacity: 0;
    transform-style: preserve-3d;
    transition-property: opacity, transform;
  }

  .c-footer__hoverable {
    transition: color 0.15s;
  }

  .c-footer__sst .c-footer__hoverable {
    cursor: default;
  }

  /* .c-footer__toggle:hover .c-footer__hoverable, */
  .c-footer__sst:hover .c-footer__hoverable {
    color: var(--color-text);
  }

  .c-footer__lg {
    transition-delay: 0.15s;
  }

  .c-footer__sst {
    grid-column-start: 3;

    transition-delay: 0.25s;
  }

  /* .c-footer__toggle {
    grid-column-start: 10;
    transition-delay: 0.35s;
  } */

  :global(.is-inview) .c-footer__list,
  :global(.is-inview) .c-footer__lg,
  :global(.is-inview) .c-footer__sst {
  /* :global(.is-inview) .c-footer__toggle { */
    transform: none;
    opacity: 1;
  }
}
</style>

<footer data-scroll-section class="c-footer l-container">
  <div 
    data-scroll
    data-scroll-repeat
    data-scroll-position="bottom"
    data-scroll-offset="100"
    data-scroll-call={scrollValue}
  >
    <ul class="c-footer__list">
      <li class="c-footer__contact">
        <a href="/">Email</a>
      </li>
      <li class="c-footer__contact">
        <a href="https://twitter.com/loregirardi" rel="noopener" target="_blank">Twitter</a>
      </li>
      <li class="c-footer__contact">
        <a href="https://www.linkedin.com/in/lorenzo-girardi-61241374/" rel="noopener" target="_blank">LinkedIn</a>
      </li>
    </ul>
  </div>
  <Spacer size="10" only="mobile" />
  <div class="l-grid c-footer__credits" data-scroll data-scroll-repeat>
    <div class="c-footer__lg">LG{today.getFullYear()} — ∞</div>
    <div
      class="c-footer__sst"
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
    >
      <span class="c-footer__hoverable">(: — S)</span>
      <picture
        bind:this={pictureElement}
      >
        <source
          data-srcset="amsterdam-nsdm.webp"
          type="image/webp"
        />
        <img
          data-src="amsterdam-nsdm.png"
          alt="Amsterdam NSDM - 2018"
        />
      </picture>
    </div>
    <!-- <button
      class="c-footer__toggle"
      on:click={handleToggleTheme}
    >
      <span class="c-footer__hoverable">{dark ? "Light" : "Dark"} Mode</span>
    </button> -->
  </div>
  <Spacer size="10" only="mobile" />
</footer>

<svelte:body
  on:mousemove={handleMouseMove}
/>