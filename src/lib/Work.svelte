<script>
  import Card from './Card.svelte'
  import Waver from './Waver.svelte'

  const projects = [
    {
      title: 'Share Your Recipes',
      description: 'Blazing fast Full-stack app written with a Svelte/Go/Postgres tech-stack. You can store and fetch your favorite recipes using tag-based search.',
      gif: 'https://s3.eu-central-1.amazonaws.com/jmpargana.github.io/stack.gif',
      github: '',
      link: '',
    },
    {
      title: 'Digital Store',
      description: 'Complete UI component library written in Vuejs and CSS to be used in all Salvador Caetano Apps.',
      gif: 'https://s3.eu-central-1.amazonaws.com/jmpargana.github.io/asa.gif',
      github: '',
      link: '',
    },
    {
      title: 'Pflegewaechter',
      description: 'PWA with complex forms and an automatic pipeline to generate juridical records. Written in React/Typescript/Kotlin/Quarkus/MongoDB.',
      gif: 'https://s3.eu-central-1.amazonaws.com/jmpargana.github.io/whatsapp.gif',
      github: '',
      link: ''
    },
  ]
</script>


<div class="work-outer">
  <div class="work-inner">
    <h2>Portfolio</h2>
    <div class="row">
      {#each projects as project}
        <Card title={project.title} description={project.description} gif={project.gif} />
      {/each}
    </div>
  </div>
  <div class="fixed">
    <Waver />
  </div>
</div>


<style>
.work-outer {
  display: flex;
  justify-content: center;
  margin-bottom: 12rem;
  position: relative;
}

.fixed {
  position: absolute;
  bottom: 0;
  right: 0;
}

.row {
  display: flex;
  align-items: center;
  gap: 6rem;
  /* justify-content: center; */
  flex-wrap: wrap;
  max-width: 1000px;
}

h2 {
  margin-bottom: 3rem;
}

</style>

