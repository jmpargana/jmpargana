<script>
  import { createForm } from 'felte'
  import Btn from './Btn.svelte'
  import IntersectionObserver from 'svelte-intersection-observer'
  import Fa from 'svelte-fa/src/fa.svelte'
  import { 
    faCheck, 
  } from '@fortawesome/free-solid-svg-icons'
  import { draw } from 'svelte/transition'
  import { quintOut } from 'svelte/easing'

  const { form, errors } = createForm({
    validate: (values) => {
      const errors = {}
      if (!values.email || !/^[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(values.email)) {
        errors.email = 'Must be a valid email';
      }
      if (!values.message) errors.message = 'Must exist'
      return errors;
    },
  })

  let node
  let intersecting
  let show = false

  $: if (show) {
    setTimeout(() => show = false, 2000)
  }


</script>


<div class="contact" class:intersected={intersecting}>

{#if show}
  <div class="overlay">
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16">
      <path 
        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path 
        in:draw={{duration: 1500, easing: quintOut}}
        fill="none"
        stroke="green"
        stroke-width="1px"
        d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
    </svg>
  </div>
{/if}

<IntersectionObserver element={node} bind:intersecting>
  <div class="form-outer" bind:this={node}>
    <h2>Contact</h2>
    <form 
      class="form-inner" 
      use:form 
      action="https://formspree.io/f/jmpargana@gmail.com" 
      method="post"
      on:feltesuccess={() => show = true}
    >
      <div class="input-container">
        <input class:error={$errors.email} name="email" id="email" class="input" type="text" placeholder=" " />
        <div class:error-label={$errors.email} class="cut"></div>
        <label class:error-label={$errors.email} for="email" class="placeholder">Email</label>
      </div>
      <div class="input-container">
        <textarea class:error={$errors.message} name="message" id="message" class="input" placeholder=" " rows="8" cols="50" />
        <div class:error-label={$errors.message} class="cut"></div>
        <label class:error-label={$errors.message} for="message" class="placeholder">Message</label>
      </div>
      <div type="submit">
        <Btn label="Submit Your Message" />
      </div>
    </form>
  </div>
</IntersectionObserver>

</div>


<style>


.contact {
  padding-top: 12rem;
  padding-bottom: 12rem;
  background-color: white;
  transition: all 1s ease;
  height: 100vh;

  display: flex;
  justify-content: center;
}

.contact.intersected {
  background-color: #15172b;
}

h2 {
  color: white;
  margin-bottom: 3rem;
}


.form-inner {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-outer {
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  max-width: 600px;
}

.input {
  border: 2px solid #473bd4;
  padding: 1rem 2rem;
  border-radius: 2rem;
}

@media (min-width: 800px) {
  .form-outer {
    padding: 0;
  }
}

.input-container {
  min-height: 50px;
  position: relative;
  width: 100%;
}

.input {
  background-color: #303245;
  border-radius: 2rem;
  border: 0;
  box-sizing: border-box;
  color: #eee;
  font-size: 18px;
  height: 100%;
  outline: 0;
  padding: 4px 20px 0;
  width: 100%;
}

.cut {
  /* background-color: white; */
  background-color: #15172b;
  border-radius: 10px;
  height: 20px;
  left: 20px;
  position: absolute;
  top: -20px;
  transform: translateY(0);
  transition: transform 200ms;
  width: 76px;
}

.input:focus ~ .cut,
.input:not(:placeholder-shown) ~ .cut {
  transform: translateY(8px);
}

.placeholder {
  color: #65657b;
  font-family: sans-serif;
  left: 20px;
  line-height: 14px;
  pointer-events: none;
  position: absolute;
  transform-origin: 0 50%;
  transition: transform 200ms, color 200ms;
  top: 20px;
}

.input:focus ~ .placeholder,
.input:not(:placeholder-shown) ~ .placeholder {
  transform: translateY(-30px) translateX(10px) scale(0.75);
}

.input:not(:placeholder-shown) ~ .placeholder {
  color: #808097;
}

.input:focus ~ .placeholder {
  color: #fff;
}

.overlay {
  top: 0;
  left: 0;
  position: fixed;
  display: grid;
  place-items: center;
  height: 95vh;
  width: 100vw;
  z-index: 50;
  background-color: #15172b;
  opacity: 0.8;
}


.error {
  border: 1px solid #c62828;
  animation: shake 300ms;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.error-label {
  color: #c62828;
}

</style>
