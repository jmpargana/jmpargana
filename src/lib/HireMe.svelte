<script>
  let scrollY
  $: show = scrollY > 1000 && scrollY < 3500

  function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }

  /* <svg */ 
  /*   class="hire-me" */
  /*   xmlns="http://www.w3.org/2000/svg" */
  /*   viewBox="0 0 200 200" */
  /* > */ 
  /*   <path */ 
  /*     fill="#F1C21B" */ 
  /*     d="M31.6,-48.3C38.5,-38.6,39.8,-25.9,42,-14.7C44.2,-3.4,47.3,6.5,47.1,17.9C47,29.4,43.7,42.4,35.3,50.8C26.9,59.1,13.4,62.7,0.5,62C-12.4,61.3,-24.9,56.3,-35.4,48.7C-45.9,41,-54.5,30.8,-60.9,18.1C-67.2,5.5,-71.3,-9.5,-64.9,-18.6C-58.6,-27.7,-41.7,-31,-29.1,-38.8C-16.6,-46.7,-8.3,-59.2,2.1,-62.1C12.4,-64.9,24.8,-58,31.6,-48.3Z" */ 
  /*     transform="translate(100 100)" */
  /*   /> */
  /* </svg> */
</script>

<svelte:window bind:scrollY={scrollY} />

<div class="container" class:show on:click={scrollToBottom}>
  Hire Me!
</div>

<style>

.container {
  background-image: url('hire-me.gif');
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
