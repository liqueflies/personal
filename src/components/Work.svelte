<script context="module">
  import PrismicDOM from 'prismic-dom';

  import Spacer from '../components/Spacer.svelte';
</script>

<script>
  export let data;

  const release = new Date(data.release);
  const year = release.getFullYear().toString().substr(2);
  const month = release.getMonth() + 1;
</script>

<style>
.c-work {
  position: relative;
}

.c-work__header {
  display: grid;
  justify-items: center;
}

.c-work__release,
.c-work__title {
  line-height: 1;
}

.c-work__month {
  display: none;
}

.c-work__details {
  display: flex;
  justify-content: space-between;
}

.c-work__media {
  grid-column-start: 3;
  grid-column-end: 11;
  background-color: var(--color-primary);
  height: 400px;
}

@media screen and (min-width: 40em) {
  .c-work__header {
    grid-template-columns: repeat(10, 1fr);
    align-items: end;
  }

  .c-work__title {
    justify-self: start;
    grid-column-start: 1;
    grid-column-end: 5;
  }

  .c-work__release {
    justify-self: end;
    grid-column-start: 9;
    grid-column-end: 11;
  }

  .c-work__month {
    display: block;
    text-align: right;
  }

  .c-work__media {
    grid-column-start: 1;
    grid-column-end: 13;
    height: 600px;
  }
}
</style>

<article data-scroll-section class="c-work">
  <header class="c-work__header">
    <h2 class="c-work__title">{PrismicDOM.RichText.asText(data.title)}</h2>
    <h4 class="c-work__release">
      <div class="c-work__month">{month}</div>
      <div class="c-work__year">{year}</div>
    </h4>
  </header>
  <!-- <video src="" -->
  <!-- <h3>{PrismicDOM.Link.url(data.video)}</h3> -->
  <!-- <video src="{PrismicDOM.Link.url(data.video)}" autoplay mute /> -->
  <Spacer size={3} />
  <div class="l-grid">
    <div class="c-work__media"></div>
  </div>
  <Spacer size={6} />
  <div class="c-work__details">
    <span>{PrismicDOM.RichText.asText(data.type)}</span>
    <span>{PrismicDOM.RichText.asText(data.role)}</span>
    <a href='{PrismicDOM.Link.url(data.link)}'>Visit Site</a>
  </div>
  <Spacer size={15} />
</article>