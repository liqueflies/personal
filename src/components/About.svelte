<script context="module">
  import { tweened } from "svelte/motion";

  import Spacer from "../components/Spacer.svelte";
  import { scrollable } from "../context/scroll";
  import { renderable, context, height, width } from "../context/canvas";
  import { lazyPicture } from '../utils/lazy';
  import { lerp } from "../utils/math";
  import { ready } from '../store'

  const scrollValue = "about";
  const size = 90;
</script>

<script>
  const frames = [];

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;

  let creative;
  let music;
  let art;

  let texture;
  let textures;
  let visible = false;
  let alpha = tweened(0);

  function CanvasImage() {
    this.x = 0;
    this.y = 0;

    this.draw = function(x, y) {
      if (texture) {
        $context.drawImage(texture, x, y, size, size);
      }

      this.x = x;
      this.y = y;
    };
  }

  ready.subscribe(async isReady => {
    if (isReady) {
      textures = { creative, music, art };

      const images = Object.values(textures)
        .map(i => lazyPicture(i));

      const sources = await Promise.all(images);
      Object.keys(textures).forEach((t, i) => {
        textures[t] = sources[i];
      });

      for (let i = 0; i < 4; i++) {
        const e = new CanvasImage();
        frames.push(e);
      }
    }
  });

  alpha.subscribe(opacity => {
    if ($context) $context.globalAlpha = opacity;
    if (opacity === 0) texture = null;
  });

  renderable({
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
    }
  });

  function handleMouseMove(e) {
    mX = e.clientX - size * 0.5;
    mY = e.clientY - size * 0.5;
  }

  function handleMouseEnter(e) {
    frames.forEach(e => {
      e.x = mX;
      e.y = mY;
    });

    texture = textures[e.target.dataset.emoji];
    $alpha = 1;
  }

  function handleMouseLeave(e) {
    $alpha = 0;
  }
</script>

<style>
  .c-abstract {
    text-align: center;
  }

  .c-abstract__content {
    font-size: var(--font-size-h2);
  }
  .c-abstract__para {
    display: block;
    line-height: 1;
    cursor: default;
  }
  .c-abstract__first {
    letter-spacing: var(--letter-spacing-sans);
    transform: translateY(40px) scaleY(1.4) skewY(7deg);
    transition: all 0.5s;
  }
  .c-abstract__first.creative {
    transition-delay: 0s;
  }
  .c-abstract__first.music {
    transition-delay: 0.15s;
  }
  .c-abstract__first.art {
    transition-delay: 0.3s;
  }
  .c-abstract__then {
    font-family: var(--font-family-secondary);
    letter-spacing: var(--letter-spacing-headings);
    white-space: pre;
    pointer-events: none;
  }
  .c-abstract__first,
  .c-abstract__then {
    display: inline-block;
    line-height: 1;
    transform-origin: center center;
    transform-style: preserve-3d;
    opacity: 0;
    transition-property: opacity, transform;
  }
  .c-abstract__then {
    --then-delay: 0.15s;
    --then-delay-start: 0s;

    transform: translateY(20px) scaleY(1.4);
    transition: all 0.5s;
  }
  .c-abstract__then.technologist {
    transition-delay: calc(var(--then-delay-start) + (var(--then-delay) * 2));
  }
  .c-abstract__then.aficionado {
    transition-delay: calc(var(--then-delay-start) + (var(--then-delay) * 4));
  }
  .c-abstract__then.and {
    transition-delay: calc(var(--then-delay-start) + (var(--then-delay) * 3));
  }
  :global(.is-inview).c-abstract__content .c-abstract__first,
  :global(.is-inview).c-abstract__content .c-abstract__then {
    transform: none;
    opacity: 1;
  }
  :global(.has-no-pointer) .c-abstract {
    pointer-events: none;
  }
  @media screen and (min-width: 40em) {
    .c-abstract__first {
      transform: translateY(120px) scaleY(1.4) skewY(8deg);
    }
    .c-abstract__first::after {
      content: '';
      position: absolute;	
      left: 0;
      right: 0;
      bottom: 0;
      transform-origin: 0;
      height: 2px;
      background-color: currentColor;
      transition: transform .4s var(--ease-in-out);
    }
    .c-abstract__first:hover::after {
      transform-origin: 100%;
      transform: scale(0, 1);
    }
    .c-abstract__then {
      transform: translateY(40px) scaleY(1.4);
    }
  }
</style>

<div data-scroll-section class="l-container l-container--small c-abstract">
  <Spacer size="20" only="mobile" />
  <Spacer size="35" only="desktop" />
  <div data-scroll data-scroll-repeat data-scroll-call={scrollValue}>
    <div
      class="c-abstract__content"
      data-scroll
      data-scroll-position="bottom"
      data-scroll-offset="200">
      <div class="c-abstract__para">
        <span
          class=" c-abstract__first creative"
          data-emoji="creative"
          on:mouseenter={handleMouseEnter}
          on:mouseleave={handleMouseLeave}>
          Creative
          <picture class="visually-hidden" bind:this={creative}>
            <source data-srcset="creative.webp" type="image/webp" />
            <img data-src="creative.png" alt="Creative" />
          </picture>
        </span>
      </div>
      <div class="c-abstract__para c-abstract__then technologist">
        Technologist,
      </div>
      <div class="c-abstract__para">
        <span
          class="c-abstract__first music"
          data-emoji="music"
          on:mouseenter={handleMouseEnter}
          on:mouseleave={handleMouseLeave}>
          Music
          <picture class="visually-hidden" bind:this={music}>
            <source data-srcset="music.webp" type="image/webp" />
            <img data-src="music.png" alt="Music" />
          </picture>
        </span>
        <span class="c-abstract__then and">&</span>
        <span
          class="c-abstract__first art"
          data-emoji="art"
          on:mouseenter={handleMouseEnter}
          on:mouseleave={handleMouseLeave}>
          Art
          <picture class="visually-hidden" bind:this={art}>
            <source data-srcset="art.webp" type="image/webp" />
            <img data-src="art.png" alt="Art" />
          </picture>
        </span>
      </div>
      <div class="c-abstract__para c-abstract__then aficionado">
        aficionado.
      </div>
    </div>
  </div>
  <Spacer size="20" only="mobile" />
  <Spacer size="35" only="desktop" />
</div>

<svelte:body on:mousemove={handleMouseMove} />
