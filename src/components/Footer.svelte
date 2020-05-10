<script context="module">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";

  import Spacer from "../components/Spacer";
  import { scrollable } from "../context/scroll";
  import { renderable, context } from "../context/canvas";
  import { lerp } from "../utils/math";
  import { lazyPicture } from "../utils/lazy";

  const scrollValue = "footer";
  const today = new Date();
</script>

<script>
  const frames = [];
  const size = { x: 0, y: 0 };

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;

  let visible = false;
  let image = null;
  let texture = null;
  let themes = [];
  let pictureElement;

  let alpha = tweened(0);

  function CanvasImage() {
    this.x = 0;
    this.y = 0;

    this.draw = function(x, y) {
      if (texture) {
        $context.drawImage(texture, x, y, size.x, size.y);
      }

      this.x = x;
      this.y = y;
    };
  }

  renderable({
    setup: async props => {
      alpha.subscribe(opacity => {
        $context.globalAlpha = opacity;
        if (opacity === 0) texture = null;
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

          $context.globalCompositeOperation = "destination-over";
        });
      }
    }
  });

  scrollable({
    value: scrollValue,
    scroll: props => {
      visible = props.visible
    },
    enter: async () => {
      image = await lazyPicture(pictureElement);
      size.x = image.naturalWidth * 0.45;
      size.y = image.naturalHeight * 0.45;

      for (let i = 0; i < 4; i++) {
        const e = new CanvasImage();
        frames.push(e);
      }
    }
  });

  onMount(() => {
    setDefaultTheme();
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").addListener(function() {
        document.body.className = "";
        setDefaultTheme();
      });
  });

  function setDefaultTheme() {
    const dark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (dark) {
      themes = ["dark", "light"];
    } else {
      themes = ["light", "dark"];
    }
  }

  function handleToggleTheme(e) {
    const [current, to] = themes;
    document.body.className = `t-${to}`;
    themes = [to, current];
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

  .c-footer__about {
    grid-column-start: 2;
    grid-column-end: -2;
  }

  .c-footer__about p {
    margin-top: 0;
    margin-bottom: calc(var(--gutter) * 4);
    line-height: 1.667;
  }

  .c-footer__list {
    margin: 0;
    padding: 0;

    list-style: none;
  }

  .c-footer__contact {
    margin-bottom: calc(var(--gutter) * 2);
  }

  .c-footer__contact a {
    color: var(--color-text);
    font-size: var(--font-size-h2);
    font-family: var(--font-family-secondary);
    letter-spacing: var(--letter-spacing-headings);
  }

  .c-footer__lg,
  .c-footer__sst,
  .c-footer__toggle {
    white-space: nowrap;
  }

  .c-footer__lg {
    grid-column-start: 1;
    grid-column-end: 4;
  }

  .c-footer__sst {
    grid-column-start: 4;
    grid-column-end: 10;
    cursor: default;
  }

  .c-footer__sst picture {
    position: absolute;
    visibility: hidden;
  }

  .c-footer__toggle {
    /* grid-column-start: 12; */
    grid-column-start: 10;
    grid-column-end: -1;
    text-transform: capitalize;
  }

  @media screen and (min-width: 40em) {
    .c-footer {
      text-align: left;
    }

    .c-footer__about {
      grid-column-start: 1;
      grid-column-end: 6;
    }

    .c-footer__credits {
      align-items: center;
    }

    .c-footer__contact a {
      font-size: var(--font-size-h4);
    }

    .c-footer__list,
    .c-footer__about {
      transform-origin: top left;
      transform: translateY(40px) scaleY(1.4) skewY(8deg);
      transition: all 0.8s var(--ease-in-out);
    }

    .c-footer__lg,
    .c-footer__sst,
    .c-footer__toggle {
      transform: translateY(30px);
      transition: all 1s var(--ease-in-out);
    }

    .c-footer__list,
    .c-footer__lg,
    .c-footer__sst,
    .c-footer__toggle,
    .c-footer__about {
      opacity: 0;
      transform-style: preserve-3d;
      transition-property: opacity, transform;
    }

    .c-footer__hoverable {
      transition: color 0.25s;
      transition-delay: 0s;
    }

    .c-footer__sst .c-footer__hoverable {
      display: inline-block;
      cursor: default;
      padding: 80px 0;
    }

    .c-footer__toggle:hover .c-footer__hoverable,
    .c-footer__sst:hover .c-footer__hoverable {
      color: #787878;
    }

    .c-footer__lg {
      grid-column-end: 2;
      transition-delay: 0.15s;
    }

    .c-footer__sst {
      grid-column-start: 3;
      grid-column-end: auto;
      transition-delay: 0.25s;
    }

    .c-footer__toggle {
      grid-column-start: 10;
      transition-delay: 0.35s;
    }

    :global(.is-inview) .c-footer__list,
    :global(.is-inview) .c-footer__lg,
    :global(.is-inview) .c-footer__sst,
    :global(.is-inview) .c-footer__toggle,
    :global(.is-inview) .c-footer__about {
      transform: none;
      opacity: 1;
    }
  }

  @media screen and (min-width: 62em) {
    .c-footer__about {
      grid-column-end: 6;
    }
  }

  @media screen and (min-width: 75em) {
    .c-footer__about {
      grid-column-end: 4;
    }
  }
</style>

<footer data-scroll-section class="c-footer l-container">
  <div class="l-grid" data-scroll>
    <div class="c-footer__about">
      <p>Focusing on Interactive Development
        and growing technological culture of companies,
        pushing ideas outside boundaries.
      <p>Co-founder of <a rel="noopener" target="_blank" href="https://developers.caffeina.com/tech-mondays-caffeina-ec85fbe7361">Tech Mondays</a><br />
      Spreading knowledge as a <a rel="noopener" target="_blank" href="https://speakerdeck.com/loregirardi">Speaker</a>.</p>
    </div>
  </div>
  <Spacer size={15} only="mobile" />
  <Spacer size={20} only="desktop" />
  <div
    data-scroll
    data-scroll-repeat
    data-scroll-position="bottom"
    data-scroll-offset="100"
    data-scroll-call={scrollValue}>
    <ul class="c-footer__list">
      <li class="c-footer__contact">
        <a href="mailto:lorenzo.girardi93@gmail.com">Email</a>
      </li>
      <li class="c-footer__contact">
        <a
          href="https://twitter.com/loregirardi"
          rel="noopener"
          target="_blank">
          Twitter
        </a>
      </li>
      <li class="c-footer__contact">
        <a
          href="https://www.instagram.com/loregirardi/"
          rel="noopener"
          target="_blank">
          Instagram
        </a>
      </li>
    </ul>
  </div>
  <Spacer size="10" only="mobile" />
  <div class="l-grid c-footer__credits" data-scroll data-scroll-repeat>
    <div class="c-footer__lg">LG{today.getFullYear()} — ∞</div>
    <div class="c-footer__sst">
      <span
        class="c-footer__hoverable"
        on:mouseenter={handleMouseEnter}
        on:mouseleave={handleMouseLeave}>
        (: — S)
      </span>
      <picture bind:this={pictureElement}>
        <source data-srcset="amsterdam-nsdm.webp" type="image/webp" />
        <img data-src="amsterdam-nsdm.png" alt="Amsterdam NSDM - 2018" />
      </picture>
    </div>
    <button class="c-footer__toggle" on:click={handleToggleTheme}>
      {#if themes.length}
        <span class="c-footer__hoverable">{themes[1]} Mode</span>
      {/if}
    </button>
  </div>
  <Spacer size="5" only="mobile" />
</footer>

<svelte:body on:mousemove={handleMouseMove} />
