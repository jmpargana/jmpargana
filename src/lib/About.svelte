<script>
  import Btn from './Btn.svelte'
  import Reveal from './Reveal.svelte'
  import { fade, fly } from 'svelte/transition'

  let title
  let paragraph
  let button

</script>

<div class="about-outer">
  <div class="about-inner">
    <Reveal node={title}>
      <h2 transition:fade={{delay: 500}}>About</h2>
    </Reveal>
    <Reveal node={paragraph}>
      <p transition:fly={{y: 50, duration: 2000}}>Joao Pargana is both artist and scientist. His broad range of interests and skills manifest in his work as a web developer. Sensibility in the aesthetics of design and precision in the engineering of reliable tools, combine in a highly communicative UI experience.</p>
    </Reveal>
    <Reveal node={button}>
      <div transition:fly={{y: 100, duration: 3000}}>
        <Btn label="Download Resume" on:click={() => window.open("https://github.com/jmpargana/jmpargana", "_blank")} />
      </div>
    </Reveal>
  </div>


</div>


<style>
.about-outer {
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  /* min-height: 50vh; */
  z-index: 2;
  position: relative;
}

h2 {
  margin-bottom: 2rem;
}

.about-inner {
  max-width: 800px;
}

p {
  text-align: justify;
  text-justify: inter-word;
  margin-bottom: 4rem;
}

</style>

