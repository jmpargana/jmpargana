<script>
  import Card from './Card.svelte'

  const projects = [
    {
      title: 'Share Your Recipes',
      description: 'Blazing fast Full-stack app written with a Svelte/Go/Postgres tech-stack. You can store and fetch your favorite recipes using tag-based search.',
      gif: '/recipes.gif',
      github: 'https://github.com/jmpargana/recipes',
      link: 'http://shareurrecipes.com',
    },
    {
      title: 'Digital Store',
      description: 'Complete UI component library written in Vuejs and CSS to be used in all Salvador Caetano Apps.',
      gif: '/digitalstore.gif',
      github: 'https://github.com/jmpargana',
      link: 'https://www.carplus.pt/',
    },
    {
      title: 'Pflegewaechter',
      description: 'PWA with complex forms and an automatic pipeline to generate juridical records. Written in React/Typescript/Kotlin/Quarkus/MongoDB.',
      gif: '/pflegewaechter.gif',
      github: 'https://github.com/jmpargana',
      link: 'https://app.pflegewaechter.de/'
    },
  ]
</script>


<div class="work-outer">
  <div class="work-inner">
    <div class="title-wrapper">
      <h2>Portfolio</h2>
    </div>
    <div class="col">
      {#each projects as project}
        <Card 
          title={project.title} 
          description={project.description} 
          gif={project.gif} 
          link={project.link}
          github={project.github}
        />
      {/each}
    </div>
  </div>
</div>


<style>
.work-outer {
  display: flex;
  justify-content: center;
  margin-bottom: 12rem;
  position: relative;
  padding: 2rem;
}

.work-inner {
  width: 100%;
}

.col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-wrap: wrap;
  gap: 6rem;
}

h2 {
  width: 1600px;
}

.title-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 5rem;
}

</style>

