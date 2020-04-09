<script>
  import Spacer from '../components/Spacer.svelte';
  import { renderable } from '../context/canvas';
  import { tweened } from 'svelte/motion';

  const lerp = (a, b, n) => ((1 - n) * a) + (n * b);

  let mX = 0;
  let mY = 0;

  let x = 0;
  let y = 0;
  let lerpX = 0;
  let lerpY = 0;

  let emoji = '';

  function handleMouseMove(e) {
    mX = e.clientX;
    mY = e.clientY;
    emoji = e.target.dataset.emoji;
  }

	renderable(props => {
    const { context, width, height } = props;
    
    context.clearRect(0, 0, width, height);
    context.font = '96px serif';

    const { width: textWidth } = context.measureText(emoji);

    lerpX = lerp(mX - textWidth * 0.5, x, 0.8);
    lerpY = lerp(mY + 48, y, 0.8);

    context.globalAlpha = 0.5;
    context.fillText(emoji, lerpX, lerpY);

    lerpX = lerp(mX - textWidth * 0.5, lerpX, 0.2);
    lerpY = lerp(mY + 48, lerpY, 0.2);

    context.globalAlpha = 1;
    context.fillText(emoji, lerpX + 10, lerpY);

    lerpX = lerp(mX - textWidth * 0.5, lerpX, 0.2);
    lerpY = lerp(mY + 48, lerpY, 0.2);

    context.fillText(emoji, lerpX + 20, lerpY);

    x = lerpX;
    y = lerpY;
  });
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
    <div class="c-abstract__para"><span data-emoji="👂" on:mousemove={handleMouseMove}>Music</span> <span class="serif">&</span> <span  data-emoji="🎨" on:mousemove={handleMouseMove}>Art</span></div>
    <div class="c-abstract__para serif">aficionado.</div>
  </div>
  <Spacer size="10" only="mobile" />
  <Spacer size="30" only="desktop" />
</div>