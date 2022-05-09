<script>
  import FaLongArrowAltRight from 'svelte-icons/fa/FaLongArrowAltRight.svelte'

  export let href="#"
</script>

<div class="link-container">
  <a class="link" target="_blank" href={href}>Visit Website</a>
  <div class="wrapper">
    <div class="icon-wrapper">
      <FaLongArrowAltRight />
    </div>
  </div>
</div>

<style>
.link-container {
  display: flex;
  align-items: center;
  width: 150px;
  justify-content: space-between;
  cursor: pointer;
}

.link-container:hover .wrapper {
  transform: translateX(20px);
}


.wrapper {
  transition: all 200ms linear;
}

.link {
  color: var(--color-primary);
  text-decoration: none !important;
} 

.icon-wrapper {
  color: var(--color-primary);
  height: 24px;
  width: 24px;
}
</style>
