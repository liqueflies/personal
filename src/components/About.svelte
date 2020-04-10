<script>
  import Spacer from '../components/Spacer.svelte';
  import { renderable, context } from '../context/canvas';
  import { tweened } from 'svelte/motion';

  import { lerp } from '../utils/math';

  const TILE_SIZE = 86;
  
  const emoticons = [];
  const size = TILE_SIZE * 0.5;

  let mX = 0;
  let mY = 0;

  let ctx = null;
  let tile = '';

  let alpha = tweened(0, {
    duration: 200
  });

  function Emoji() {
    this.x = 0;
    this.y = 0;

    this.draw = function(x, y) {
      $context.font = `${TILE_SIZE}px serif`;
      $context.fillText(tile, x, y);

      this.x = x;
      this.y = y;
    }
  }

  for(let i = 0; i < 3; i++) {
    const e = new Emoji();
    emoticons.push(e);
  }

	renderable({
    setup: props => {
      alpha.subscribe(value => {
        $context.globalAlpha = value;
      });
    },
    render: props => {
      const { width, height } = props;
      $context.clearRect(0, 0, width, height);

      let x = mX - size;
      let y = mY + size;

      emoticons.forEach((e, i) => {
        const next = emoticons[i + 1] || emoticons[0];

        e.draw(x, y);

        x = lerp(x, next.x, 0.8);
        y = lerp(y, next.y, 0.8);
      });
    }
  });

  function handleMouseMove(e) {
    mX = e.clientX;
    mY = e.clientY;
  }

  function handleMouseEnter(e) {
    tile = e.target.dataset.emoji;
    $alpha = 1;
  }

  function handleMouseLeave(e) {
    setTimeout(() => {
      $alpha = 0;
    }, 300);
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

<div 
  data-scroll-section 
  class="l-container l-container--small c-abstract"
>
  <Spacer size="10" only="mobile" />
  <Spacer size="30" only="desktop" />
  <div
    class="c-abstract__content"
    data-scroll
    data-scroll-position="bottom"
  >
    <div class="c-abstract__para" 
      data-emoji="💡"
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
    >
      Creative
    </div>
    <div class="c-abstract__para serif">Technologist</div>
    <div class="c-abstract__para"
      on:mouseleave={handleMouseLeave}
    >
      <span 
        data-emoji="👂"
        on:mouseenter={handleMouseEnter}
      >Music</span> 
      <span class="serif">&</span>
      <span 
        data-emoji="🎨"
        on:mouseenter={handleMouseEnter}
      >Art</span></div>
    <div class="c-abstract__para serif">aficionado.</div>
  </div>
  <Spacer size="10" only="mobile" />
  <Spacer size="30" only="desktop" />
</div>

<svelte:body
  on:mousemove={handleMouseMove}
/>