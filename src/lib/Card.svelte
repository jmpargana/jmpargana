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
</script>


<div class="card">
  <div class="card-header">
    <div class="wrapper">
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
}

.card-header {
  height: 300px;
  background-color: gray;
  width: 100%;
}

.content {
  position: relative;
  padding: 2rem;
  height: 250px;
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
