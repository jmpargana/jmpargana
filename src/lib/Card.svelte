<script>
  import Fa from 'svelte-fa/src/fa.svelte'
  import Link from './Link.svelte'
  import { 
    faGithub, 
  } from '@fortawesome/free-brands-svg-icons'

  export let title = ""
  export let description = ""
  export let gif = ""
  export let github = ""
  export let link = ""

  function handleVisit() {
    window.open(github, "_blank")
  }

</script>


<div class="card">
  <div class="card-header" style:background-image={`url('${gif}')`} />
  <div class="content">
    <span class="title">{title}</span>
    <p class="description">{description}</p>
    <div class="link">
      <Link href={link}>Visit</Link>
    </div>
    <div class="icons" on:click={handleVisit}>
      <span class="code">Code</span>
      <Fa icon={faGithub} />
    </div>
  </div>
</div>


<style>

.link {
  position: absolute;
  bottom: 2rem;
  right: 3rem;
}

.card {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  border-radius: 2rem;
  display: flex;
  max-width: 1000px;
  flex-direction: column;
  overflow: hidden;
}

.code {
  font-size: 1rem;
}

.card-header {
  height: 250px;
  width: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

@media (min-width: 800px) {
  .card-header {
    height: 300px;
  }
}

.content {
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  position: relative;
  padding: 2rem;
  height: 250px;
  border-radius: 2rem;
}

.title {
  font-family: var(--font-heading);
  /* color: var(--color-primary); */
  font-weight: 700;
  font-size: 2rem;
}

.description {
  margin-top: 1rem;
  font-size: 1rem;
}

.icons {
  cursor: pointer;
  border-radius: 2rem;
  background-color: #E0E0E0;
  padding: 0.2rem 1.2rem;
  position: absolute;
  top: 2.5rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 100ms linear;
}

.icons:hover {
  transform: rotate(10deg);
}

</style>
