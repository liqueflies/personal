<script context="module">
  import Spacer from '../components/Spacer.svelte';
</script>

<style>
  .c-header {
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1;
  }

  .c-header__location {
    display: none;
  }

  .c-header__location-left {
    text-align: left;
  }

  .c-header__location-right {
    text-align: right;
  }

  @media screen and (min-width: 40em) {
    .c-header {
      position: fixed;

      top: calc( var(--spacer) * 2 );
      left: calc( var(--spacer) * 4 );
      right: calc( var(--spacer) * 4 );

      justify-content: space-between;
    }

    .c-header__location {
      display: inline-block;
    }

    .c-header__position {
      display: none;
    }
  }
</style>

<header class="c-header l-container">
  <div class="c-header__location c-header__location-left">
    <div>ITALY</div>
    <div>1993</div>
  </div>
  <div class="c-header__position">  
    <Spacer size="3" />
    <span> Creative Developer </span>
    <Spacer size="3" />
  </div>
  <div class="c-header__location c-header__location-right">
    <div>ITALIA</div>
    <div>1993</div>
  </div>
</header>