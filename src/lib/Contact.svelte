<script>
  import { createForm } from 'felte'
  import Btn from './Btn.svelte'
  import IntersectionObserver from 'svelte-intersection-observer'

  const { form } = createForm({
    onSubmit: (values) => {
      console.log(values)
    }
  })

  let node
  let intersecting
</script>


<div class="contact" class:intersected={intersecting}>

<IntersectionObserver element={node} bind:intersecting>
  <div class="form-outer" bind:this={node}>
    <h2>Contact</h2>
    <form class="form-inner" use:form>
      <div class="input-container">
        <input name="email" id="email" class="input" type="text" placeholder=" " />
        <div class="cut"></div>
        <label for="email" class="placeholder">Email</label>
      </div>
      <div class="input-container">
        <textarea name="message" id="message" class="input" placeholder=" " rows="8" cols="50" />
        <div class="cut"></div>
        <label for="message" class="placeholder">Message</label>
      </div>
      <div type="submit">
        <Btn label="Hire me at Google" />
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


</style>
