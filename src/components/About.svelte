<script context="module">
  import { onDestroy } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { linear } from 'svelte/easing';

  import Spacer from '../components/Spacer.svelte';
  import { scrollable } from '../context/scroll';
  import { renderable, context, height, width } from '../context/canvas';
  import { lerp } from '../utils/math';

  const scrollValue = 'about';
  const emojiSize = 86;
  const size = emojiSize * 0.5;
</script>

<script>  
  const frames = [];

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;

  let emojiText = '';
  let visible = false;

  let contextAlpha = tweened(0, {
    duration: 300,
    easing: linear
  });

  function Emoji() {
    this.x = 0;
    this.y = 0;

    this.draw = function(x, y) {
      $context.font = `${emojiSize}px serif`;
      $context.fillText(emojiText, x, y);

      this.x = x;
      this.y = y;
    }
  }

  renderable({
    setup: props => {
      for(let i = 0; i < 4; i++) {
        const e = new Emoji();
        frames.push(e);
      }

      contextAlpha.subscribe(value => {
        $context.globalAlpha = value;

        if (value === 0) {
          emojiText = '';
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

          // $context.globalCompositeOperation = 'destination-over';
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
  });

  function handleMouseMove(e) {
    mX = e.clientX - size;
    mY = e.clientY + size;
  }

  function handleMouseEnter(e) {
    frames.forEach(e => {
      e.x = mX;
      e.y = mY;
    });

    $contextAlpha = 1;
    emojiText = e.target.dataset.emoji;
  }

  function handleMouseLeave(e) {
    $contextAlpha = 0;
  }
</script>

<style>
.c-abstract {
  text-align: center;
}

.c-abstract__content {
  font-size: var(--font-size-h2);
}

.c-abstract__first {
  letter-spacing: var(--letter-spacing-sans);

  transition: opacity .5s, transform .5s;
  transform: translateY(30px) scaleY(1.4) skewY(7deg);
}

.c-abstract__first.creative {
  transition-delay: .15s;
}

.c-abstract__first.music {
  transition-delay: .25s;
}

.c-abstract__first.art {
  transition-delay: .35s;
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
}

.c-abstract__para {
  display: block;
  line-height: 1;

  cursor: default;
}

.c-abstract__then {
  transform: translateY(30px) scaleY(1.4);
  
  transition: opacity .65s var(--ease-in-out), transition .65s var(--ease-in-out);

  --then-delay: 0.1s;
  --then-delay-start: 0.05s;
}

.c-abstract__then.technologist {
  transition-delay: calc( var(--then-delay-start) + ( var(--then-delay) * 2 ) );
}

.c-abstract__then.aficionado {
  transition-delay: calc( var(--then-delay-start) + ( var(--then-delay) * 4 ) );
}

.c-abstract__then.and {
  transition-delay: calc( var(--then-delay-start) + ( var(--then-delay) * 3 ) );
}

:global(.is-inview).c-abstract__content .c-abstract__first,
:global(.is-inview).c-abstract__content .c-abstract__then {
  transform: none;
  opacity: 1;
}

@media screen and (min-width: 40em) {
  .c-abstract__first {
      transform: translateY(120px) scaleY(1.4) skewY(8deg);
      transition: opacity .65s, transform .65s;
  }

  .c-abstract__first.creative {
    transition-delay: .15s;
  }

  .c-abstract__first.music {
    transition-delay: .3s;
  }

  .c-abstract__first.art {
    transition-delay: .45s;
  }

  .c-abstract__then {
    transition: opacity .65s var(--ease-in-out), transform .65s var(--ease-in-out);

    --then-delay: 0.15s;
    --then-delay-start: 0.15s;
  }
}
</style>

<div 
  data-scroll-section
  class="l-container l-container--small c-abstract"
>
  <Spacer size="20" only="mobile" />
  <Spacer size="35" only="desktop" />
  <div
    data-scroll
    data-scroll-repeat
    data-scroll-call={scrollValue}
  >
    <div
      class="c-abstract__content"
      data-scroll
      data-scroll-position="bottom"
      data-scroll-offset="200"
    >
      <div class="c-abstract__para">
        <span
          class=" c-abstract__first creative"
          data-emoji="👨🏻‍💻"
          on:mouseenter={handleMouseEnter}
          on:mouseleave={handleMouseLeave}
        >Creative</span>
      </div>
      <div class="c-abstract__para c-abstract__then technologist">Technologist</div>
      <div class="c-abstract__para" on:mouseleave={handleMouseLeave}>
        <span 
          data-emoji="🎙"
          class="c-abstract__first music"
          on:mouseenter={handleMouseEnter}
        >Music</span> 
        <span class="c-abstract__then and">&</span>
        <span 
          data-emoji="🖍"
          class="c-abstract__first art"
          on:mouseenter={handleMouseEnter}
        >Art</span></div>
      <div class="c-abstract__para c-abstract__then aficionado">aficionado.</div>
    </div>
  </div>
  <Spacer size="20" only="mobile" />
  <Spacer size="35" only="desktop" />
</div>

<svelte:body
  on:mousemove={handleMouseMove}
/>