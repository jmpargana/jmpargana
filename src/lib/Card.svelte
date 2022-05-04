<script>
  import Fa from 'svelte-fa/src/fa.svelte'
  import { 
    faGithub, 
  } from '@fortawesome/free-brands-svg-icons'

  export let title = "Share Your Recipes"
  export let description = "Short description"
  export let gif = "https://s3.eu-central-1.amazonaws.com/jmpargana.github.io/stack.gif"
  export let github = ""
  export let link = ""

  export let offsetX
  export let offsetY
  const friction = 1/32

  /* export let offset = "" */


  $: offset = `perspective(600px) rotateY(${offsetX}deg) rotateX(${offsetY}deg)`


  function mouseMove(e) {

    let followX = window.innerWidth / 2 - e.clientX;
    let followY = window.innerHeight / 2 - e.clientY;

    let x = 0,
      y = 0;
    x += (-followX - x) * friction;
    y += (followY - y) * friction;

    offsetX = x
    offsetY = y
  }

</script>

<svelte:body on:mousemove={mouseMove} />


<div class="card" style:transform={offset}>
  <div class="card-header">
    <div class="wrapper" style:transform={offset}>
      <div class="shape" style:background-image={`url(${gif})`} />
    </div>
  </div>
  <div class="content">
    <span class="title">{title}</span>
    <p class="description">{description}</p>
    <div class="icons">
      <Fa icon={faGithub} />
    </div>
  </div>
</div>


<style>

.card {
  border: 1px solid black;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: perspective(600px) rotateY(20deg) rotateX(10deg);
  transform-style: preserve-3d;
}

.card-header {
  height: 300px;
  background-color: gray;
  width: 100%;
}

.content {
  position: relative;
  padding: 2rem;
}

.title {
  font-family: var(--font-heading);
  color: var(--color-primary);
  font-weight: 700;
  font-size: 2rem;
}

.description {
  margin-top: 1rem;
  font-size: 1rem;
}

.card {
  margin-top: 6rem;
  max-width: 450px;
  display: grid;
  place-items: center;
}

.icons {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 0.5rem;
}

</style>
