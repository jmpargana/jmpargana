<script>
  let scrollY
  $: show = scrollY > 600 && scrollY < 3500

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }
</script>

<svelte:window bind:scrollY={scrollY} />

<div class="container" class:show on:click={scrollToBottom}>
  Hire Me!
</div>

<style>

.container {
  background-image: url('/static/hire-me.gif');
  background-size: contain;
  display: grid;
  place-items: center;
  cursor: pointer;
  position: fixed;
  z-index: 100;
  top: 0;
  height: 200px;
  width: 200px;
  right: 0;
  transition: all 500ms ease;  
  opacity: 0;
}

.container.show {
  opacity: 1;
  transform: translate3d(-50px, 100px, 50px);
}
</style>
