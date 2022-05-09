<script>
  import Link from './Link.svelte'

  import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
  /* import Fa from 'svelte-fa/src/fa.svelte' */
  /* import { */ 
  /*   faGithub, */ 
  /* } from '@fortawesome/free-brands-svg-icons' */

  export let title = ""
  export let description = ""
  export let gif = ""
  export let github = ""
  export let link = ""

  function handleVisit() {
    window.open(github, "_blank")
  }

</script>


<div class="card-wrapper">
  <div class="card-header" style:background-image={`url('${gif}')`} />
  <div class="content-wrapper">
    <div class="content">
      <span class="title">{title}</span>
      <p class="description">{description}</p>
      <div class="link">
        <Link href={link}>Visit</Link>
      </div>
      <div class="icons" on:click={handleVisit}>
        <span class="code">Code</span>
        <div class="icon">
          <FaGithub class="icon" />
        </div>
      </div>
    </div>
  </div>
</div>


<style>

.link {
  position: absolute;
  bottom: 2rem;
  right: 3rem;
}

.content-wrapper {
  position: relative;
  height: 350px;
  width: 90%;
}


.card-wrapper {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  max-width: 1200px;
}

.code {
  font-size: 1rem;
}

.card-header {
  aspect-ratio: 16 / 9;
  border-radius: 2rem;
  max-width: 1200px;
  width: 100%;
  box-shadow: 0 10px 20px rgba(233,30,99, 0.19), 0 6px 6px rgba(230, 30, 99,0.23);
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.content {
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  position: absolute;
  max-width: 500px;
  padding: 2rem;
  padding-top: 4rem;
  height: 350px;
  background-color: white;
  bottom: 1rem;
  right: -2rem;
  border-radius: 2rem;
}


@media (min-width: 600px) {
  .content {
    padding-top: 2rem;
    height: 250px;
    right: -3rem;
    bottom: 4rem;
  }  

  .content-wrapper {
    height: 250px;
  }
}

@media (min-width: 1000px) {
  .content {
    right: -5rem;
    bottom: 8rem;
  }  
}

@media (min-width: 1200px) {
  .content {
    right: -8rem;
    bottom: 8rem;
  }  
}


.title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.5rem;
}

.description {
  margin-top: 1rem;
  font-size: 1rem;
  word-break: break-word;
}

.icons {
  cursor: pointer;
  border-radius: 2rem;
  background-color: #E0E0E0;
  padding: 0.2rem 1.2rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 100ms linear;
}

.icons:hover {
  transform: rotate(10deg);
}

.icon {
  height: 24px;
  width: 24px;
}

</style>
