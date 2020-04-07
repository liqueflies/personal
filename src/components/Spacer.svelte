<script>
  export let size;
</script>

<style>
  .o-spacer {
    display: block;
    height: calc( var( --spacer ) * var( --size ) );
    font-size: 0;
    margin: 0;
    padding: 0;
  }
</style>

<div style="--size:{size}" class="o-spacer"></div>